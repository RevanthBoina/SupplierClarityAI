import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, input, signal, viewChild,
} from '@angular/core';
import { INFRA_CAPABILITIES } from '../../../content/infra-automation-content';
import { CapabilitiesContent } from '../../../content/content-types';
import { PillLabelComponent } from '../../../shared/pill-label.component';

/**
 * "Core AI-enhanced capabilities": list left, a deck of photo cards centre, detail right. Fits one screen.
 *
 * Auto-advance: moves to the next capability every `intervalMs` while the section is on screen.
 * A mouse over the list/photos/detail, or keyboard focus inside them, pauses it; it resumes from the same
 * point afterwards. Touch never pauses it. Clicking an item shows it.
 *
 * Shuffle: the photos are a stacked deck. On each change the tilted card behind straightens and comes to the
 * front over the old card, and the next photo appears tilted behind it (as in the reference recording).
 * With reduced motion the cards simply cross-fade (the list still advances, with a pause on hover).
 *
 * Reused on product pages via [content]: optional eyebrow, heading, lead, a row of feature pills, and a link
 * inside an item's text (CapabilityItem.link).
 */
@Component({
  selector: 'wb-infra-capabilities',
  imports: [PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="caps" aria-labelledby="caps-title" #root [class.caps--no-head]="!c.titleLead">
      <div class="wb-container caps__inner">
        @if (c.titleLead) {
          <div class="caps__head">
            @if (c.eyebrow) { <wb-pill-label [icon]="$any(c.eyebrowIcon ?? 'products')">{{ c.eyebrow }}</wb-pill-label> }
            <h2 class="wb-h2 caps__title" id="caps-title">{{ c.titleLead }}@if (c.titleAccent) {{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span>}</h2>
            @if (c.lead) { <p class="wb-lead caps__lead">{{ c.lead }}</p> }
            @if (c.pills) {
              <ul class="pills">
                @for (pill of c.pills; track pill; let i = $index) {
                  <li class="pill">{{ pill }}</li>
                }
              </ul>
            }
          </div>
        } @else {
          <h2 class="wb-visually-hidden" id="caps-title">Capabilities</h2>
        }

        <div class="caps__body"
             (pointerenter)="onPointer($event, true)" (pointerleave)="onPointer($event, false)"
             (focusin)="onFocus($event)" (focusout)="focused.set(false)">
          <ul class="list" #list role="tablist" aria-label="Capabilities" aria-orientation="vertical">
            @for (item of c.items; track item.name; let i = $index) {
              <li>
                <button type="button" role="tab" class="list__item" [class.list__item--on]="i === active()"
                        [attr.aria-selected]="i === active()" aria-controls="caps-panel" (click)="show(i)">
                  {{ item.name }}
                  <!-- Thin progress line under the active item; restarts on each item, freezes while paused -->
                  @if (i === active()) {
                    @for (n of [cycle()]; track n) {
                      <span class="list__progress" [class.is-paused]="paused()" [style.animation-duration.ms]="c.intervalMs"></span>
                    }
                  }
                </button>
              </li>
            }
          </ul>

          <div class="deck" aria-hidden="true">
            @for (item of c.items; track item.name; let i = $index) {
              <img class="card" [src]="item.image" width="428" height="604" alt="" [attr.data-pos]="pos(i)"
                   [attr.loading]="i < 2 ? null : 'lazy'" />
            }
          </div>

          <div class="details" id="caps-panel" role="tabpanel" aria-live="polite">
            @for (item of c.items; track item.name; let i = $index) {
              <div class="detail" [class.detail--on]="i === active()" [attr.aria-hidden]="i !== active()">
                <p class="detail__count">0{{ i + 1 }} / 0{{ c.items.length }}</p>
                <h3 class="detail__title">{{ item.title ?? item.name }}</h3>
                <p class="detail__text">
                  @if (item.link && item.text.includes(item.link.label)) {
                    {{ item.text.split(item.link.label)[0] }}<a class="detail__link" [href]="item.link.href">{{ item.link.label }}</a>{{ item.text.split(item.link.label).slice(1).join(item.link.label) }}
                  } @else { {{ item.text }} }
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    /* One screen tall: heading on top, the photo deck takes whatever height is left */
    .caps { display: flex; flex-direction: column; min-height: 100svh; padding: var(--wb-fit-y) 0; background: #fff; font-family: var(--wb-font-body); }
    .caps__inner { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; max-height: 960px; }
    .caps__head { display: flex; flex-direction: column; align-items: center; gap: var(--wb-space-xs); text-align: center; }
    .caps__title { text-align: center; font-size: var(--wb-fit-h2); }
    .caps__lead { max-width: 900px; font-size: min(var(--wb-fs-lead), 2.6svh); }
    .pills { margin-top: min(var(--wb-space-xs), 2svh); display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: min(12px, 1.6svh) 18px;
      border: 1.5px solid transparent;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(28, 44, 110, 0.13);
      font-weight: 600;
      font-size: clamp(0.8125rem, 0.9vw, 1rem);
      color: #0f0e09;
    }
    .pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--wb-blue); }
    .pill:nth-child(2)::before { background: #7e5ebf; }
    .pill:nth-child(3)::before { background: #ffd04a; }
    .detail__link { color: var(--wb-blue); text-decoration: underline; text-underline-offset: 3px; }
    .caps--no-head .caps__body { margin-top: 0; }
    /* The photo deck is the same size in every section of this kind (service and product pages): one screen
       minus the padding and a standard eyebrow + heading. Sections with extra heading content (FieldZapp's
       lead and pills) grow a little taller than the screen instead of shrinking the photos. */
    .caps__body {
      --deck-h: clamp(300px, calc(100svh - 2 * var(--wb-fit-y) - var(--wb-fit-h2) * 1.18 - 52px - var(--wb-fit-gap)), 580px);
      margin-top: var(--wb-fit-gap);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      gap: clamp(32px, 4vw, 80px);
      align-items: center;
    }

    .list { display: flex; flex-direction: column; gap: clamp(2px, 0.8svh, 10px); }
    .list__item {
      position: relative;
      padding: 8px 0 8px 28px;
      text-align: left;
      font-weight: 600;
      font-size: clamp(1rem, min(1.25vw, 2.6svh), 1.375rem);
      color: #9a9aa3;
      transition: color 0.3s ease;
    }
    .list__item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 12px;
      height: 12px;
      margin-top: -6px;
      border-radius: 50%;
      background: #ffd04a;
      transform: scale(0);
      transition: transform 0.35s var(--wb-ease-spring);
    }
    .list__item:hover { color: #55555f; }
    .list__item--on { color: #0f0e09; }
    .list__item--on::before { transform: scale(1); }
    .list__progress {
      position: absolute;
      left: 28px;
      right: 0;
      bottom: 2px;
      height: 2px;
      background: #0f0e09;
      transform-origin: left;
      animation: progress linear forwards;
    }
    .list__progress.is-paused { animation-play-state: paused; }
    @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

    /* Deck of photo cards. data-pos: 0 front, 1 tilted card behind, out = the card that just left,
       hidden = the rest, waiting behind the tilted card. */
    .deck { position: relative; height: var(--deck-h); aspect-ratio: 428 / 604; margin-right: 4%; }
    .card {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 28px;
      box-shadow: 0 24px 50px rgba(11, 21, 51, 0.16);
      transform-origin: 50% 90%;
      transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    }
    .card[data-pos='0'] { z-index: 3; transform: none; opacity: 1; }
    .card[data-pos='1'] { z-index: 2; transform: translate(6%, -3%) rotate(4.5deg) scale(0.97); opacity: 1; }
    /* The card that was in front drops straight behind (no movement) while the tilted card straightens over it */
    .card[data-pos='out'] { z-index: 1; transform: none; opacity: 0; transition: opacity 0s linear 0.75s; }
    .card[data-pos='hidden'] { z-index: 0; transform: translate(6%, -3%) rotate(4.5deg) scale(0.97); opacity: 0; transition-duration: 0s; }

    .details { display: grid; }
    .detail {
      grid-area: 1 / 1; /* all stacked in one cell, so the height never jumps */
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
      transition: opacity 0.45s ease, transform 0.5s var(--wb-ease-out), visibility 0s linear 0.45s;
    }
    .detail--on { opacity: 1; visibility: visible; transform: none; transition-delay: 0.12s, 0.12s, 0s; }
    .detail__count { font-weight: 600; font-size: var(--wb-fs-body); color: var(--wb-blue); }
    .detail__title { margin-top: var(--wb-space-xs); font-weight: 700; font-size: var(--wb-fs-card-title); line-height: 1.3; color: #0f0e09; }
    .detail__text { margin-top: var(--wb-space-xs); font-size: var(--wb-fs-body); line-height: 1.6; color: var(--wb-ink-600); }

    @media (prefers-reduced-motion: reduce) {
      .card { transition: opacity 0.4s ease; }
      .card[data-pos='out'], .card[data-pos='hidden'] { transform: translate(7%, -2.5%) rotate(5deg) scale(0.97); }
      .detail { transform: none; }
    }
    @media (max-width: 900px) {
      .caps { min-height: 0; display: block; }
      .caps__inner { display: block; max-height: none; }
      .caps__body { grid-template-columns: minmax(0, 1fr) auto; }
      .deck { grid-row: 1 / 3; grid-column: 2; height: min(56svh, 460px); }
    }
    @media (max-width: 720px) {
      .caps__body { grid-template-columns: 1fr; gap: 24px; }
      .deck { grid-row: auto; grid-column: auto; justify-self: center; height: min(52svh, 420px); }
      .list { flex-direction: row; flex-wrap: nowrap; overflow-x: auto; gap: 18px; scrollbar-width: none; }
      .list__item { white-space: nowrap; }
    }
  `,
})
export class InfraCapabilitiesComponent {
  /** Defaults to the Infra automation copy; product pages pass their own */
  readonly content = input<CapabilitiesContent>(INFRA_CAPABILITIES);
  protected get c(): CapabilitiesContent { return this.content(); }
  protected readonly active = signal(0);
  /** The card that was in front before the current one (swings out) */
  private readonly previous = signal<number | null>(null);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  private readonly visible = signal(false);
  protected readonly paused = computed(() => this.hovered() || this.focused() || !this.visible());
  /** Changes on every new item so the progress line restarts */
  protected readonly cycle = signal(0);

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  constructor() {
    const destroyRef = inject(DestroyRef);
    // On phones the list scrolls sideways: keep the current item in view (never scrolls the page)
    effect(() => {
      const i = this.active();
      const list = this.list()?.nativeElement;
      if (!list || list.scrollWidth <= list.clientWidth) return;
      const item = list.children[i] as HTMLElement | undefined;
      if (item) list.scrollTo({ left: item.offsetLeft - list.offsetLeft - 8, behavior: 'smooth' });
    });
    afterNextRender(() => {
      // "On screen" = the section reaches the middle half of the viewport (works for any section height)
      const io = new IntersectionObserver(([e]) => this.visible.set(e.isIntersecting), { rootMargin: '-25% 0px -25% 0px' });
      io.observe(this.root().nativeElement);
      // Time is counted only while not paused, so after a pause the item finishes its remaining time
      let elapsed = 0;
      let last = performance.now();
      const tick = setInterval(() => {
        const now = performance.now();
        if (!this.paused()) elapsed += now - last;
        last = now;
        if (elapsed >= this.c.intervalMs) {
          elapsed = 0;
          this.go((this.active() + 1) % this.c.items.length);
        }
      }, 100);
      this.resetTimer = () => { elapsed = 0; };
      destroyRef.onDestroy(() => { clearInterval(tick); io.disconnect(); });
    });
  }

  private resetTimer = () => {};
  private readonly canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  /** Deck position of card i relative to the active card */
  protected pos(i: number): string {
    const n = this.c.items.length;
    const r = (i - this.active() + n) % n;
    if (r === 0) return '0';
    if (i === this.previous()) return 'out';
    return r === 1 ? '1' : 'hidden';
  }

  /** Only a real mouse pauses the cycle; on touch screens a tap would otherwise "hover" forever. */
  protected onPointer(e: PointerEvent, inside: boolean): void {
    if (e.pointerType === 'mouse' && this.canHover) this.hovered.set(inside);
  }

  /** Only keyboard focus pauses: a mouse click leaves focus on the button and would otherwise pause it for good. */
  protected onFocus(e: FocusEvent): void {
    const t = e.target as HTMLElement | null;
    this.focused.set(!!t?.matches?.(':focus-visible'));
  }

  protected show(i: number): void {
    if (i !== this.active()) this.go(i);
    this.resetTimer();
  }

  private go(i: number): void {
    this.previous.set(this.active());
    this.active.set(i);
    this.cycle.update(n => n + 1);
  }
}
