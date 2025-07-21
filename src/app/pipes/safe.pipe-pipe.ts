import { Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
  SafeScript,
  SafeStyle,
  SafeUrl,
} from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.sanitize(1, this.formatMessage(value)) || '';
      case 'style':
        return this.sanitizer.sanitize(2, value) || '';
      case 'script':
        return this.sanitizer.sanitize(3, value) || '';
      case 'url':
        return this.sanitizer.sanitize(4, value) || '';
      case 'resourceUrl':
        return this.sanitizer.sanitize(5, value) || '';
      default:
        return this.sanitizer.sanitize(1, this.formatMessage(value)) || '';
    }
  }

  private formatMessage(text: string): string {
    if (!text) return '';

    // Convert markdown-style formatting to HTML
    let formatted = text
      // Bold text: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic text: *text* or _text_
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Code blocks: ```code```
      .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
      // Inline code: `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>'
      )
      // Line breaks
      .replace(/\n/g, '<br>')
      // Numbered lists: 1. item
      .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
      // Bullet points: - item or * item
      .replace(/^[-*]\s(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> elements in <ul>
    formatted = formatted.replace(/(<li>.*<\/li>\s*)+/g, (match) => {
      return '<ul>' + match + '</ul>';
    });

    // Add emoji support for common book-related emojis
    formatted = formatted
      .replace(/📚/g, '<span class="emoji">📚</span>')
      .replace(/📖/g, '<span class="emoji">📖</span>')
      .replace(/💡/g, '<span class="emoji">💡</span>')
      .replace(/⭐/g, '<span class="emoji">⭐</span>')
      .replace(/❤️/g, '<span class="emoji">❤️</span>')
      .replace(/👍/g, '<span class="emoji">👍</span>')
      .replace(/🔍/g, '<span class="emoji">🔍</span>')
      .replace(/✨/g, '<span class="emoji">✨</span>');

    return formatted;
  }
}
