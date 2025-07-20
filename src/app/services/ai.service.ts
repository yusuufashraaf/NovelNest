import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environment';

export interface BookRecommendation {
  title: string;
  author: string;
  genre: string;
  description: string;
  why_recommended: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: BookRecommendation[];
}

export interface PDFSummaryResponse {
  success: boolean;
  summary: string;
  pageCount: number;
  info: {
    title: string;
    author: string;
    subject: string;
  };
}

export interface SearchRecommendResponse {
  success: boolean;
  books: any[];
  aiInsights: string;
  totalFound: number;
}

export interface ReadingInsightsResponse {
  success: boolean;
  insights: string;
  booksAnalyzed?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/v1/ai`;

  // Store chat messages in memory
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // Session management
  private sessionId: string = this.generateSessionId();

  constructor() {
    // Load messages from localStorage if available
    const savedMessages = localStorage.getItem('ai-chat-messages');
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        this.messagesSubject.next(messages);
      } catch (e) {
        console.error('Failed to load saved messages');
      }
    }
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getRecommendations(
    preferences: string,
    genres: string[],
    previousBooks: string[]
  ): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(
      `${this.apiUrl}/recommendations`,
      { preferences, genres, previousBooks },
      { headers: this.getAuthHeaders() }
    );
  }

  chatWithAI(message: string): Observable<ChatResponse> {
    // Add user message to history
    this.addMessage({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    return this.http
      .post<ChatResponse>(
        `${this.apiUrl}/chat`,
        { message, sessionId: this.sessionId },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            // Add AI response to history
            this.addMessage({
              role: 'assistant',
              content: response.message,
              timestamp: new Date(),
            });
          }
        })
      );
  }

  // Public chat without authentication
  publicChat(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat/public`, {
      message,
      sessionId: this.sessionId,
    });
  }

  summarizePDF(file: File): Observable<PDFSummaryResponse> {
    const formData = new FormData();
    formData.append('pdf', file, file.name);

    return this.http.post<PDFSummaryResponse>(
      `${this.apiUrl}/summarize-pdf`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  searchAndRecommend(query: string): Observable<SearchRecommendResponse> {
    return this.http.post<SearchRecommendResponse>(
      `${this.apiUrl}/search-recommend`,
      { query },
      { headers: this.getAuthHeaders() }
    );
  }

  getReadingInsights(): Observable<ReadingInsightsResponse> {
    return this.http.get<ReadingInsightsResponse>(
      `${this.apiUrl}/reading-insights`,
      { headers: this.getAuthHeaders() }
    );
  }

  clearConversation(): Observable<any> {
    // Clear local messages
    this.messagesSubject.next([]);
    localStorage.removeItem('ai-chat-messages');

    // Generate new session ID
    this.sessionId = this.generateSessionId();

    // Clear on server
    return this.http.post(
      `${this.apiUrl}/clear-conversation`,
      { sessionId: this.sessionId },
      { headers: this.getAuthHeaders() }
    );
  }

  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);

    // Save to localStorage (keep only last 50 messages)
    const messagesToSave = updatedMessages.slice(-50);
    localStorage.setItem('ai-chat-messages', JSON.stringify(messagesToSave));
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  // Format recommendations as a chat message
  formatRecommendationsAsMessage(
    recommendations: BookRecommendation[]
  ): string {
    if (!recommendations || recommendations.length === 0) {
      return "I couldn't find any recommendations based on your preferences. Please try with different criteria.";
    }

    let message = '📚 Here are my book recommendations for you:\n\n';

    recommendations.forEach((book, index) => {
      message += `**${index + 1}. ${book.title}** by ${book.author}\n`;
      message += `📖 *Genre:* ${book.genre}\n`;
      message += `📝 *Description:* ${book.description}\n`;
      message += `💡 *Why I recommend it:* ${book.why_recommended}\n\n`;
    });

    message += 'Would you like more information about any of these books?';

    return message;
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Reset session (keeps messages but creates new session)
  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  // Export chat history
  exportChatHistory(): string {
    const messages = this.messagesSubject.value;
    const exportData = {
      sessionId: this.sessionId,
      exportDate: new Date().toISOString(),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import chat history
  importChatHistory(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.messages && Array.isArray(importData.messages)) {
        const messages = importData.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));

        this.messagesSubject.next(messages);
        localStorage.setItem('ai-chat-messages', JSON.stringify(messages));

        if (importData.sessionId) {
          this.sessionId = importData.sessionId;
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import chat history:', error);
      return false;
    }
  }

  // Search for book in messages
  searchInChat(searchTerm: string): ChatMessage[] {
    const messages = this.messagesSubject.value;
    return messages.filter((msg) =>
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get recommendation history from messages
  getRecommendationHistory(): BookRecommendation[] {
    const messages = this.messagesSubject.value;
    const recommendations: BookRecommendation[] = [];

    messages.forEach((msg) => {
      if (
        msg.role === 'assistant' &&
        msg.content.includes('📚 Here are my book recommendations')
      ) {
        // Parse recommendations from message content
        const lines = msg.content.split('\n');
        let currentRecommendation: Partial<BookRecommendation> = {};

        lines.forEach((line) => {
          const titleMatch = line.match(/\*\*\d+\.\s+(.+?)\*\*\s+by\s+(.+)/);
          if (titleMatch) {
            if (currentRecommendation.title) {
              recommendations.push(currentRecommendation as BookRecommendation);
            }
            currentRecommendation = {
              title: titleMatch[1],
              author: titleMatch[2],
            };
          } else if (line.includes('*Genre:*')) {
            currentRecommendation.genre = line
              .replace(/.*\*Genre:\*\s*/, '')
              .trim();
          } else if (line.includes('*Description:*')) {
            currentRecommendation.description = line
              .replace(/.*\*Description:\*\s*/, '')
              .trim();
          } else if (line.includes('*Why I recommend it:*')) {
            currentRecommendation.why_recommended = line
              .replace(/.*\*Why I recommend it:\*\s*/, '')
              .trim();
          }
        });

        if (currentRecommendation.title) {
          recommendations.push(currentRecommendation as BookRecommendation);
        }
      }
    });

    return recommendations;
  }

  // Analytics: Get chat statistics
  getChatStatistics(): {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    recommendationsReceived: number;
    averageMessageLength: number;
  } {
    const messages = this.messagesSubject.value;
    const userMessages = messages.filter((m) => m.role === 'user');
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    const recommendationMessages = assistantMessages.filter((m) =>
      m.content.includes('📚 Here are my book recommendations')
    );

    const totalLength = messages.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    );

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      recommendationsReceived: recommendationMessages.length,
      averageMessageLength:
        messages.length > 0 ? Math.round(totalLength / messages.length) : 0,
    };
  }

  // Get suggested questions based on context
  getSuggestedQuestions(): string[] {
    const messages = this.messagesSubject.value;
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || messages.length === 0) {
      return [
        'What are the best books for beginners?',
        'Recommend a mystery novel',
        "What's trending in fiction?",
        'Tell me about classic literature',
        'Suggest a book like Harry Potter',
      ];
    }

    // Context-aware suggestions
    if (lastMessage.content.toLowerCase().includes('mystery')) {
      return [
        'Who are the best mystery authors?',
        'What about psychological thrillers?',
        'Classic vs modern mystery novels?',
        'Mystery series recommendations?',
        'International mystery books?',
      ];
    }

    if (lastMessage.content.toLowerCase().includes('fantasy')) {
      return [
        'Epic fantasy recommendations?',
        'Urban fantasy suggestions?',
        'Fantasy series for beginners?',
        'Books similar to Lord of the Rings?',
        'Young adult fantasy books?',
      ];
    }

    if (lastMessage.content.toLowerCase().includes('recommendation')) {
      return [
        'Tell me more about the first book',
        'Any similar authors?',
        'Where can I find these books?',
        'Which one should I start with?',
        'Are these available as audiobooks?',
      ];
    }

    // Default suggestions
    return [
      'What genres do you recommend?',
      'Best books of this year?',
      'Book club suggestions?',
      'Quick reads for busy people?',
      'Books that changed your life?',
    ];
  }
}
