import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/button.component';
import { INFRA_SPEND } from '../../../content/infra-automation-content';

/** "Spend less on cloud": photo left; heading, text, three stat rows and a button right. */
@Component({
  selector: 'wb-infra-spend',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="spend" aria-labelledby="spend-title">
      <div class="wb-container spend__inner">
        <img class="spend__photo" [src]="c.image" width="512" height="586" [alt]="c.imageAlt" />
        <div class="spend__copy">
          <h2 class="wb-h2" id="spend-title">{{ c.titleLead }}<br /><span class="wb-accent">{{ c.titleAccent }}</span></h2>
          <p class="wb-lead spend__lead">{{ c.lead }}</p>
          <dl class="rows">
            @for (s of c.stats; track s.value) {
              <div class="row"><dt class="row__value">{{ s.value }}</dt><dd class="row__label">{{ s.label }}</dd></div>
            }
          </dl>
          <wb-button class="spend__cta" [href]="c.ctaHref">{{ c.cta }} <span aria-hidden="true">&nbsp;→</span></wb-button>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .spend { padding: var(--wb-fit-y) 0; background: #eaf0fe; }
    .spend .wb-h2 { font-size: var(--wb-fit-h2); }
    .spend__inner { display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr); gap: clamp(32px, 4vw, 72px); align-items: center; }
    .spend__photo { width: 100%; height: 100%; max-height: min(640px, calc(100svh - 2 * var(--wb-fit-y))); object-fit: cover; border-radius: 28px; filter: grayscale(1); }
    .spend__lead { margin-top: min(var(--wb-space-sm), 2.6svh); font-size: min(var(--wb-fs-lead), 2.7svh); }
    .rows { margin: min(var(--wb-space-md), 4svh) 0 0; border-top: 1px solid rgba(43, 58, 103, 0.14); }
    .row { display: grid; grid-template-columns: minmax(110px, 0.3fr) 1fr; gap: 24px; align-items: baseline; padding: clamp(6px, 1.2svh, 14px) 0; border-bottom: 1px solid rgba(43, 58, 103, 0.14); }
    .row__value { font-family: var(--wb-font-body); font-weight: 700; font-size: min(var(--wb-fs-card-title), 3.8svh); color: #0f0e09; }
    .row__label { margin: 0; font-family: var(--wb-font-body); font-size: var(--wb-fs-body); color: var(--wb-ink-600); }
    .spend__cta { margin-top: min(var(--wb-space-md), 4svh); }
    @media (max-width: 1000px) {
      .spend__inner { grid-template-columns: 1fr; }
      .spend__photo { aspect-ratio: 4 / 3; height: auto; max-height: 46svh; }
    }
  `,
})
export class InfraSpendComponent {
  protected readonly c = INFRA_SPEND;
}
