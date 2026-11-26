import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/button.component';
import { CarouselArrowsComponent } from '../../shared/carousel-arrows.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CASE_STUDIES, CONSULTATION_HREF } from '../../content/site-content';

/**
 * Figma "proff-section" (805:60966): "Already in production, across industries."
 * A three-up carousel where the centre card is featured; the arrows slide every card to its next slot.
 */
@Component({
  selector: 'wb-case-studies',
  imports: [ButtonComponent, CarouselArrowsComponent, PillLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cases" id="case-studies" aria-labelledby="cases-title">
      <div class="wb-container">
        <header class="cases__head" wbReveal>
          <wb-pill-label icon="resources">Resources</wb-pill-label>
          <h2 class="wb-h2" id="cases-title"><span class="wb-accent">Already in production,</span><br />across industries.</h2>
          <p class="wb-lead">Proven in live enterprise deployments, and built to adapt to your systems, data and rules. You start ahead, not from scratch.</p>
        </header>

        <div class="stage" aria-roledescription="carousel" aria-label="Case studies" wbReveal [wbRevealDelay]="150">
          <!-- Every card stays in the page and glides to its new slot (-1 left, 0 centre, 1 right) -->
          <ul class="cases__track" aria-live="polite">
            @for (item of cards(); track item.study.title) {
              <li class="case"
                  [class.case--featured]="item.slot === 0"
                  [class.case--side]="item.slot !== 0"
                  [class.case--wrap]="item.wrapped"
                  [class.is-settled]="settled()"
                  [style.--slot]="item.slot"
                  [attr.aria-hidden]="item.slot !== 0 ? 'true' : null">
                <span class="case__chip">{{ item.study.industry }}</span>
                <span class="case__icon"><img [src]="item.study.icon" width="32" height="32" alt="" /></span>
                <h3 class="case__title">{{ item.study.title }}</h3>
                <a class="case__link" [href]="item.study.href" [attr.tabindex]="item.slot !== 0 ? -1 : null">Read case study <span aria-hidden="true">→</span></a>
              </li>
            }
          </ul>
          <wb-carousel-arrows variant="chevron" itemLabel="case study" (previous)="go(-1)" (next)="go(1)" />
        </div>

        <div class="cases__cta" wbReveal [wbRevealDelay]="250">
          <wb-button [href]="consultationHref">Book a consultation</wb-button>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .cases {
      position: relative;
      overflow: hidden;
      /* Tighter than other sections so the whole section fits in one screen height */
      padding: clamp(32px, 2.6vw, 48px) 0;
      background: transparent;
    }
    .cases__head {
      max-width: 902px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wb-space-xs);
      text-align: center;
    }
    .cases__head .wb-lead { margin-top: 0; }

    .stage { position: relative; margin-top: var(--wb-space-md); }
    .stage wb-carousel-arrows { inset-inline: calc(-1 * clamp(0px, 1.88vw, 35px)); }

    /* All cards share the featured card's size; side cards are scaled down, so they always match each
       other and are always smaller than the centre card. Moving = sliding each card to its new slot. */
    .cases__track {
      --w: min(560px, (100% - 230px) / 2.56); /* centre width; side cards are 78% of it */
      --side-scale: 0.78;
      --gap: 24px;
      position: relative;
      height: clamp(220px, 12.5vw, 240px);
    }
    .case {
      position: absolute;
      top: 0;
      left: 50%;
      width: var(--w);
      height: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto 1fr;
      align-content: start;
      gap: 20px 12px;
      padding: 24px 24px 28px;
      border: 1px solid var(--wb-blue-border);
      border-radius: 22px;
      overflow: hidden;
      /* Placeholder for the glass-building photography, which is not in the asset pack yet */
      background:
        linear-gradient(-90deg, rgba(255, 255, 255, 0) 5.5%, rgba(255, 255, 255, 0.7) 34.1%),
        linear-gradient(160deg, #f5f8ff 0%, #e4ecff 55%, #b9cdfb 100%);
      /* Slot offset: half the centre card + the gap + half a side card */
      transform:
        translateX(-50%)
        translateX(calc(var(--slot) * (50% + var(--gap) + 50% * var(--side-scale))))
        scale(var(--scale, 1));
      transition:
        transform 0.7s cubic-bezier(0.65, 0, 0.35, 1),
        opacity 0.5s ease,
        border-color 0.5s ease,
        box-shadow 0.5s ease,
        translate 0.4s var(--wb-ease-out);
    }
    .case--side { --scale: var(--side-scale); }
    /* A card that wraps from one end to the other fades out and back in instead of crossing the centre */
    .case--wrap { animation: case-wrap 0.7s ease both; transition: none; }
    @keyframes case-wrap { 0% { opacity: 0; } 45% { opacity: 0; } 100% { opacity: 1; } }
    .case--featured {
      border-color: var(--wb-blue);
      box-shadow: 4px 4px 15px rgba(14, 154, 165, 0.15);
      background:
        linear-gradient(-90deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.75) 45%),
        linear-gradient(150deg, #eef3ff 0%, #d4e2ff 50%, #8fb0f7 100%);
    }

    .case__chip {
      justify-self: start;
      align-self: center;
      display: inline-flex;
      align-items: center;
      height: 36px;
      padding: 6px 16px;
      border-radius: 48px;
      background: var(--wb-blue-chip);
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: clamp(0.875rem, 0.85vw, 1rem);
      color: var(--wb-blue);
      white-space: nowrap;
    }
    .case__icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 22px; background: var(--wb-blue-icon); }
    .case__icon img { width: 24px; height: 24px; }
    .case__chip { position: relative; transition: background-color 0.4s ease, padding 0.4s ease; }
    /* Featured card: the tag is plain text, and an underline draws in from left to right
       each time a card lands in the centre */
    .case--featured .case__chip {
      position: relative;
      height: auto;
      padding: 0 0 4px;
      border-radius: 0;
      background: none;
      color: var(--wb-blue);
    }
    .case--featured .case__chip::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      border-radius: 2px;
      background: var(--wb-blue);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.6s var(--wb-ease-out) 0.55s;
    }
    .case__chip::after { content: ''; transform: scaleX(0); transform-origin: left; }
    .case--featured.is-settled .case__chip::after { transform: scaleX(1); }
    @media (prefers-reduced-motion: reduce) {
      .case { transition: none; }
      .case--featured .case__chip::after { transition: none; transform: scaleX(1); }
    }

    .case__title {
      grid-column: 1 / -1;
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: clamp(1.125rem, 1.25vw, 1.5rem); /* 24px max */
      line-height: 1.4;
      color: #000;
    }
    .case__link {
      grid-column: 1 / -1;
      align-self: end;
      font-family: var(--wb-font-display);
      font-weight: 500;
      font-size: clamp(1rem, 0.95vw, 1.125rem);
      color: var(--wb-blue);
    }
    .case__link::after { content: ''; position: absolute; inset: 0; } /* whole card is clickable */
    .case--featured:hover { box-shadow: 4px 8px 24px rgba(14, 154, 165, 0.18); }

    .cases__cta { margin-top: var(--wb-space-md); display: flex; justify-content: center; }

    .case__icon { transition: transform 0.6s var(--wb-ease-spring); }
    .case:hover .case__icon { transform: rotate(-12deg) scale(1.1); }
    .case__link span { display: inline-block; transition: transform 0.3s var(--wb-ease-out); }
    .case:hover .case__link span { transform: translateX(6px); }
    .case--featured:hover { translate: 0 -6px; }

    @media (max-width: 1100px) {
      .cases__track { --w: 100%; height: auto; min-height: 240px; display: grid; padding-inline: 56px; /* room for the arrows */ }
      .case { position: relative; left: 0; grid-area: 1 / 1; height: auto; min-height: 240px; transform: none; }
      .case--side { opacity: 0; visibility: hidden; }
    }
  `,
})
export class CaseStudiesComponent {
  protected readonly consultationHref = CONSULTATION_HREF;
  /** Index of the featured (centre) case study; Figma shows Insurance in the middle. */
  private readonly featured = signal(1);
  /** Slots before the last move, so a card that jumps from one end to the other can fade instead. */
  private readonly previousSlots = signal<number[] | null>(null);
  /** False while cards are moving; the centre card's tag underline draws in once it has landed. */
  protected readonly settled = signal(true);
  private settleTimer?: ReturnType<typeof setTimeout>;

  /** Each card's slot: -1 left, 0 centre, 1 right (more than three cards would need hidden slots). */
  private slotsFor(f: number): number[] {
    const n = CASE_STUDIES.length;
    return CASE_STUDIES.map((_, i) => {
      let d = (i - f + n) % n;
      if (d > n / 2) d -= n;
      return d;
    });
  }

  protected readonly cards = computed(() => {
    const slots = this.slotsFor(this.featured());
    const prev = this.previousSlots();
    return CASE_STUDIES.map((study, i) => ({
      study,
      slot: slots[i],
      wrapped: prev !== null && Math.abs(slots[i] - prev[i]) > 1,
    }));
  });

  protected go(step: number): void {
    const n = CASE_STUDIES.length;
    this.previousSlots.set(this.slotsFor(this.featured()));
    this.featured.update(i => (i + step + n) % n);
    this.settled.set(false);
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.settled.set(true), 50);
  }
}
