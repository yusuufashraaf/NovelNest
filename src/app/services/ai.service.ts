import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  tap,
  catchError,
  throwError,
  of,
  map,
  delay,
} from 'rxjs';
import { environment } from '../../environment';

export interface BookRecommendation {
  title: string;
  author: string;
  genre: string;
  description: string;
  why_recommended: string;
  rating?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  id?: string;
  isLoading?: boolean;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

export interface RecommendationResponse {
  success: boolean;
  recommendations: BookRecommendation[];
  totalRecommendations: number;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private http = inject(HttpClient);

  // ✅ Secure backend API endpoints
  private backendUrl = environment.apiUrl || 'http://localhost:5002';
  private chatEndpoint = `${this.backendUrl}/api/v1/ai/chat`;
  private recommendationsEndpoint = `${this.backendUrl}/api/v1/ai/recommendations`;

  // 🔧 Intelligent AI mode with contextual responses - enabled for better UX when backend is unavailable
  private useMockMode = true;

  // Simple message storage
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  // Categories cache
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  // Session management
  private sessionId: string = this.generateSessionId();

  constructor() {
    this.loadMessagesFromStorage();
    this.initializeWelcomeMessage();
    this.loadCategories();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('AI Service Error:', error);

    let errorMessage = 'An unexpected error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    return throwError(() => ({ error: { message: errorMessage } }));
  };

  // 🔧 Intelligent contextual responses
  private getMockChatResponse(message: string): Observable<any> {
    const lowerMessage = message.toLowerCase();
    let response = '';

    // Programming related questions
    if (
      lowerMessage.includes('programming') ||
      lowerMessage.includes('coding') ||
      lowerMessage.includes('software') ||
      lowerMessage.includes('development')
    ) {
      if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
        response = `Great question about studying programming! Here are some effective approaches:

**📚 Recommended Programming Books:**
- **"Clean Code" by Robert C. Martin** - Essential for writing maintainable code
- **"The Pragmatic Programmer" by David Thomas** - Practical advice for developers
- **"You Don't Know JS" series by Kyle Simpson** - Deep dive into JavaScript

**💡 Study Tips:**
1. **Practice coding daily** - Consistency is key
2. **Build projects** - Apply what you learn immediately
3. **Read others' code** - Learn from experienced developers
4. **Join coding communities** - Stack Overflow, GitHub, Reddit
5. **Take breaks** - Avoid burnout with proper rest

**🎯 Recommended Learning Path:**
1. Choose one language to start (Python, JavaScript, or Java are beginner-friendly)
2. Master the fundamentals before moving to frameworks
3. Build small projects to reinforce concepts
4. Contribute to open-source projects

Would you like book recommendations for a specific programming language?`;
      } else if (lowerMessage.includes('book')) {
        response = `Here are excellent programming books by category:

**For Beginners:**
- **"Python Crash Course" by Eric Matthes**
- **"Eloquent JavaScript" by Marijn Haverbeke**
- **"Head First Java" by Kathy Sierra**

**For Intermediate:**
- **"Effective Java" by Joshua Bloch**
- **"JavaScript: The Good Parts" by Douglas Crockford**
- **"Design Patterns" by Gang of Four**

**For Advanced:**
- **"Structure and Interpretation of Computer Programs" by Abelson & Sussman**
- **"Compilers: Principles, Techniques, and Tools" by Aho, Lam, Sethi, and Ullman**

What programming language are you most interested in?`;
      } else {
        response = `I'd be happy to help with programming topics! Are you looking for:

- 📖 **Book recommendations** for specific languages or concepts?
- 🎯 **Learning paths** for becoming a better programmer?
- 💼 **Career advice** for software development?
- 🔧 **Tools and resources** for coding?

Feel free to ask about any programming-related topic!`;
      }
    }

