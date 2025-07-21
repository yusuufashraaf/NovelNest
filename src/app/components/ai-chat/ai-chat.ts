// src/app/components/ai-chat/ai-chat.ts
import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage } from '../../services/ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.html',
  styleUrls: ['./ai-chat.css'],
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  private aiService = inject(AiService);
  private subscriptions = new Subscription();

  @ViewChild('chatInput') chatInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  activeTab = signal<'chat' | 'recommendations'>('chat');

  // Per-action loading and error
  chatLoading = signal(false);
  chatError = signal<string | null>(null);
  recLoading = signal(false);
  recError = signal<string | null>(null);

  // Chat state
  messages = signal<ChatMessage[]>([]);
  inputMessage = signal('');
  pendingMessageId = signal<string | null>(null);

  // Recommendations state
  preferences = signal('');
  selectedCategories = signal<string[]>([]);
  categories = signal<any[]>([]);

  // Auto-scroll flag
  private shouldScrollToBottom = false;

  // Computed properties
  canSendMessage = computed(
    () =>
      !this.chatLoading() &&
      this.inputMessage().trim().length > 0 &&
      !this.pendingMessageId()
  );

  canGetRecommendations = computed(
    () =>
      !this.recLoading() &&
      this.preferences().trim().length > 0 &&
      this.selectedCategories().length > 0
  );

  // Quick action suggestions
  quickActions = [
    'Recommend me a thriller novel',
    'What are the best fantasy books of 2024?',
    'I want to read something like Harry Potter',
    'Suggest books for beginners in philosophy',
    'What are some must-read classics?',
  ];

  ngOnInit() {
    this.subscriptions.add(
      this.aiService.messages$.subscribe((messages) => {
        this.messages.set(messages);
        this.shouldScrollToBottom = true;
      })
    );

    this.subscriptions.add(
      this.aiService.categories$.subscribe((categories) => {
        this.categories.set(categories);
      })
    );

    this.loadQuickActions();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
    if (this.isOpen() && this.activeTab() === 'chat') {
      setTimeout(() => this.focusInput(), 100);
    }
  }

  switchTab(tab: 'chat' | 'recommendations') {
    if (this.chatLoading() || this.recLoading()) return;
    this.activeTab.set(tab);
    this.clearErrors();
    setTimeout(() => this.focusInput(), 100);
  }

  private focusInput() {
    if (this.activeTab() === 'chat' && this.chatInputRef) {
      this.chatInputRef.nativeElement.focus();
    }
  }

  async sendMessage(message?: string) {
    const messageToSend = message || this.inputMessage();
    if (!messageToSend.trim() || this.chatLoading()) return;

    this.inputMessage.set('');
    this.chatError.set(null);
    this.chatLoading.set(true);

    try {
      await this.aiService.chatWithAI(messageToSend).toPromise();
    } catch (error: any) {
      this.chatError.set(
        error.error?.message || 'Failed to send message. Please try again.'
      );
    } finally {
      this.chatLoading.set(false);
      this.pendingMessageId.set(null);
      setTimeout(() => this.focusInput(), 100);
    }
  }

  async getRecommendations() {
    if (!this.canGetRecommendations()) return;
    this.recError.set(null);
    this.recLoading.set(true);
    this.activeTab.set('chat');

    try {
      await this.aiService
        .getRecommendations(this.preferences(), this.selectedCategories())
        .toPromise();
      this.resetRecommendationForm();
    } catch (error: any) {
      this.recError.set(
        error.error?.message ||
          'Failed to get recommendations. Please try again.'
      );
    } finally {
      this.recLoading.set(false);
    }
  }

  toggleCategory(categoryId: string) {
    this.selectedCategories.update((categories) => {
      const index = categories.indexOf(categoryId);
      if (index > -1) {
        return categories.filter((c) => c !== categoryId);
      }
      return [...categories, categoryId];
    });
  }

  selectQuickAction(action: string) {
    this.activeTab.set('chat');
    this.sendMessage(action);
  }

  private resetRecommendationForm() {
    this.preferences.set('');
    this.selectedCategories.set([]);
  }

  clearErrors() {
    this.chatError.set(null);
    this.recError.set(null);
  }

  async clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) return;
    await this.aiService.clearConversation().toPromise();
    this.inputMessage.set('');
    setTimeout(() => this.focusInput(), 100);
  }

  formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessageContent(content: string): string {
    if (!content) return '';

    // Check if content is already formatted (contains HTML tags)
    if (content.includes('<span class=') || content.includes('<div class=')) {
      return content;
    }

    let formatted = content;

    // Clean up basic formatting first
    formatted = formatted
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/[ \t]+/g, ' '); // Normalize spaces

    // Convert basic markdown to HTML first
    formatted = this.convertBasicMarkdown(formatted);

    // Apply contextual styling
    formatted = this.applyContextualStyling(formatted);

    // Final paragraph wrapping
    formatted = this.wrapInParagraphs(formatted);

    return formatted;
  }

  private convertBasicMarkdown(text: string): string {
    let processed = text;

    // Convert headers (do this first)
    processed = processed.replace(/^### (.*$)/gm, '<h3 class="msg-h3">$1</h3>');
    processed = processed.replace(/^## (.*$)/gm, '<h2 class="msg-h2">$1</h2>');
    processed = processed.replace(/^# (.*$)/gm, '<h1 class="msg-h1">$1</h1>');

    // Convert bold text
    processed = processed.replace(
      /\*\*([^*]+?)\*\*/g,
      '<strong class="msg-bold">$1</strong>'
    );

    // Convert italic text (avoid conflicts)
    processed = processed.replace(
      /(?<!\*)(\*)(?!\s)([^*\n]+?)(?<!\s)\*/g,
      '<em class="msg-italic">$2</em>'
    );

    // Convert inline code
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="msg-code">$1</code>'
    );

    // Convert numbered lists
    processed = processed.replace(
      /^(\d+)\.\s+(.+$)/gm,
      '<div class="msg-list-item"><span class="msg-number">$1.</span> $2</div>'
    );

    // Convert bullet lists
    processed = processed.replace(
      /^[-•*]\s+(.+$)/gm,
      '<div class="msg-bullet-item"><span class="msg-bullet">•</span> $1</div>'
    );

    // Convert horizontal rules
    processed = processed.replace(/^---+$/gm, '<hr class="msg-divider">');

    return processed;
  }

  private applyContextualStyling(text: string): string {
    let processed = text;

    // Only apply styling to text that's not already in HTML tags
    const stylePattern = (pattern: RegExp, className: string) => {
      return processed.replace(pattern, (match, ...groups) => {
        // Don't style if already inside HTML tags
        const beforeMatch = processed.substring(0, processed.indexOf(match));
        const openTags = (beforeMatch.match(/</g) || []).length;
        const closeTags = (beforeMatch.match(/>/g) || []).length;

        if (openTags > closeTags) {
          return match; // Inside a tag, don't modify
        }

        const capturedText = groups[0] || match;
        return `<span class="${className}">${capturedText}</span>`;
      });
    };

    // Technology and platform names
    processed = stylePattern(
      /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|React|Angular|Vue|GitHub|LeetCode|HackerRank|Coursera|Udemy)\b/gi,
      'platform-name'
    );

    // Key programming terms
    processed = stylePattern(
      /\b(programming|coding|development|practice|projects?|experience|skills?)\b/gi,
      'key-term'
    );

    // Greeting phrases (only at the start of sentences)
    processed = stylePattern(
      /^(That's\s+(?:fantastic|great|amazing)!?)/gm,
      'greeting-text'
    );

    processed = stylePattern(/(Learning.*?is.*?rewarding)/gi, 'greeting-text');

    // Emphasis words
    processed = stylePattern(
      /\b(hands-on|crucial|important|essential|key)\b/gi,
      'emphasis-text'
    );

    return processed;
  }

  private wrapInParagraphs(content: string): string {
    // Handle line breaks and paragraph wrapping
    let processed = content.replace(/\n\n+/g, '</p><p class="msg-paragraph">');
    processed = processed.replace(/\n/g, '<br>');

    // Wrap in paragraph if it doesn't start with a block element
    if (!processed.match(/^<(h[1-6]|div|p|hr)/)) {
      processed = '<p class="msg-paragraph">' + processed + '</p>';
    } else if (processed.includes('</p><p class="msg-paragraph">')) {
      processed = '<p class="msg-paragraph">' + processed + '</p>';
    }

    return processed;
  }

  private loadQuickActions() {
    this.quickActions = [
      'Recommend me a thriller novel',
      'What are the best fantasy books of 2024?',
      'I want to read something like Harry Potter',
      'Suggest books for beginners in philosophy',
      'What are some must-read classics?',
    ];
  }
}
