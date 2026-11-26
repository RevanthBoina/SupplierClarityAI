import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AiChatbotService } from './ai-chatbot.service';
import { CHAT_SUGGESTIONS } from '../content/chatbot-content';

/**
 * Clarity Assistant: a floating AI chatbot pinned to the bottom-right corner.
 * It appears when the visitor scrolls up (and at the top of the page) and
 * slides away when they scroll down. Hiding never destroys the chat: the
 * conversation lives in AiChatbotService and survives route changes,
 * hide/show cycles and reloads. While the panel is open it stays visible
 * so an active chat is never interrupted by scrolling.
 */
@Component({
  selector: 'wb-ai-chatbot',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.scss',
})
export class AiChatbotComponent {
  protected readonly chat = inject(AiChatbotService);
  protected readonly suggestions = CHAT_SUGGESTIONS;
  protected readonly draft = signal('');
  /** Scroll-aware visibility: shown on scroll-up / at the top, hidden on scroll-down. */
  protected readonly widgetVisible = signal(true);

  private readonly sanitizer = inject(DomSanitizer);
  private readonly inputRef = viewChild<ElementRef<HTMLTextAreaElement>>('inputRef');
  private readonly scrollRef = viewChild<ElementRef<HTMLDivElement>>('scrollRef');
  private lastScrollY = 0;

  /** Keep the thread pinned to the bottom as the reply streams in. */
  private readonly autoScroll = effect(() => {
    this.chat.messages();
    queueMicrotask(() => this.scrollToBottom());
  });

  protected readonly canSend = computed(
    () => this.draft().trim().length > 0 && !this.chat.isLoading(),
  );

  @HostListener('window:scroll')
  protected onScroll(): void {
    const y = window.scrollY;
    if (this.chat.isOpen()) {
      this.widgetVisible.set(true);
    } else if (y < 140) {
      this.widgetVisible.set(true);
    } else if (y < this.lastScrollY - 4) {
      this.widgetVisible.set(true); // scrolling up
    } else if (y > this.lastScrollY + 4) {
      this.widgetVisible.set(false); // scrolling down
    }
    this.lastScrollY = y;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.chat.isOpen()) this.chat.close();
  }

  protected toggle(): void {
    this.chat.toggle();
    if (this.chat.isOpen()) {
      this.widgetVisible.set(true);
      setTimeout(() => this.inputRef()?.nativeElement.focus(), 60);
    }
  }

  protected close(): void {
    this.chat.close();
  }

  protected clear(): void {
    this.chat.clear();
  }

  protected send(): void {
    const text = this.draft();
    this.draft.set('');
    void this.chat.send(text).then(() => this.scrollToBottom());
  }

  protected sendSuggestion(prompt: string): void {
    void this.chat.send(prompt).then(() => this.scrollToBottom());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  /** Render the assistant's markdown-lite (bold, links, lists) as safe HTML. */
  protected render(text: string): SafeHtml {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const withLinks = escaped
      .replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    const lines = withLinks.split('\n');
    const html = lines
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) return `<li>${trimmed.slice(2)}</li>`;
        return trimmed ? `<p>${line}</p>` : '';
      })
      .join('')
      .replace(/(<li>.*?<\/li>)+/gs, match => `<ul>${match}</ul>`);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom(): void {
    const el = this.scrollRef()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