    // Book recommendation requests
    else if (
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('suggestion') ||
      lowerMessage.includes('book')
    ) {
      if (lowerMessage.includes('fantasy')) {
        response = `🧙‍♂️ **Fantasy Book Recommendations:**

**Epic Fantasy:**
- **"The Name of the Wind" by Patrick Rothfuss** - Beautiful prose and compelling magic system
- **"The Way of Kings" by Brandon Sanderson** - Complex world-building and unique magic
- **"The Fifth Season" by N.K. Jemisin** - Award-winning and groundbreaking

**Urban Fantasy:**
- **"The Dresden Files" series by Jim Butcher** - Modern wizard detective stories
- **"Rivers of London" by Ben Aaronovitch** - Magic meets police procedural

What type of fantasy appeals to you most? Epic adventures, urban settings, or something else?`;
      } else if (lowerMessage.includes('fiction')) {
        response = `📖 **Fiction Recommendations:**

**Contemporary Fiction:**
- **"The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid** - Captivating Hollywood story
- **"Where the Crawdads Sing" by Delia Owens** - Beautiful coming-of-age tale

**Literary Fiction:**
- **"Klara and the Sun" by Kazuo Ishiguro** - Thought-provoking and emotionally resonant
- **"The Midnight Library" by Matt Haig** - Philosophical exploration of life's possibilities

**Historical Fiction:**
- **"All the Light We Cannot See" by Anthony Doerr** - WWII story with beautiful writing
- **"The Book Thief" by Markus Zusak** - Unique perspective on wartime Germany

What mood are you in for? Something uplifting, thought-provoking, or emotional?`;
      } else {
        response = `I'd love to help you find your next great read! To give you the best recommendations, could you tell me:

🎯 **What genres interest you?** (Fantasy, Mystery, Romance, Sci-Fi, Non-fiction, etc.)
📚 **What was the last book you loved?**
🎭 **What mood are you in for?** (Light & fun, deep & thoughtful, exciting & fast-paced)
⏰ **Any preference for book length?**

Or feel free to just tell me what you're curious about - I'm here to help you discover amazing books!`;
      }
    }

    // Science fiction requests
    else if (
      lowerMessage.includes('sci-fi') ||
      lowerMessage.includes('science fiction')
    ) {
      response = `🚀 **Science Fiction Recommendations:**

**Space Opera:**
- **"Dune" by Frank Herbert** - Epic space politics and ecology
- **"The Expanse" series by James S.A. Corey** - Realistic near-future space adventure

**Hard Sci-Fi:**
- **"Project Hail Mary" by Andy Weir** - Problem-solving in space with humor
- **"The Martian" by Andy Weir** - Survival story with real science

**Dystopian:**
- **"1984" by George Orwell** - Classic surveillance state warning
- **"The Handmaid's Tale" by Margaret Atwood** - Powerful feminist dystopia

**Cyberpunk:**
- **"Neuromancer" by William Gibson** - Foundational cyberpunk novel
- **"Snow Crash" by Neal Stephenson** - Virtual reality and linguistics

What type of sci-fi interests you most?`;
    }

    // General questions about reading
    else if (lowerMessage.includes('read') || lowerMessage.includes('author')) {
      response = `📚 I'm passionate about helping readers discover great books! Here are some ways I can assist:

**📖 Book Recommendations** - Tell me your favorite genres or recent reads
**✍️ Author Suggestions** - Based on writers you already enjoy
**🎯 Reading Goals** - Help you find books for specific purposes
**📊 Book Lists** - Curated selections for different moods and interests

**Popular Categories I Can Help With:**
- Fiction (Literary, Contemporary, Historical)
- Fantasy & Science Fiction
- Mystery & Thriller
- Non-fiction (Biography, Self-help, Science)
- Programming & Technical books
- Classics & Literature

What type of reading experience are you looking for today?`;
    }

    // Study and learning questions
    else if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      response = `📖 **Effective Studying Strategies:**

**📚 Reading & Retention:**
- **Active reading** - Take notes and ask questions while reading
- **Spaced repetition** - Review material at increasing intervals
- **Teach others** - Explaining concepts reinforces your understanding

**📝 Study Techniques:**
- **Pomodoro Technique** - 25-minute focused sessions with breaks
- **Mind mapping** - Visual organization of concepts
- **Practice testing** - Quiz yourself regularly

**📖 Great Books for Learning How to Learn:**
- **"Make It Stick" by Peter Brown** - Science-based learning strategies
- **"Peak" by Anders Ericsson** - Principles of deliberate practice
- **"A Mind for Numbers" by Barbara Oakley** - Learning math and science effectively

What subject are you trying to study? I can recommend specific books and strategies!`;
    }

    // Default response for other questions
    else {
      response = `I'm here to help you discover amazing books and discuss literature! 📚

**I can help you with:**
- 🎯 **Book recommendations** based on your interests
- 📖 **Author suggestions** similar to ones you enjoy
- 🔍 **Genre exploration** - find new types of books to try
- 📚 **Reading goals** - books for specific purposes or learning
- 💡 **Discussion** about books, authors, and reading

**Popular topics I love discussing:**
- Programming & tech books
- Fiction recommendations (fantasy, sci-fi, literary, etc.)
- Non-fiction for personal growth
- Study strategies and learning resources

What would you like to explore today? Feel free to ask about any book-related topic!`;
    }

