import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { SectionHeadComponent } from '../../../shared/section-head.component';
import { AGENTIC_HELP } from '../../../content/agentic-ai-content';
import { HelpContent } from '../../../content/content-types';

/**
 * "How we help": three tabs. Each tab has its own colour (blue, purple, yellow) which the active
 * tab pill, the detail card and the result caption all pick up.
 */
@Component({
  selector: 'wb-agentic-help',
  host: { '[class.is-centered]': "layout() === 'centered'" },
  imports: [SectionHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="help" aria-labelledby="help-title">
      <!-- layout="split": heading and tabs left, photo + card right. layout="centered": heading and tabs
           centred on top, card and photo side by side below (as in the Data modernization design). -->
      <div class="wb-container help__layout">
        <div class="help__intro">
        <wb-section-head [align]="layout() === 'centered' ? 'center' : 'start'" [icon]="$any(c.eyebrowIcon ?? 'how-we-help')" [eyebrow]="c.eyebrow" [title]="c.titleLead" [accent]="c.titleAccent" [lead]="c.lead" headingId="help-title" />

        <div class="tabs" role="tablist" aria-label="How we help" [attr.aria-orientation]="layout() === 'centered' ? 'horizontal' : 'vertical'" (keydown)="onKey($event)">
          @for (t of c.tabs; track t.label; let i = $index) {
            <button type="button" role="tab" class="tabs__tab" [class]="'tabs__tab tabs__tab--' + t.tone"
                    [class.tabs__tab--active]="i === active()" [id]="'help-tab-' + i"
                    [attr.aria-selected]="i === active()" [attr.aria-controls]="'help-panel'"
                    [attr.tabindex]="i === active() ? 0 : -1" (click)="active.set(i)">{{ t.label }}</button>
          }
        </div>
        </div>

        @for (tab of [current()]; track active()) {
          <div class="detail" [class]="'detail detail--' + tab.tone" role="tabpanel" id="help-panel" [attr.aria-labelledby]="'help-tab-' + active()">
            <article class="card" [class.card--kicker]="tab.kicker">
              @if (tab.kicker) { <p class="card__kicker">{{ tab.kicker }}</p> }
              <h3 class="card__title">
                <span class="card__title-icon" aria-hidden="true">
                  @switch (tab.icon) {
                    @case ('target') { <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></svg> }
                @case ('legacy') { <svg viewBox="0 0 24 24"><path d="M6 20.5V4.5h9v16M15 9.5h3.5v11M4 20.5h16" /><path d="M9 8h3M9 11h3M9 14h3M9 17h3" /></svg> }
                    @case ('orbit') { <svg viewBox="0 0 24 24"><path d="m12 9 3 3-3 3-3-3z" /><path d="M6.5 15.5a6.5 6.5 0 0 1 2-9" /><path d="M17.5 8.5a6.5 6.5 0 0 1-2 9" /><circle cx="11" cy="4.5" r="1.2" /><circle cx="5.5" cy="16.5" r="1.2" /><circle cx="18.5" cy="7.5" r="1.2" /></svg> }
                    @case ('cloud') { <svg viewBox="0 0 24 24"><path d="M7 18h10.5a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.5 9.3 4.4 4.4 0 0 0 7 18Z" /><path d="m9.5 13.5 2 2 3.5-4" /></svg> }
                    @case ('document') { <svg viewBox="0 0 24 24"><path d="M7 3.5h7l4 4v13H7z" /><path d="M14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4" /></svg> }
                    @case ('chat') { <svg viewBox="0 0 24 24"><path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z" /><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" /></svg> }
                    @case ('database') { <svg viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" /><path d="M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" /></svg> }
                    @case ('helmet') { <svg viewBox="0 0 24 24"><path d="M4 16.5a8 8 0 0 1 16 0" /><path d="M2.5 16.5h19v2.5h-19z" /><path d="M10 8.7V6.5h4v2.2M12 6.5v10" /></svg> }
                    @default { <svg viewBox="0 0 24 24"><path d="m9.5 8-4 4 4 4M14.5 8l4 4-4 4M13.2 6l-2.4 12" /></svg> }
                  }
                </span>
                {{ tab.title }}
              </h3>
              @if (tab.intro) { <p class="card__intro">{{ tab.intro }}</p> }

              @if (tab.points) {
                <ul class="card__points">
                  @for (p of tab.points; track p.text) {
                    <li>@if (p.term) {<strong>{{ p.term }}</strong>{{ ' ' }}}{{ p.text }}</li>
                  }
                </ul>
              }

              @if (tab.options) {
                <!-- Delivery models: two compact option tiles instead of a comparison table -->
                <div class="options">
                  @for (o of tab.options; track o.name) {
                    <div class="option">
                      <h4 class="option__name">{{ o.name }}</h4>
                      <p class="option__text">{{ o.text }}</p>
                      <p class="option__best"><strong>Best when</strong> {{ o.bestWhen }}</p>
                    </div>
                  }
                </div>
              }

              @if (tab.note) { <p class="card__note">{{ tab.note }}</p> }
            </article>

            <figure class="photo">
              <img [src]="tab.image" width="781" height="634" [alt]="tab.imageAlt" />
              <figcaption class="photo__result">
                <span class="photo__result-label">{{ c.resultLabel }}</span>
                {{ tab.resultText }}
              </figcaption>
            </figure>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; --wb-fs-lead: min(clamp(1.0625rem, 1.3vw, 1.5625rem), 2.6svh); --wb-fs-h2: min(clamp(2.25rem, 4.06vw, 4.875rem), 6.6svh, 3.9vw); } /* one-screen: lead scales with screen height */
    .help { padding: var(--wb-section-y) 0; background: #f0f9fa; font-family: var(--wb-font-body); }

    .help__layout { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(32px, 4vw, 80px); align-items: center; }
    .help__intro { display: flex; flex-direction: column; align-items: flex-start; }

    /* Tabs: a vertical list under the heading */
    .tabs {
      margin-top: min(var(--wb-space-lg), 4svh);
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 5px;
      border: 1px solid #e1e7f5;
      border-radius: 24px;
      background: #fff;
    }
    .tabs__tab {
      flex: none;
      height: clamp(40px, min(3.5vw, 6svh), 56px);
      padding: 0 clamp(18px, 2vw, 30px);
      border-radius: 999px;
      text-align: left;
      font-size: var(--wb-fs-body);
      color: #2a2a2a;
      white-space: nowrap;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .tabs__tab--blue { --tone: #0a84ff; --tone-soft: #e6f1ff; --tone-ink: #fff; --tone-text: #0a6fd8; }
    .tabs__tab--purple { --tone: #7e5ebf; --tone-soft: #efe9fa; --tone-ink: #fff; --tone-text: #6a49ad; }
    .tabs__tab--plum { --tone: #85398a; --tone-soft: #f4e8f5; --tone-ink: #fff; --tone-text: #85398a; }
    .tabs__tab--yellow { --tone: #ffcf70; --tone-soft: #fdf5d2; --tone-ink: #1e1e1e; --tone-text: #6b5600; }
    .tabs__tab:not(.tabs__tab--active):hover { background: var(--tone-soft); color: var(--tone-text); }
    .tabs__tab--active { background: var(--tone); color: var(--tone-ink); font-weight: 600; }

    /* Selected tab: photo strip on top, text card below (full width of the right column) */
    .detail {
      /* Fills one screen (minus section padding): the photo takes whatever height the card leaves */
      height: min(calc(100svh - 2 * var(--wb-section-y)), 780px);
      display: grid;
      grid-template-rows: minmax(110px, 1fr) auto;
      gap: 14px;
      animation: detail-in 0.5s var(--wb-ease-out) both;
    }
    .detail .photo { order: -1; }
    @keyframes detail-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .detail--blue { --tone: #0a84ff; --tone-ink: #fff; --bullet: #ffc45c; --label: #0a84ff; }
    .detail--purple { --tone: #7e5ebf; --tone-ink: #fff; --bullet: #ffc45c; --label: #7e5ebf; }
    .detail--yellow { --tone: #ffcf70; --tone-ink: #1e1e1e; --bullet: #0e9aa5; --label: #0e9aa5; }
    .detail--plum { --tone: #85398a; --tone-ink: #fff; --bullet: #ffc45c; --label: #0e9aa5; }
    .detail--yellow .card__title { color: var(--wb-blue); } /* blue title on yellow, as in the design */
    .detail--yellow .card__title-icon { background: rgba(255, 255, 255, 0.45); }
    /* Cards with a kicker (API services design): roomier spacing and larger text, as in the mockup */
    :host(.is-centered) .detail .card--kicker .card__kicker { margin-bottom: clamp(12px, 3.4svh, 36px); }
    :host(.is-centered) .detail .card--kicker .card__title { font-size: clamp(1.25rem, min(1.85vw, 3.8svh), 2.25rem); line-height: 1.25; }
    :host(.is-centered) .detail .card--kicker .card__points { margin-top: clamp(16px, 4.4svh, 44px); gap: clamp(8px, 2.6svh, 26px); }
    :host(.is-centered) .detail .card--kicker .card__points li { font-size: clamp(0.9375rem, min(1.2vw, 2.5svh), 1.375rem); line-height: 1.45; }
    /* Cards with a kicker: outlined, see-through icon circle */
    .card--kicker .card__title-icon { background: rgba(255, 255, 255, 0.16); border: 1px solid rgba(255, 255, 255, 0.5); }
    .card--kicker .card__title-icon svg { stroke: #fff; }
    .detail--yellow .card--kicker .card__title-icon svg { stroke: var(--wb-blue); }
    .card__kicker { margin-bottom: min(var(--wb-space-xs), 2svh); font-size: clamp(0.8125rem, 0.85vw, 1rem); letter-spacing: 0.02em; text-transform: uppercase; }

    .card {
      padding: clamp(20px, min(2.2vw, 3.6svh), 40px);
      border-radius: 20px;
      background: var(--tone);
      color: var(--tone-ink);
    }
    .card__title { display: flex; align-items: center; gap: 16px; font-weight: 600; font-size: clamp(1.25rem, min(1.46vw, 3.2svh), 1.75rem); line-height: 1.3; }
    .card__title-icon { flex: none; width: clamp(36px, 5.5svh, 46px); height: clamp(36px, 5.5svh, 46px); display: grid; place-items: center; border-radius: 50%; background: #fff; }
    .card__title-icon svg { width: 22px; height: 22px; fill: none; stroke: var(--wb-blue); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
    .detail--purple .card__title-icon svg { stroke: #7e5ebf; }
    .card__intro { margin-top: min(var(--wb-space-xs), 1.8svh); font-size: clamp(0.9375rem, min(1.04vw, 2.3svh), 1.25rem); line-height: 1.55; }
    .card__points { margin-top: min(12px, 1.4svh); display: flex; flex-direction: column; gap: min(6px, 0.7svh); }
    .card__points li { position: relative; padding-left: 34px; font-size: clamp(0.875rem, min(0.94vw, 2.1svh), 1.125rem); line-height: 1.5; }
    .card__points li::before {
      content: '';
      position: absolute;
      left: 0;
      /* Centred on the first line of text (1lh = one line; the cloud shape sits low in its box, hence the offset) */
      top: calc(0.75em - 8.5px);
      top: calc(0.5lh - 8.5px);
      width: 22px;
      height: 14px;
      background: var(--bullet);
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 14'%3E%3Cpath d='M6 14a5 5 0 0 1-.6-10A6 6 0 0 1 16.5 5 4.5 4.5 0 0 1 17 14Z'/%3E%3C/svg%3E") center / contain no-repeat;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 14'%3E%3Cpath d='M6 14a5 5 0 0 1-.6-10A6 6 0 0 1 16.5 5 4.5 4.5 0 0 1 17 14Z'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    .card__points strong { font-weight: 700; }
    .card__note { margin-top: var(--wb-space-xs); font-size: 0.875rem; line-height: 1.55; opacity: 0.85; }

    /* Delivery model option tiles */
    .options { margin-top: var(--wb-space-xs); display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .option { padding: min(18px, 2.2svh) 20px; border-radius: 14px; background: rgba(255, 255, 255, 0.55); }
    .option__name { font-weight: 700; font-size: clamp(1rem, 1.04vw, 1.25rem); color: var(--wb-blue); }
    .option__text { margin-top: 8px; font-size: clamp(0.875rem, min(0.94vw, 2.1svh), 1.0625rem); line-height: 1.5; }
    .option__best { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(30, 30, 30, 0.12); font-size: clamp(0.8125rem, min(0.9vw, 2svh), 1rem); line-height: 1.45; }
    .option__best strong { display: block; font-weight: 700; }

    .photo { position: relative; margin: 0; border-radius: 20px; overflow: hidden; min-height: 0; } /* stretches to the card's height */
    .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--wb-ease-out); }
    .photo:hover img { transform: scale(1.04); }
    .photo__result {
      position: absolute;
      left: 24px;
      bottom: 24px;
      width: min(420px, calc(100% - 48px));
      padding: 14px 18px 16px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.66);
      backdrop-filter: blur(12px);
      font-size: clamp(0.9375rem, 0.94vw, 1.125rem);
      line-height: 1.45;
      color: #1e1e1e;
    }
    .photo__result-label { display: block; margin-bottom: 4px; font-weight: 700; color: var(--label); }

    /* Centred layout: heading and horizontal tabs on top, card left and photo right (photo matches the card's height) */
    /* The section is one screen tall; the card and photo grow to fill what the heading and tabs leave */
    :host(.is-centered) .help { min-height: 100svh; display: flex; flex-direction: column; justify-content: center; }
    :host(.is-centered) .help__layout { display: flex; flex-direction: column; align-items: stretch; gap: 0; flex: 1 1 auto; max-height: 960px; }
    :host(.is-centered) .help__intro { align-items: center; }
    :host(.is-centered) .tabs {
      flex-direction: row;
      width: fit-content;
      max-width: 100%;
      margin: min(var(--wb-space-lg), 3.6svh) auto 0;
      border-radius: 999px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    :host(.is-centered) .tabs__tab { text-align: center; }
    :host(.is-centered) .detail {
      flex: 1 1 auto;
      height: auto;
      min-height: 0;
      margin-top: min(var(--wb-space-md), 3svh);
      grid-template-rows: none;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: var(--wb-gap-cards);
    }
    :host(.is-centered) .detail .photo { order: 0; }
    :host(.is-centered) .card { display: flex; flex-direction: column; padding: clamp(24px, min(2.6vw, 4.6svh), 48px); }
    :host(.is-centered) .card__intro { margin-top: min(var(--wb-space-sm), 2.6svh); }
    :host(.is-centered) .card__points { margin-top: min(var(--wb-space-xs), 2svh); gap: min(12px, 1.4svh); }

    @media (prefers-reduced-motion: reduce) { .detail { animation: none; } }
    @media (max-width: 900px) {
      .help__layout { grid-template-columns: 1fr; }
      .help__intro { align-items: stretch; }
      .tabs { flex-direction: row; width: fit-content; max-width: 100%; border-radius: 999px; overflow-x: auto; scrollbar-width: none; }
      .detail { margin-top: var(--wb-space-md); height: auto; grid-template-rows: auto auto; }
      .detail .photo { height: auto; aspect-ratio: 16 / 9; }
    }
    @media (max-width: 900px) {
      :host(.is-centered) .help { min-height: 0; display: block; }
      :host(.is-centered) .help__layout { display: block; max-height: none; }
      :host(.is-centered) .detail { grid-template-columns: 1fr; }
      :host(.is-centered) .tabs { justify-content: flex-start; }
    }
    @media (max-width: 600px) {
      .options { grid-template-columns: 1fr; }
    }
  `,
})
export class AgenticHelpComponent {
  /** Page content; defaults to the Agentic AI copy. Other service pages pass their own. */
  readonly content = input<HelpContent>(AGENTIC_HELP);
  /** 'split' (default, Agentic AI) or 'centered' (Data modernization design) */
  readonly layout = input<'split' | 'centered'>('split');
  protected get c(): HelpContent { return this.content(); }
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.c.tabs[this.active()]);

  /** Arrow keys move between tabs (standard tab-list behaviour). */
  protected onKey(e: KeyboardEvent): void {
    const n = this.c.tabs.length;
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (this.active() + step + n) % n;
    this.active.set(next);
    (document.getElementById('help-tab-' + next) as HTMLElement | null)?.focus();
  }
}
