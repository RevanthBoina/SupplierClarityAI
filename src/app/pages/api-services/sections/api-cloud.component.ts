import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PillLabelComponent } from '../../../shared/pill-label.component';
import { API_CLOUD } from '../../../content/api-services-content';

/** "Cloud ready from day one": blue band with a faint grid, decorative rings top-right and four glass cards. */
@Component({
  selector: 'wb-api-cloud',
  imports: [PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cloud" aria-labelledby="cloud-title">
      <div class="cloud__grid" aria-hidden="true"></div>
      <svg class="cloud__rings" viewBox="0 0 400 300" aria-hidden="true">
        <circle cx="300" cy="80" r="190" /><circle cx="300" cy="80" r="130" stroke-dasharray="10 10" />
        <circle cx="128" cy="110" r="9" class="dot" /><circle cx="235" cy="148" r="9" class="dot" /><circle cx="330" cy="190" r="9" class="dot" />
      </svg>
      <div class="wb-container cloud__inner">
        <wb-pill-label icon="infrastructure" tone="light">{{ c.eyebrow }}</wb-pill-label>
        <h2 class="wb-h2 cloud__title" id="cloud-title"><span class="cloud__accent">{{ c.titleAccent }}</span>{{ ' ' }}{{ c.titleRest }}</h2>
        <p class="wb-lead cloud__lead">{{ c.lead }}</p>
        <ol class="cards">
          @for (item of c.items; track item; let i = $index) {
            <li class="card">
              <span class="card__num" aria-hidden="true">0{{ i + 1 }}</span>
              <p class="card__text">{{ item }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .cloud { position: relative; overflow: hidden; padding: var(--wb-section-y) 0; background: #2f5bf0; color: #fff; font-family: var(--wb-font-body); }
    .cloud__grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
      background-size: 120px 120px;
      background-position: center top;
    }
    .cloud__rings { position: absolute; top: -40px; right: -60px; width: min(420px, 34vw); pointer-events: none; }
    .cloud__rings circle { fill: none; stroke: rgba(255, 255, 255, 0.22); stroke-width: 2; }
    .cloud__rings .dot { fill: rgba(255, 255, 255, 0.2); stroke: none; }
    .cloud__inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .cloud__title { margin-top: var(--wb-space-xs); color: #fff; }
    .cloud__accent { color: #ffd84d; }
    .cloud__lead { margin-top: var(--wb-space-xs); max-width: 1000px; color: rgba(255, 255, 255, 0.85); }
    .cards { width: 100%; margin-top: var(--wb-space-lg); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wb-gap-cards); text-align: left; }
    .card {
      min-height: clamp(180px, 26svh, 280px);
      padding: clamp(20px, 2vw, 32px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 16px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
      transition: background-color 0.3s ease, transform 0.4s var(--wb-ease-out);
    }
    .card:hover { transform: translateY(-4px); }
    .card__num { display: block; font-weight: 700; font-size: min(var(--wb-fs-h3), 5.4svh); line-height: 1; color: #ffd84d; }
    .card__text { margin-top: min(var(--wb-space-sm), 2.6svh); font-size: var(--wb-fs-body); line-height: 1.5; }
    @media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }
    @media (max-width: 1000px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .cards { grid-template-columns: 1fr; } .card { min-height: 0; } }
  `,
})
export class ApiCloudComponent {
  protected readonly c = API_CLOUD;
}
