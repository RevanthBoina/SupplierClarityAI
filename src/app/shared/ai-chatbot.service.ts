import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { CHAT_GREETING, answerLocally } from '../content/chatbot-content';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

interface ChatApiResponse {
  reply?: string;
  provider?: string;
  model?: string;
}

const STORAGE_KEY = 'sc-ai-chat-v1';
const MAX_MESSAGES = 60;
const HISTORY_LIMIT = 12;

/**
 * State for the Clarity Assistant. Lives in the app shell, so the
 * conversation survives scroll hide/show, route changes and reloads
 * (messages are also persisted to localStorage).
 */
@Injectable({ providedIn: 'root' })
export class AiChatbotService {
  private readonly http = inject(HttpClient);

  readonly messages = signal<ChatMessage[]>(this.load());
  readonly isLoading = signal(false);
  readonly isOpen = signal(false);
  readonly unread = signal(0);

  /** True while the assistant reply is being revealed word by word. */
  private revealing = false;

  constructor() {
    if (this.messages().length === 0) {
      this.messages.set([{ role: 'assistant', text: CHAT_GREETING, ts: Date.now() }]);
      this.persist();
    }
  }

  toggle(): void {
    this.isOpen.update(open => !open);
    if (this.isOpen()) this.unread.set(0);
  }

  open(): void {
    this.isOpen.set(true);
    this.unread.set(0);
  }

  close(): void {
    this.isOpen.set(false);
  }

  clear(): void {
    this.messages.set([{ role: 'assistant', text: CHAT_GREETING, ts: Date.now() }]);
    this.persist();
  }

  async send(raw: string): Promise<void> {
    const text = raw.trim();
    if (!text || this.isLoading() || this.revealing) return;

    const history = this.messages().slice(-HISTORY_LIMIT);
    this.append({ role: 'user', text, ts: Date.now() });
    this.isLoading.set(true);

    const reply = await this.requestReply(history, text);
    this.isLoading.set(false);
    await this.reveal(reply);
  }

  /** Ask the server (Groq/Gemini when configured); fall back to the local knowledge base. */
  private async requestReply(
    history: ChatMessage[],
    latest: string,
  ): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http
          .post<ChatApiResponse>('/api/chat', {
            messages: [...history, { role: 'user', text: latest }],
          })
          .pipe(timeout(35000)),
      );
      const reply = (res?.reply ?? '').trim();
      if (reply) return reply;
    } catch {
      /* No server (ng serve), no key, or a provider error: use the local answer. */
    }
    return answerLocally(latest);
  }

  /** Reveal the reply progressively so it feels like streaming, even when hidden. */
  private reveal(full: string): Promise<void> {
    return new Promise(resolve => {
      this.revealing = true;
      const placeholder: ChatMessage = { role: 'assistant', text: '', ts: Date.now() };
      this.append(placeholder);
      const words = full.split(/(\s+)/);
      let index = 0;
      const step = (): void => {
        index = Math.min(words.length, index + 3);
        const partial = words.slice(0, index).join('');
        this.updateLast(partial);
        if (index < words.length) {
          setTimeout(step, 18);
        } else {
          this.revealing = false;
          this.persist();
          if (!this.isOpen()) this.unread.update(n => n + 1);
          resolve();
        }
      };
      step();
    });
  }

  private append(message: ChatMessage): void {
    this.messages.update(list => [...list.slice(-(MAX_MESSAGES - 1)), message]);
    this.persist();
  }

  private updateLast(text: string): void {
    this.messages.update(list => {
      const next = [...list];
      const last = next[next.length - 1];
      if (last?.role === 'assistant') next[next.length - 1] = { ...last, text };
      return next;
    });
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages().slice(-MAX_MESSAGES)));
    } catch {
      /* Storage unavailable (private mode): chat still works for the session. */
    }
  }

  private load(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ChatMessage[];
      return Array.isArray(parsed)
        ? parsed.filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
        : [];
    } catch {
      return [];
    }
  }
}
