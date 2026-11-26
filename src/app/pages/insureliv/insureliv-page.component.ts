import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ButtonComponent } from '../../shared/button.component';
import { INSURELIV } from '../../content/insureliv-content';

/**
 * /products/insureliv: short landing page for InsureLiv (it has its own website).
 * Hero (headline, lead, framed photo) and a yellow band that sends visitors to insureliv.com. No animation.
 */
@Component({
  selector: 'wb-insureliv-page',
  imports: [SectionThemeDirective, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <header class="hero" wbSectionTheme="#ffffff">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div>
          <h1 class="hero__title">{{ c.hero.titleLead }}<br /><span class="wb-accent">{{ c.hero.titleAccent }}</span></h1>
          <p class="wb-lead hero__lead">{{ c.hero.lead }}</p>
        </div>
        <div class="frame">
          <img class="frame__photo" [src]="c.hero.image" width="550" height="306" [alt]="c.hero.imageAlt" />
        </div>
      </div>
    </header>

    <main>
      <section class="cta" wbSectionTheme="#ffffff" aria-labelledby="insureliv-cta">
        <div class="cta__grid" aria-hidden="true"></div>
        <div class="wb-container cta__inner">
          <h2 class="wb-h2" id="insureliv-cta">{{ c.cta.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.cta.titleAccent }}</span></h2>
          <p class="wb-lead cta__lead">{{ c.cta.lead }}</p>
          <wb-button class="cta__btn" [href]="c.cta.href">{{ c.cta.button }} <span aria-hidden="true">&nbsp;→</span></wb-button>
        </div>
      </section>
    </main>
  `,
  styles: `
    /* Headings a touch smaller than other pages, as in the InsureLiv design (each fits on one line at desktop width) */
    :host { display: block; --wb-fs-h2: min(clamp(2rem, 3.6vw, 4.375rem), 8.2svh); }
    .hero {
      padding: 32px 0 var(--wb-section-y);
      background:
        linear-gradient(180deg, #fff 10%, rgba(255, 255, 255, 0) 70%),
        linear-gradient(90deg, #c5d7ff 0%, #e4ecff 55%, #f3f6ff 100%);
    }
    .hero__nav-space { height: 74px; }
    .hero__inner { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: center; margin-top: var(--wb-space-lg); }
    .hero__title { font-family: var(--wb-font-body); font-weight: 700; font-size: min(clamp(2rem, 3.3vw, 4rem), 7.4svh); /* "Built for insurance brokers." on one line, as in the design */ line-height: var(--wb-lh-h2); letter-spacing: -0.01em; color: #0f0e09; }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 640px; }

    /* Photo in a white frame on a soft periwinkle panel, as in the design */
    .frame {
      padding: clamp(20px, 2vw, 52px) clamp(16px, 1.6vw, 22px);
      border-radius: 32px;
      background: linear-gradient(160deg, #eef2ff 0%, #c9d6ff 100%);
    }
    .frame__photo {
      display: block;
      width: 100%;
      height: auto;
      max-height: calc(100svh - 106px - 2 * var(--wb-section-y) - 80px);
      aspect-ratio: 550 / 306;
      object-fit: cover;
      border: 8px solid #fff;
      border-radius: 22px;
      box-shadow: 0 18px 40px rgba(14, 154, 165, 0.14);
    }

    .cta { position: relative; overflow: hidden; padding: calc(var(--wb-section-y) * 1.1) 0; background: #ffdb57; }
    .cta__grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px);
      background-size: 96px 96px;
      background-position: center top;
    }
    .cta__inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .cta__lead { margin-top: var(--wb-space-sm); color: #1e1e1e; }
    .cta__btn { margin-top: var(--wb-space-md); }

    @media (max-width: 1000px) {
      .hero__inner { grid-template-columns: 1fr; margin-top: var(--wb-space-lg); }
      .frame__photo { max-height: none; }
    }
  `,
})
export class InsureLivPageComponent {
  protected readonly c = INSURELIV;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: INSURELIV.hero.lead });
  }
}
