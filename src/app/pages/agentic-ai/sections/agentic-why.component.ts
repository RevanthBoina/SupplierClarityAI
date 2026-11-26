import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeadComponent } from '../../../shared/section-head.component';
import { AGENTIC_WHY } from '../../../content/agentic-ai-content';

/**
 * "Why agentic AI": three photos cut into a circle, a cloud and a parallelogram.
 * Hover, keyboard focus or a tap flips a shape to a coloured panel with a short explanation.
 */
@Component({
  selector: 'wb-agentic-why',
  imports: [SectionHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="why" aria-labelledby="why-title">
      <div class="wb-container why__inner">
        <wb-section-head icon="why-agentic" [eyebrow]="c.eyebrow" [title]="c.titleLead" [accent]="c.titleAccent" [lead]="c.lead" headingId="why-title" />

        <ul class="shapes">
          @for (s of c.shapes; track s.title) {
            <li class="shape" [class]="'shape shape--' + s.shape + ' shape--' + s.tone" tabindex="0">
              <img class="shape__img" [src]="s.image" alt="" />
              <!-- Front: photo, icon, kicker and title -->
              <span class="shape__front">
                <span class="shape__icon" aria-hidden="true">
                  @switch (s.icon) {
                    @case ('target') {
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></svg>
                    }
                    @case ('code') {
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m9.5 9-3 3 3 3M14.5 9l3 3-3 3M13 7.5l-2 9" /></svg>
                    }
                    @default {
                      <svg viewBox="0 0 24 24"><ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" /><path d="M5.5 6.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" /></svg>
                    }
                  }
                </span>
                <span class="shape__kicker">{{ s.kicker }}</span>
                <span class="shape__title">{{ s.title }}</span>
              </span>
              <!-- Back: coloured panel with the explanation -->
              <span class="shape__back">
                <span class="shape__title">{{ s.title }}</span>
                <span class="shape__detail">{{ s.detail }}</span>
              </span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .why { padding: var(--wb-section-y) 0; background: #fff; border-bottom: 1px solid #edf0f6; }
    .why__inner { display: flex; flex-direction: column; align-items: center; }

    /* Sizes from the design: circle 1:1, cloud 441 × 239, parallelogram 304 × 239 */
    .shapes {
      --h: clamp(190px, 16.3vw, 300px);
      margin-top: var(--wb-space-lg);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 16px clamp(12px, 1.4vw, 24px);
    }
    .shape {
      position: relative;
      height: var(--h);
      display: grid;
      place-items: center;
      outline: none;
      cursor: default;
    }
    .shape--circle { aspect-ratio: 1; --mask: url('/assets/img/agentic/mask-circle.png'); }
    .shape--cloud { aspect-ratio: 441 / 239; --mask: url('/assets/img/agentic/mask-cloud.png'); }
    .shape--parallelogram { aspect-ratio: 304 / 239; --mask: url('/assets/img/agentic/mask-parallelogram.png'); }
    /* The shape is applied to every layer, so the photo, the wash and the coloured panel all keep it */
    .shape, .shape__img, .shape::after, .shape__back {
      -webkit-mask-image: var(--mask);
      mask-image: var(--mask);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
    }
    .shape--blue { --tone: #0a84ff; --tone-ink: #fff; }
    .shape--purple { --tone: #7e5ebf; --tone-ink: #fff; }
    /* Dark text on yellow for contrast (white on yellow is not readable) */
    .shape--yellow { --tone: #fade5d; --tone-ink: #1e1e1e; }

    .shape__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--wb-ease-out); }
    /* Dark wash for legibility. The placeholder images already include it; set ~0.55 for original photos. */
    .shape::after { content: ''; position: absolute; inset: 0; background: rgba(18, 26, 58, var(--shape-wash, 0)); }

    .shape__front, .shape__back {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 16%;
      transition: opacity 0.4s ease, transform 0.5s var(--wb-ease-out);
    }
    .shape__front { color: #fff; padding-top: 4%; }
    .shape--cloud .shape__front, .shape--cloud .shape__back { padding: 14% 18% 0; }
    .shape--parallelogram .shape__front, .shape--parallelogram .shape__back { padding-inline: 20%; }
    .shape__back {
      background: var(--tone);
      color: var(--tone-ink);
      opacity: 0;
      transform: scale(1.04);
    }
    .shape:hover .shape__back, .shape:focus-visible .shape__back, .shape:focus-within .shape__back { opacity: 1; transform: none; }
    .shape:hover .shape__front, .shape:focus-visible .shape__front, .shape:focus-within .shape__front { opacity: 0; transform: scale(0.96); }
    .shape:hover .shape__img { -webkit-mask-size: 94.3% 94.3%; mask-size: 94.3% 94.3%; -webkit-mask-position: center; mask-position: center; transform: scale(1.06); }

    .shape__icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #fff;
      margin-bottom: 12px;
    }
    .shape__icon svg { width: 20px; height: 20px; fill: none; stroke: var(--wb-blue); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
    .shape--parallelogram .shape__icon svg { stroke: #0f0e09; }
    .shape__kicker {
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.35;
    }
    /* "RaaS" must keep its lower-case "aa" */
    .shape--circle .shape__kicker { text-transform: none; letter-spacing: 0.02em; font-size: 0.8125rem; }
    .shape--circle .shape__front { padding-inline: 10%; }
    .shape__title {
      margin-top: 6px;
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: clamp(1.125rem, 1.25vw, 1.5rem);
      line-height: 1.35;
    }
    .shape__back .shape__title { margin-top: 0; }
    .shape__detail {
      margin-top: 8px;
      font-family: var(--wb-font-body);
      font-size: clamp(0.8125rem, 0.83vw, 1rem);
      line-height: 1.5;
    }
    .shape--circle .shape__back { padding-inline: 14%; }

    @media (prefers-reduced-motion: reduce) {
      .shape__front, .shape__back, .shape__img { transition: none; }
    }
    @media (max-width: 760px) {
      .shapes { --h: min(260px, 60vw); flex-direction: column; }
    }
  `,
})
export class AgenticWhyComponent {
  protected readonly c = AGENTIC_WHY;
}
