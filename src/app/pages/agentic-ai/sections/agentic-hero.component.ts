import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AGENTIC_HERO } from '../../../content/agentic-ai-content';
import { HeroContent } from '../../../content/content-types';

/** Agentic AI page hero: headline left, photo with three capability chips right. */
@Component({
  selector: 'wb-agentic-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hero">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div class="hero__copy">
          <h1 class="hero__title">
            @if (c.titleSegments) {
              @for (seg of c.titleSegments; track $index) {
                @if (seg.accent) {<span class="wb-accent">{{ seg.text }}</span>} @else {{{ seg.text }}}
                @if (seg.breakAfter) {<br />}
              }
            } @else {
              {{ c.titleLead }} <span class="wb-accent">{{ c.titleAccent }}</span>
            }
          </h1>
          <p class="wb-lead hero__lead">{{ c.lead }}</p>
        </div>
        <div class="hero__media">
          <img class="hero__photo" [src]="c.image" width="404" height="499" [alt]="c.imageAlt" />
          @for (chip of c.chips; track chip.label; let i = $index) {
            <span class="chip" [class]="'chip chip--' + (chip.pos ?? defaultPos[i]) + ' chip--' + chip.tone" [class.chip--two-line]="chip.sub">
              <span class="chip__label">{{ chip.label }}</span>
              @if (chip.sub) { <span class="chip__sub">{{ chip.sub }}</span> }
            </span>
          }
        </div>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .hero {
      position: relative;
      overflow: hidden;
      padding: 32px 0 var(--wb-section-y);
      /* White at the top, softening to periwinkle towards the bottom left */
      background:
        linear-gradient(180deg, #fff 12%, rgba(255, 255, 255, 0) 70%),
        linear-gradient(90deg, #c5d7ff 0%, #e4ecff 55%, #f3f6ff 100%);
    }
    .hero__nav-space { height: 74px; }
    .hero__inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 48px;
      margin-top: var(--wb-space-lg);
    }
    .hero__title {
      max-width: 820px;
      font-family: var(--wb-font-body); /* Manrope, like the home page hero */
      font-weight: 700;
      font-size: var(--wb-fs-h2); /* home page section heading size */
      line-height: var(--wb-lh-h2);
      letter-spacing: -0.01em;
      color: #0f0e09;
    }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 720px; }

    /* Photo 404 × 499 with chips overlapping its edges (positions from the design) */
    .hero__media {
      position: relative;
      width: clamp(300px, 28vw, 404px);
      margin-right: clamp(40px, 5.2vw, 75px);
    }
    .hero__photo { display: block; width: 100%; height: auto; aspect-ratio: 404 / 499; object-fit: cover; border-radius: 28px; }
    .chip {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      height: 51px;
      padding: 0 20px 0 18px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(28, 44, 110, 0.12);
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: clamp(0.9375rem, 1.18vw, 1.0625rem);
      color: #0f0e09;
      white-space: nowrap;
    }
    .chip::before { content: ''; flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--wb-blue); }
    .chip--yellow::before { background: #ffd04a; }
    .chip--top-right { left: 56%; top: 1.8%; }
    .chip--mid-right { left: 68.3%; top: 40.7%; }
    .chip--bottom-left { left: -25.7%; top: 95%; }
    /* Two-line chip: bold label with a dot, smaller line underneath */
    .chip--two-line { display: grid; grid-template-columns: auto 1fr; column-gap: 8px; row-gap: 2px; height: auto; padding: 12px 18px; }
    .chip--two-line::before { align-self: center; }
    .chip__sub { grid-column: 1 / -1; font-weight: 400; font-size: 0.875rem; color: #44474f; }
    .chip--two-line.chip--bottom-left { top: 82%; left: -22%; }

    @media (max-width: 1000px) {
      .hero__inner { grid-template-columns: 1fr; justify-items: center; text-align: left; }
      .hero__copy { justify-self: stretch; }
      .hero__media { margin: 8px 0 32px; }
    }
    @media (max-width: 600px) {
      .hero__media { width: min(320px, 78vw); }
      .chip { height: 40px; padding: 0 14px 0 12px; gap: 8px; font-size: 0.8125rem; border-radius: 10px; }
      .chip--top-right { left: auto; right: -6%; }
      .chip--mid-right { left: auto; right: -10%; }
      .chip--bottom-left, .chip--two-line.chip--bottom-left { left: -8%; }
      .chip--two-line { padding: 8px 12px; }
      .chip__sub { font-size: 0.75rem; }
    }
  `,
})
export class AgenticHeroComponent {
  /** Page content; defaults to the Agentic AI copy. Other service pages pass their own. */
  readonly content = input<HeroContent>(AGENTIC_HERO);
  protected get c(): HeroContent { return this.content(); }
  protected readonly defaultPos = ['top-right', 'mid-right', 'bottom-left'] as const;
}