    return of({
      success: true,
      message: response,
    }).pipe(delay(1200)); // Realistic response time
  }

  private getMockRecommendations(
    preferences: string,
    categories: string[]
  ): Observable<RecommendationResponse> {
    // Generate contextual recommendations based on preferences and categories
    const allMockBooks: BookRecommendation[] = [
      // Fiction & Literature
      {
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        genre: 'Fiction',
        description:
          'A captivating story about a Hollywood icon revealing her secrets.',
        why_recommended:
          'Perfect for readers who love character-driven stories with glamour and depth.',
        rating: '4.6',
      },
      {
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        genre: 'Fiction',
        description: 'A beautiful coming-of-age mystery set in the marshlands.',
        why_recommended:
          'Ideal for those who enjoy atmospheric storytelling and nature themes.',
        rating: '4.4',
      },

      // Fantasy
      {
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        genre: 'Fantasy',
        description:
          'Epic fantasy with beautiful prose and compelling magic systems.',
        why_recommended:
          'Must-read for fantasy lovers who appreciate lyrical writing.',
        rating: '4.5',
      },
      {
        title: 'The Priory of the Orange Tree',
        author: 'Samantha Shannon',
        genre: 'Fantasy',
        description:
          'Standalone epic fantasy with dragons and strong female characters.',
        why_recommended:
          'Perfect for readers seeking inclusive, well-crafted fantasy worlds.',
        rating: '4.3',
      },

      // Science Fiction
      {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        description: 'A thrilling space adventure with humor and heart.',
        why_recommended:
          'Great for readers who enjoyed "The Martian" and love problem-solving stories.',
        rating: '4.7',
      },
      {
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        genre: 'Science Fiction',
        description:
          'A beautiful story told from the perspective of an artificial friend.',
        why_recommended:
          'Combines beautiful prose with thought-provoking themes about humanity.',
        rating: '4.3',
      },

      // Programming & Technology
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        genre: 'Programming',
        description: 'A handbook of agile software craftsmanship principles.',
        why_recommended:
          'Essential for developers who want to write maintainable, professional code.',
        rating: '4.4',
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'David Thomas and Andrew Hunt',
        genre: 'Programming',
        description: 'Practical advice for becoming a better programmer.',
        why_recommended:
          'Timeless principles that apply to any programming language or technology.',
        rating: '4.5',
      },

      // Self-Help & Personal Development
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Self-Help',
        description:
          'A proven framework for improving every aspect of your life.',
        why_recommended:
          'Perfect for anyone looking to build better habits and break bad ones.',
        rating: '4.6',
      },
      {
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen R. Covey',
        genre: 'Self-Help',
        description:
          'Timeless principles for personal and professional effectiveness.',
        why_recommended:
          'Classic self-improvement book with actionable insights.',
        rating: '4.3',
      },

      // Mystery & Thriller
      {
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        genre: 'Mystery',
        description: 'A psychological thriller about a marriage gone wrong.',
        why_recommended:
          'Perfect for readers who enjoy dark, twisted psychological narratives.',
        rating: '4.2',
      },
      {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        genre: 'Mystery',
        description:
          'A gripping psychological thriller with an unforgettable twist.',
        why_recommended:
          'Ideal for mystery lovers who enjoy psychological depth.',
        rating: '4.1',
      },

      // Philosophy & Classics
      {
        title: 'Meditations',
        author: 'Marcus Aurelius',
        genre: 'Philosophy',
        description:
          'Timeless wisdom from a Roman emperor and Stoic philosopher.',
        why_recommended:
          'Perfect introduction to Stoicism and practical philosophy.',
        rating: '4.4',
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Classics',
        description:
          'A dystopian masterpiece about surveillance and totalitarianism.',
        why_recommended:
          'Essential reading for understanding modern society and politics.',
        rating: '4.5',
      },
    ];

    // Filter recommendations based on preferences and categories
    let filteredBooks = allMockBooks;

    // Filter by categories if specified
    if (categories.length > 0) {
      const categoryLower = categories.map((cat) => cat.toLowerCase());
      filteredBooks = allMockBooks.filter((book) =>
        categoryLower.some(
          (cat) =>
            book.genre.toLowerCase().includes(cat) ||
            cat.includes(book.genre.toLowerCase()) ||
            (cat.includes('fiction') &&
              book.genre.toLowerCase().includes('fiction')) ||
            (cat.includes('programming') &&
              book.genre.toLowerCase().includes('programming'))
        )
      );
    }

    // If no category matches or preferences include specific terms, expand selection
    const preferencesLower = preferences.toLowerCase();
    if (filteredBooks.length < 3) {
      if (preferencesLower.includes('fantasy')) {
        filteredBooks.push(
          ...allMockBooks.filter((b) => b.genre === 'Fantasy')
        );
      }
      if (
        preferencesLower.includes('sci-fi') ||
        preferencesLower.includes('science fiction')
      ) {
        filteredBooks.push(
          ...allMockBooks.filter((b) => b.genre === 'Science Fiction')
        );
      }
      if (
        preferencesLower.includes('programming') ||
        preferencesLower.includes('coding')
      ) {
        filteredBooks.push(
          ...allMockBooks.filter((b) => b.genre === 'Programming')
        );
      }
      if (
        preferencesLower.includes('mystery') ||
        preferencesLower.includes('thriller')
      ) {
        filteredBooks.push(
          ...allMockBooks.filter((b) => b.genre === 'Mystery')
        );
      }
      if (
        preferencesLower.includes('self-help') ||
        preferencesLower.includes('personal development')
      ) {
        filteredBooks.push(
          ...allMockBooks.filter((b) => b.genre === 'Self-Help')
        );
      }
      if (
        preferencesLower.includes('philosophy') ||
        preferencesLower.includes('classic')
      ) {
        filteredBooks.push(
          ...allMockBooks.filter(
            (b) => b.genre === 'Philosophy' || b.genre === 'Classics'
          )
        );
      }
    }

    // Remove duplicates and limit to 3-4 recommendations
    const uniqueBooks = Array.from(new Set(filteredBooks.map((b) => b.title)))
      .map((title) => filteredBooks.find((b) => b.title === title)!)
      .slice(0, Math.min(4, filteredBooks.length));

    // Fallback to general recommendations if no matches
    if (uniqueBooks.length === 0) {
      uniqueBooks.push(
        allMockBooks.find(
          (b) => b.title === 'The Seven Husbands of Evelyn Hugo'
        )!,
        allMockBooks.find((b) => b.title === 'Project Hail Mary')!,
        allMockBooks.find((b) => b.title === 'Atomic Habits')!
      );
    }

    return of({
      success: true,
      recommendations: uniqueBooks,
      totalRecommendations: uniqueBooks.length,
    }).pipe(delay(2000)); // Simulate network delay
  }

  private loadMessagesFromStorage(): void {
    try {
      const saved = localStorage.getItem('ai_chat_messages');
      if (saved) {
        const messages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        this.messagesSubject.next(messages);
      }
    } catch (error) {
      console.error('Failed to load saved messages:', error);
    }
  }

  private saveMessagesToStorage(): void {
    try {
      const messages = this.messagesSubject.value.slice(-50); // Keep last 50 messages
      localStorage.setItem('ai_chat_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  private initializeWelcomeMessage(): void {
    if (this.messagesSubject.value.length === 0) {
      let welcomeMessage =
        "👋 Welcome to NovelNest AI Assistant! I'm here to help you discover your next great read. Ask me about books, get personalized recommendations, or chat about literature!";

      if (!this.useMockMode) {
        welcomeMessage +=
          "\n\n🤖 I'm powered by Brave MCP Server for enhanced book recommendations and search capabilities.";
      }

      this.addSystemMessage(welcomeMessage);
    }
  }

  // Load categories
  private loadCategories(): void {
    const categories = [
      { id: '1', name: 'Action and adventure', slug: 'action-adventure' },
      { id: '2', name: 'Art & Photography', slug: 'art-photography' },
      { id: '3', name: 'Classics', slug: 'classics' },
      { id: '4', name: 'Cookbooks', slug: 'cookbooks' },
      { id: '5', name: 'Cooking & Food', slug: 'cooking-food' },
      { id: '6', name: 'Education', slug: 'education' },
      { id: '7', name: 'Fantasy', slug: 'fantasy' },
      { id: '8', name: 'Fiction', slug: 'fiction' },
      { id: '9', name: 'Health & Wellness', slug: 'health-wellness' },
      { id: '10', name: 'Historical fiction', slug: 'historical-fiction' },
      { id: '11', name: 'Horror', slug: 'horror' },
      { id: '12', name: 'Philosophy', slug: 'philosophy' },
      { id: '13', name: 'Poetry', slug: 'poetry' },
      { id: '14', name: 'Politics', slug: 'politics' },
      { id: '15', name: 'Programming', slug: 'programming' },
      {
        id: '16',
        name: 'Religion & Spirituality',
        slug: 'religion-spirituality',
      },
      { id: '17', name: 'Science & Technology', slug: 'science-technology' },
      { id: '18', name: 'Self-Help', slug: 'self-help' },
      { id: '19', name: 'Travel', slug: 'travel' },
    ];
    this.categoriesSubject.next(categories);
  }

  // Chat functionality with backend API (with mock fallback)
  chatWithAI(message: string, pendingId?: string): Observable<ChatResponse> {
    // Add user message if no pending ID
    if (!pendingId) {
      this.addMessage({
        role: 'user',
        content: message.trim(),
        timestamp: new Date(),
        id: this.generateMessageId(),
      });
    }

    // Add loading message
    const loadingId = this.generateMessageId();
    this.addMessage({
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      id: loadingId,
      isLoading: true,
    });

    // Use mock mode if enabled
    if (this.useMockMode) {
      return this.getMockChatResponse(message).pipe(
        tap((response) => {
          // Remove loading message
          this.removeMessage(loadingId);

          if (response?.success && response?.message) {
            this.addMessage({
              role: 'assistant',
              content: response.message,
              timestamp: new Date(),
              id: this.generateMessageId(),
            });
          }
        }),
        map((response) => ({
          success: response?.success || false,
          message: response?.message || 'Response received',
          sessionId: this.sessionId,
        }))
      );
    }

    // Get conversation history for context
    const conversationHistory = this.getConversationContext();

    // Prepare backend API request
    const chatPayload = {
      message: message.trim(),
      conversationHistory,
      sessionId: this.sessionId,
    };

    return this.http
      .post<any>(this.chatEndpoint, chatPayload, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          // Remove loading message
          this.removeMessage(loadingId);

          if (response?.success && response?.message) {
            // Enhanced response processing for better formatting
            let processedContent = this.processAIResponse(response.message);

            this.addMessage({
              role: 'assistant',
              content: processedContent,
              timestamp: new Date(),
              id: this.generateMessageId(),
            });
          }
        }),
        map((response) => ({
          success: response?.success || false,
          message: response?.message || 'Response received',
          sessionId: this.sessionId,
        })),
        catchError((error) => {
          // Remove loading message
          this.removeMessage(loadingId);

          // If backend is not available, provide helpful error message
          console.error('Backend connection failed:', error);

          let errorMessage =
            "I apologize, but I'm having trouble connecting to my knowledge base right now. ";

          if (error.status === 0) {
            errorMessage +=
              'Please check if the Brave MCP server is running on port 5002.';
          } else if (error.status === 429) {
            errorMessage +=
              "I'm getting too many requests. Please wait a moment and try again.";
          } else if (error.status >= 500) {
            errorMessage +=
              'There seems to be a server issue. Please try again in a few moments.';
          } else {
            errorMessage += 'Please check your connection and try again.';
          }

          this.addMessage({
            role: 'assistant',
            content: errorMessage,
            timestamp: new Date(),
            id: this.generateMessageId(),
          });

          return throwError(() => ({ error: { message: errorMessage } }));
        })
      );
  }

  // Get conversation context for better responses
  private getConversationContext(): ChatMessage[] {
    const messages = this.messagesSubject.value.slice(-10); // Last 10 messages
    return messages.filter((m) => m.role !== 'system' && !m.isLoading);
  }

  // Enhanced response processing for better formatting from Brave MCP
  private processAIResponse(response: string): string {
    if (!response) return response;

    let processed = response;

    // Clean up excessive whitespace while preserving intentional formatting
    processed = processed
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks to 2
      .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
      .replace(/[ \t]+/g, ' '); // Normalize spaces and tabs

    // Enhanced header detection and formatting
    processed = this.enhanceHeaders(processed);

    // Enhanced list formatting
    processed = this.enhanceLists(processed);

    // Add contextual emojis based on content patterns
    processed = this.addContextualEmojis(processed);

    // Improve paragraph structure
    processed = this.enhanceParagraphStructure(processed);

    // Format code blocks and inline code
    processed = this.enhanceCodeFormatting(processed);

    // Add visual separators for better readability
    processed = this.addVisualSeparators(processed);

    return processed.trim();
  }

  private enhanceHeaders(text: string): string {
    // Convert various header patterns to proper markdown headers
    let processed = text;

    // Handle numbered sections as headers
    processed = processed.replace(
      /^(\d+)\.\s+([A-Z][^:\n]*?)(?::|\n)/gm,
      '\n## $1. $2\n\n'
    );

    // Handle "Here's..." patterns as section headers
    processed = processed.replace(
      /^(Here's?\s+(?:a\s+)?(?:breakdown|summary|overview|guide|how|what|why).*?)(?::|\n)/gim,
      '\n## 📋 $1\n\n'
    );

    // Handle "Let me..." patterns as section headers
    processed = processed.replace(
      /^(Let\s+me\s+(?:suggest|recommend|share|explain|show|tell).*?)(?::|\n)/gim,
      '\n## 💡 $1\n\n'
    );

    // Handle strategy/tips/advice headers
    processed = processed.replace(
      /^((?:Tips|Strategies|Methods|Approaches|Ways|Steps)\s+(?:for|to).*?)(?::|\n)/gim,
      '\n## 🎯 $1\n\n'
    );

    // Handle "Based on..." or "For..." patterns
    processed = processed.replace(
      /^((?:Based\s+on|For\s+(?:example|instance)).*?)(?::|\n)/gim,
      '\n### 📌 $1\n\n'
    );

    // Ensure proper spacing around headers
    processed = processed.replace(/(#{1,6}\s+.*?)(\n)([^#\n\s])/g, '$1\n\n$3');

    return processed;
  }

  private enhanceLists(text: string): string {
    let processed = text;

    // Enhanced numbered list formatting
    processed = processed.replace(
      /^(\d+)\.\s+(.+?)(?=\n\d+\.|\n[A-Z]|\n\n|$)/gm,
      (match, num, content) => {
        // Clean and format the content
        const cleanContent = content.trim();
        return `\n${num}. **${cleanContent}**\n`;
      }
    );

    // Enhanced bullet point formatting with better detection
    processed = processed.replace(
      /^[•\-\*]\s+(.+?)(?=\n[•\-\*]|\n[A-Z]|\n\n|$)/gm,
      (match, content) => {
        const cleanContent = content.trim();
        return `\n• **${cleanContent}**\n`;
      }
    );

    // Handle nested lists (sub-bullets)
    processed = processed.replace(/^[\s]{2,}[•\-\*]\s+(.+?)$/gm, '  ◦ $1');

    // Format bold items in lists
    processed = processed.replace(
      /^([•\-\*]|\d+\.)\s+\*\*(.*?)\*\*\s*:?\s*(.*?)$/gm,
      (match, bullet, title, description) => {
        if (description.trim()) {
          return `${bullet} **${title}:** ${description}`;
        }
        return `${bullet} **${title}**`;
      }
    );

    return processed;
  }

  private addContextualEmojis(text: string): string {
    let processed = text;

    // Add emojis to common patterns (case-insensitive)
    const emojiPatterns = [
      // Programming & Technology
      {
        pattern: /\b(programming|coding|development|software)\b/gi,
        emoji: '💻',
      },
      { pattern: /\b(javascript|python|java|react|angular)\b/gi, emoji: '⚡' },
      { pattern: /\b(database|sql|mongodb)\b/gi, emoji: '🗄️' },
      { pattern: /\b(api|rest|endpoint)\b/gi, emoji: '🔌' },

      // Learning & Education
      { pattern: /\b(learn|study|education|course|tutorial)\b/gi, emoji: '📚' },
      { pattern: /\b(practice|exercise|challenge)\b/gi, emoji: '💪' },
      { pattern: /\b(tip|advice|suggestion)\b/gi, emoji: '💡' },
      { pattern: /\b(resource|tool|platform)\b/gi, emoji: '🔧' },

      // Books & Reading
      { pattern: /\b(book|novel|reading|literature)\b/gi, emoji: '📖' },
      { pattern: /\b(author|writer|writing)\b/gi, emoji: '✍️' },
      { pattern: /\b(fiction|fantasy|sci-fi|mystery)\b/gi, emoji: '🌟' },
      { pattern: /\b(recommend|suggestion|bestseller)\b/gi, emoji: '🎯' },

      // Success & Achievement
      { pattern: /\b(success|achieve|goal|accomplish)\b/gi, emoji: '🎉' },
      { pattern: /\b(excellent|great|fantastic|amazing)\b/gi, emoji: '✨' },
      { pattern: /\b(important|key|essential|crucial)\b/gi, emoji: '🔑' },

      // Community & Social
      { pattern: /\b(community|forum|group|team)\b/gi, emoji: '👥' },
      { pattern: /\b(help|support|assistance)\b/gi, emoji: '🤝' },
      { pattern: /\b(share|sharing|contribute)\b/gi, emoji: '🔄' },

      // Time & Process
      { pattern: /\b(start|begin|first|initial)\b/gi, emoji: '🚀' },
      { pattern: /\b(next|continue|progress|advance)\b/gi, emoji: '➡️' },
      { pattern: /\b(final|complete|finish|end)\b/gi, emoji: '🏁' },
    ];

    // Apply emoji patterns sparingly (only to headers and important text)
    emojiPatterns.forEach(({ pattern, emoji }) => {
      // Add emoji to headers containing the pattern
      processed = processed.replace(
        new RegExp(
          `(#{1,6}\\s+[^\\n]*?)(${pattern.source})([^\\n]*?)\\n`,
          'gmi'
        ),
        `$1$2$3 ${emoji}\n`
      );

      // Add emoji to bold text containing the pattern
      processed = processed.replace(
        new RegExp(`(\\*\\*[^*]*?)(${pattern.source})([^*]*?\\*\\*)`, 'gmi'),
        `$1$2$3 ${emoji}`
      );
    });

    return processed;
  }

  private enhanceParagraphStructure(text: string): string {
    let processed = text;

    // Ensure proper paragraph spacing
    processed = processed.replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2');

    // Format question patterns
    processed = processed.replace(/^([^?\n]*\?)\s*$/gm, '**$1**');

    // Format introductory phrases
    processed = processed.replace(
      /^(To\s+(?:get\s+started|begin|help|understand)|In\s+(?:summary|conclusion|general)|For\s+(?:example|instance))(.+?)$/gim,
      '> **$1$2**'
    );

    return processed;
  }

  private enhanceCodeFormatting(text: string): string {
    let processed = text;

    // Format inline code with backticks
    processed = processed.replace(
      /\b([A-Z][a-zA-Z]*(?:\.[a-zA-Z]+)*|[a-zA-Z]+\(\)|[a-z]+\.[a-z]+|console\.[a-z]+)\b/g,
      (match) => {
        // Only format if it looks like code (has dots, parentheses, or camelCase)
        if (
          match.includes('.') ||
          match.includes('()') ||
          /[a-z][A-Z]/.test(match)
        ) {
          return `\`${match}\``;
        }
        return match;
      }
    );

    // Format file paths and URLs
    processed = processed.replace(
      /([a-zA-Z]:[\\\/][^\s]+|\/[^\s]+\.[a-zA-Z]+|https?:\/\/[^\s]+)/g,
      '`$1`'
    );

    return processed;
  }

  private addVisualSeparators(text: string): string {
    let processed = text;

    // Add visual separators between major sections
    processed = processed.replace(
      /(#{1,2}\s+[^\n]+\n\n)([^#\n])/g,
      '$1---\n\n$2'
    );

    // Add emphasis to call-to-action phrases
    processed = processed.replace(
      /^(Would you like|Feel free to|Don't hesitate to|Try|Consider|Remember to)(.+?)$/gim,
      '> 💬 **$1$2**'
    );

    return processed;
  }

  // Recommendations with backend API (with mock fallback)
  getRecommendations(
    preferences: string,
    selectedCategories: string[] = []
  ): Observable<RecommendationResponse> {
    const categoryNames = selectedCategories
      .map((id) => {
        const category = this.categoriesSubject.value.find(
          (cat) => cat.id === id
        );
        return category?.name || id;
      })
      .join(', ');

    // Add user request message
    this.addMessage({
      role: 'user',
      content: `I'd like book recommendations. My preferences: ${preferences}. Categories: ${categoryNames}`,
      timestamp: new Date(),
      id: this.generateMessageId(),
    });

    // Add loading message
    const loadingId = this.generateMessageId();
    this.addMessage({
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      id: loadingId,
      isLoading: true,
    });

    // Use mock mode if enabled
    if (this.useMockMode) {
      return this.getMockRecommendations(preferences, selectedCategories).pipe(
        tap((response) => {
          // Remove loading message
          this.removeMessage(loadingId);

          if (response?.success && response?.recommendations) {
            // Format recommendations as a readable message
            const formattedMessage = this.formatRecommendationsMessage(
              response.recommendations,
              preferences,
              categoryNames
            );

            this.addMessage({
              role: 'assistant',
              content: formattedMessage,
              timestamp: new Date(),
              id: this.generateMessageId(),
            });
          }
        })
      );
    }

    const recommendationPayload = {
      preferences,
      categories: selectedCategories,
      sessionId: this.sessionId,
    };

    return this.http
      .post<RecommendationResponse>(
        this.recommendationsEndpoint,
        recommendationPayload,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        tap((response) => {
          // Remove loading message
          this.removeMessage(loadingId);

          if (response?.success && response?.recommendations) {
            // Format recommendations as a readable message
            const formattedMessage = this.formatRecommendationsMessage(
              response.recommendations,
              preferences,
              categoryNames
            );

            // Process the formatted message for better display
            const processedMessage = this.processAIResponse(formattedMessage);

            this.addMessage({
              role: 'assistant',
              content: processedMessage,
              timestamp: new Date(),
              id: this.generateMessageId(),
            });
          }
        }),
        catchError((error) => {
          // Remove loading message
          this.removeMessage(loadingId);

          // If backend is not available, fall back to mock mode
          console.warn(
            'Backend recommendations failed, falling back to mock mode:',
            error
          );

          // Show a brief info message about fallback
          this.addMessage({
            role: 'assistant',
            content:
              "I'm using my offline recommendation engine to help you find great books! 📚",
            timestamp: new Date(),
            id: this.generateMessageId(),
          });

          // Fall back to mock recommendations
          return this.getMockRecommendations(
            preferences,
            selectedCategories
          ).pipe(
            tap((response) => {
              if (response?.success && response?.recommendations) {
                // Format recommendations as a readable message
                const formattedMessage = this.formatRecommendationsMessage(
                  response.recommendations,
                  preferences,
                  categoryNames
                );

                // Process the formatted message for better display
                const processedMessage =
                  this.processAIResponse(formattedMessage);

                this.addMessage({
                  role: 'assistant',
                  content: processedMessage,
                  timestamp: new Date(),
                  id: this.generateMessageId(),
                });
              }
            }),
            catchError((fallbackError) => {
              // If even mock mode fails, show error
              console.error('Mock recommendations also failed:', fallbackError);

              this.addMessage({
                role: 'assistant',
                content:
                  "I'm sorry, I'm having trouble generating recommendations right now. Please try asking me directly about specific book genres or topics!",
                timestamp: new Date(),
                id: this.generateMessageId(),
              });

              return throwError(() => ({
                error: { message: 'Recommendations temporarily unavailable' },
              }));
            })
          );
        })
      );
  }

  // Format recommendations into a readable chat message
  private formatRecommendationsMessage(
    recommendations: BookRecommendation[],
    preferences: string,
    categories: string
  ): string {
    let message = `## 📚 Personalized Book Recommendations\n\n`;
    message += `Based on your preferences for "${preferences}"`;
    if (categories) {
      message += ` in the ${categories} categories`;
    }
    message += `, here are my top recommendations:\n\n`;

    recommendations.forEach((book, index) => {
      message += `### ${index + 1}. **${book.title}** by ${book.author}\n`;
      message += `**Genre:** ${book.genre}\n`;
      if (book.rating) {
        const stars = '⭐'.repeat(Math.floor(parseFloat(book.rating)));
        message += `**Rating:** ${stars} (${book.rating}/5)\n`;
      }
      message += `**Description:** ${book.description}\n`;
      message += `**Why I recommend it:** ${book.why_recommended}\n\n`;
    });

    message += `---\n*Would you like more recommendations or details about any of these books?*`;
    return message;
  }

  // Message Management
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Remove a message by ID
  private removeMessage(messageId: string): void {
    const currentMessages = this.messagesSubject.value;
    const updated = currentMessages.filter((m) => m.id !== messageId);
    this.messagesSubject.next(updated);
    this.saveMessagesToStorage();
  }

  // Make addMessage public for the component
  public addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    this.saveMessagesToStorage();
  }

  public addSystemMessage(content: string): void {
    this.addMessage({
      role: 'system',
      content,
      timestamp: new Date(),
      id: this.generateMessageId(),
    });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  // Clear conversation
  clearConversation(): Observable<any> {
    this.messagesSubject.next([]);
    this.saveMessagesToStorage();
    this.sessionId = this.generateSessionId();
    this.initializeWelcomeMessage();

    return of({
      success: true,
      message: 'Conversation cleared',
    });
  }

  // Check if user is authenticated (always returns true now)
  isAuthenticated(): boolean {
    return true; // No authentication required
  }

  // 🔧 Development helpers
  public enableMockMode(enabled: boolean = true): void {
    this.useMockMode = enabled;
  }

  public isMockModeEnabled(): boolean {
    return this.useMockMode;
  }
}
