import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AiService,
  ChatMessage,
  BookRecommendation,
} from '../../services/ai.service';
import { Subscription } from 'rxjs';
import { SafePipe } from '../../pipes/safe.pipe-pipe';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './ai-chat.html',
  styleUrls: ['./ai-chat.css'],
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private aiService = inject(AiService);
  private subscriptions = new Subscription();

  // UI State
  isOpen = signal(false);
  isLoading = signal(false);
  activeTab = signal<'chat' | 'recommendations' | 'pdf'>('chat');
  error = signal<string | null>(null);

  // Chat State
  messages = signal<ChatMessage[]>([]);
  inputMessage = signal('');

  // Recommendation Form State
  preferences = signal('');
  selectedGenres = signal<string[]>([]);
  previousBooksInput = signal('');
  recommendations = signal<BookRecommendation[]>([]);

  // PDF Upload State
  selectedFile = signal<File | null>(null);
  pdfSummary = signal<any>(null);
  uploadProgress = signal(0);

  // Available genres
  genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Fantasy',
    'Thriller',
    'Biography',
    'Self-Help',
    'History',
    'Horror',
    'Poetry',
    'Drama',
    'Adventure',
    'Children',
    'Young Adult',
    'Graphic Novel',
    'Cookbook',
    'Travel',
    'Art',
  ];

  // Quick action suggestions
  quickActions = [
    "What's trending in fiction?",
    'Recommend a mystery novel',
    'Best books for beginners',
    'Classic literature suggestions',
    'Latest bestsellers',
  ];

  // Computed properties
  isAuthenticated = computed(() => this.aiService.isAuthenticated());
  previousBooks = computed(() =>
    this.previousBooksInput()
      .split(',')
      .map((b) => b.trim())
      .filter((b) => b)
  );
  canSendMessage = computed(
    () => !this.isLoading() && this.inputMessage().trim().length > 0
  );

  ngOnInit() {
    // Subscribe to messages
    this.subscriptions.add(
      this.aiService.messages$.subscribe((messages) => {
        this.messages.set(messages);
      })
    );

    // Add welcome message if no messages
    if (this.messages().length === 0) {
      this.addSystemMessage(
        "👋 Welcome to NovelNest AI Assistant! I'm here to help you discover your next great read. " +
          'Ask me about book recommendations, genres, authors, or upload a PDF for a summary!'
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      // Focus input when opening
      setTimeout(() => {
        const input = document.querySelector(
          '.chat-input input'
        ) as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  }

  async sendMessage(message?: string) {
    const messageToSend = message || this.inputMessage();
    if (!messageToSend.trim()) return;

    this.inputMessage.set('');
    this.error.set(null);
    this.isLoading.set(true);

    try {
      // Use public chat if not authenticated
      const chatMethod = this.isAuthenticated()
        ? this.aiService.chatWithAI(messageToSend)
        : this.aiService.publicChat(messageToSend);

      await chatMethod.toPromise();
    } catch (error: any) {
      console.error('Chat error:', error);
      this.error.set(
        error.error?.message || 'Failed to send message. Please try again.'
      );
      this.addSystemMessage(
        '❌ ' +
          (error.error?.message || 'Failed to send message. Please try again.')
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async getRecommendations() {
    if (!this.preferences() || this.selectedGenres().length === 0) {
      this.error.set(
        'Please fill in your preferences and select at least one genre'
      );
      return;
    }

    if (!this.isAuthenticated()) {
      this.addSystemMessage(
        '🔒 Please sign in to get personalized book recommendations!'
      );
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const response = await this.aiService
        .getRecommendations(
          this.preferences(),
          this.selectedGenres(),
          this.previousBooks()
        )
        .toPromise();

      if (response?.success && response.recommendations) {
        this.recommendations.set(response.recommendations);

        // Format and add to chat
        const formattedMessage = this.aiService.formatRecommendationsAsMessage(
          response.recommendations
        );
        this.addSystemMessage(formattedMessage);

        // Switch to chat tab to show results
        this.activeTab.set('chat');

        // Clear form
        this.preferences.set('');
        this.selectedGenres.set([]);
        this.previousBooksInput.set('');
      }
    } catch (error: any) {
      console.error('Recommendation error:', error);
      this.error.set(
        error.error?.message ||
          'Failed to get recommendations. Please try again.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        if (file.size > 10 * 1024 * 1024) {
          this.error.set('File size must be less than 10MB');
          this.selectedFile.set(null);
        } else {
          this.selectedFile.set(file);
          this.error.set(null);
        }
      } else {
        this.error.set('Please select a valid PDF file');
        this.selectedFile.set(null);
      }
    }
  }

  async uploadAndSummarize() {
    const file = this.selectedFile();
    if (!file) return;

    if (!this.isAuthenticated()) {
      this.addSystemMessage(
        '🔒 Please sign in to use the PDF summary feature!'
      );
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.uploadProgress.set(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        this.uploadProgress.update((p) => Math.min(p + 10, 90));
      }, 200);

      const response = await this.aiService.summarizePDF(file).toPromise();

      clearInterval(progressInterval);
      this.uploadProgress.set(100);

      if (response?.success) {
        this.pdfSummary.set(response);

        // Format summary for chat
        let summaryMessage = `📄 **PDF Summary**\n\n`;
        summaryMessage += `**Title:** ${response.info.title}\n`;
        summaryMessage += `**Author:** ${response.info.author}\n`;
        summaryMessage += `**Pages:** ${response.pageCount}\n\n`;
        summaryMessage += `**Summary:**\n${response.summary}`;

        this.addSystemMessage(summaryMessage);

        // Switch to chat tab
        this.activeTab.set('chat');

        // Reset upload state
        this.selectedFile.set(null);
        this.uploadProgress.set(0);
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      }
    } catch (error: any) {
      console.error('PDF summary error:', error);
      this.error.set(
        error.error?.message || 'Failed to summarize PDF. Please try again.'
      );
    } finally {
      this.isLoading.set(false);
      this.uploadProgress.set(0);
    }
  }

  toggleGenre(genre: string) {
    this.selectedGenres.update((genres) => {
      const index = genres.indexOf(genre);
      if (index > -1) {
        return genres.filter((g) => g !== genre);
      }
      return [...genres, genre];
    });
  }

  clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.aiService.clearConversation().subscribe({
        next: () => {
          this.messages.set([]);
          this.addSystemMessage(
            '👋 Chat cleared! How can I help you discover your next great read?'
          );
        },
        error: (error) => {
          console.error('Failed to clear chat:', error);
        },
      });
    }
  }

  sendQuickAction(action: string) {
    this.inputMessage.set(action);
    this.sendMessage();
  }

  private addSystemMessage(content: string) {
    const message: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    this.messages.update((msgs) => [...msgs, message]);
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  formatTimestamp(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return messageDate.toLocaleDateString();
  }
}
