import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CarouselArrowsComponent } from '../../shared/carousel-arrows.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { TESTIMONIALS } from '../../content/site-content';

/** Figma "testimonials-section" (805:61019): "What our clients say" carousel. */
@Component({
  selector: 'wb-testimonials',
  imports: [CarouselArrowsComponent, PillLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="testimonials" aria-labelledby="testimonials-title">
      <div class="testimonials__grid-lines" aria-hidden="true"></div>
      <div class="wb-container testimonials__inner">
        <header class="testimonials__head" wbReveal>
          <wb-pill-label icon="testimonials">Testimonials</wb-pill-label>
          <h2 class="wb-h2" id="testimonials-title"><span class="wb-accent">What our</span> clients say</h2>
          <p class="wb-lead">Discover how our solutions, innovation, and support help clients achieve lasting success.</p>
        </header>

        <div class="stage" aria-roledescription="carousel" aria-label="Client testimonials" wbReveal="zoom" [wbRevealDelay]="120">
          <!-- Re-created on every change so the enter animation replays -->
          @for (t of [current()]; track index()) {
          <figure class="quote-card" [class.quote-card--back]="direction() < 0" aria-live="polite" [attr.aria-label]="(index() + 1) + ' of ' + testimonials.length">
            <div class="quote-card__logo">
              <img [src]="t.companyLogo" width="164" height="54" [alt]="t.companyName" />
            </div>
            <blockquote class="quote-card__text">
              <p>{{ t.quoteBefore }}<strong>{{ t.highlight }}</strong>{{ t.quoteAfter }}</p>
            </blockquote>
            <figcaption class="quote-card__author">
              <span class="quote-card__avatar" aria-hidden="true">{{ t.initials }}</span>
              <span>
                <span class="quote-card__name">{{ t.name }}</span>
                <span class="quote-card__role">{{ t.role }}</span>
              </span>
            </figcaption>
          </figure>
          }

          <wb-carousel-arrows
            variant="chevron"
            itemLabel="testimonial"
            [canGoBack]="testimonials.length > 1"
            [canGoForward]="testimonials.length > 1"
            (previous)="go(-1)"
            (next)="go(1)" />
        </div>

        <div class="dots" role="group" aria-label="Choose testimonial">
          @for (item of testimonials; track item.name; let i = $index) {
            <button type="button" class="dots__dot" [class.dots__dot--active]="i === index()" (click)="goTo(i)" [attr.aria-label]="'Testimonial ' + (i + 1)" [attr.aria-current]="i === index()"></button>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .testimonials {
      /* Tighter than other sections so the whole section fits in one screen height */
      position: relative;
      padding: clamp(40px, 3.4vw, 64px) 0;
      background: transparent;
    }
    /* Same white hairline grid as Services, fading out at the top and bottom of the section */
    .testimonials__grid-lines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px);
      background-size: 98.77px 100px;
      background-position: calc(50% - 900.7px) 0, 0 0;
      mask-image: linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent);
      animation: wb-grid-drift 30s linear infinite;
    }
    .testimonials__inner { position: relative; z-index: 1; }
    .testimonials__head {
      max-width: 902px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wb-space-xs);
      text-align: center;
    }
    .testimonials__head .wb-lead { margin-top: 0; }

    .stage { position: relative; max-width: 1080px; margin: var(--wb-space-md) auto 0; }
    .stage wb-carousel-arrows { inset-inline: calc(-1 * clamp(52px, 4.2vw, 76px)); }

    .quote-card {
      margin: 0;
      padding: clamp(24px, 2.1vw, 40px) clamp(24px, 3.4vw, 64px);
      border: 1px solid var(--wb-blue);
      border-radius: 22px;
      background: linear-gradient(90deg, #ac5a84 0%, #96579d 66%);
      box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.07);
      color: #fff;
    }
    /* Client logos are shown as white monochrome marks, straight on the card */
    .quote-card__logo img { height: clamp(30px, 2vw, 38px); width: auto; }
    .quote-card__text { margin: 18px 0 0; }
    .quote-card__text p {
      font-family: var(--wb-font-display);
      font-style: italic;
      font-weight: 500;
      font-size: clamp(1.125rem, 1.4vw, 1.625rem); /* 26px max, was 42px */
      line-height: 1.38;
    }
    .quote-card__text strong { font-weight: 700; color: var(--wb-yellow); }

    .quote-card__author { margin-top: 20px; display: flex; align-items: center; gap: 16px; }
    .quote-card__avatar {
      flex: none;
      width: 56px;
      height: 56px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: var(--wb-yellow);
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: 1.375rem;
      color: #000;
    }
    .quote-card__name, .quote-card__role { display: block; font-size: clamp(1rem, 1.05vw, 1.25rem); line-height: 1.36; }
    .quote-card__name { font-family: var(--wb-font-body); font-weight: 600; }
    .quote-card__role { margin-top: 2px; font-family: var(--wb-font-display); font-style: italic; }

    .dots { margin-top: var(--wb-space-sm); display: flex; justify-content: center; gap: var(--wb-space-2xs); }
    .dots__dot { width: 12px; height: 12px; border-radius: 6px; background: #d9d9d9; transition: background-color 0.3s ease, width 0.4s var(--wb-ease-out); }
    .dots__dot--active { width: 32px; background: var(--wb-blue); }

    /* Slide transition between testimonials */
    .quote-card { animation: quote-in 0.7s var(--wb-ease-out) both; }
    .quote-card--back { animation-name: quote-in-back; }
    @keyframes quote-in { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: none; } }
    @keyframes quote-in-back { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
    .quote-card__text strong {
      background: linear-gradient(transparent 62%, rgba(255, 208, 106, 0.18) 62%) no-repeat 0 0 / 0% 100%;
      animation: highlight 1s var(--wb-ease-out) 0.6s forwards;
    }
    @keyframes highlight { to { background-size: 100% 100%; } }
    .quote-card__avatar { animation: avatar-pop 0.6s var(--wb-ease-spring) 0.35s both; }
    @keyframes avatar-pop { from { transform: scale(0.4); opacity: 0; } to { transform: none; opacity: 1; } }

    @media (max-width: 720px) {
      .stage wb-carousel-arrows { inset-inline: -8px; top: auto; bottom: -84px; transform: none; justify-content: center; gap: 16px; }
      .dots { margin-top: 100px; }
      .quote-card__avatar { width: 56px; height: 56px; font-size: 1.4rem; }
    }
  `,
})
export class TestimonialsComponent {
  protected readonly testimonials = TESTIMONIALS;
  protected readonly index = signal(0);
  protected readonly current = computed(() => this.testimonials[this.index()]);
  protected readonly direction = signal(1);

  protected go(step: number): void {
    const count = this.testimonials.length;
    this.direction.set(step);
    this.index.update(i => (i + step + count) % count);
  }

  protected goTo(i: number): void {
    this.direction.set(i >= this.index() ? 1 : -1);
    this.index.set(i);
  }
}
