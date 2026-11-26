import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INFRA_BENEFITS } from '../../../content/infra-automation-content';

/** "AI-driven transformation benefits": yellow section (page colour) with grid lines, 2 × 2 items. */
@Component({
  selector: 'wb-infra-benefits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="benefits" aria-labelledby="benefits-title">
      <div class="benefits__grid" aria-hidden="true"></div>
      <div class="wb-container benefits__inner">
        <h2 class="wb-h2 benefits__title" id="benefits-title">{{ c.titleLead }} <span class="wb-accent">{{ c.titleAccent }}</span></h2>
        <ul class="items">
          @for (item of c.items; track item.title) {
            <li class="item">
              <h3 class="item__title">
                <span class="item__icon" aria-hidden="true">
                  @switch (item.icon) {
                    @case ('gear') { <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></svg> }
                    @case ('database') { <svg viewBox="0 0 24 24"><ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" /><path d="M5.5 6.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" /></svg> }
                    @case ('shield') { <svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="M12 7v10" /></svg> }
                    @default { <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m9.5 9-3 3 3 3M14.5 9l3 3-3 3M13 7.5l-2 9" /></svg> }
                  }
                </span>
                {{ item.title }}
              </h3>
              <p class="item__text">{{ item.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .benefits { position: relative; padding: var(--wb-fit-y) 0; font-family: var(--wb-font-body); }
    .benefits__grid {
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
    .benefits__inner { position: relative; }
    .benefits__title { text-align: center; }
    .items { margin-top: var(--wb-fit-gap); display: grid; grid-template-columns: 1fr 1fr; gap: 48px 64px; }
    .item__title { display: flex; align-items: center; gap: 14px; font-weight: 600; font-size: var(--wb-fs-card-title); line-height: 1.3; color: #0f0e09; }
    .item__icon { flex: none; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; background: #ffefb4; }
    .item__icon svg { width: 22px; height: 22px; fill: none; stroke: #0f0e09; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
    .item__text { margin-top: var(--wb-space-xs); max-width: 640px; font-size: var(--wb-fs-body); line-height: 1.6; color: #2a2a2a; }
    @media (prefers-reduced-motion: reduce) { .benefits__grid { animation: none; } }
    @media (max-width: 760px) { .items { grid-template-columns: 1fr; gap: 32px; } }
  `,
})
export class InfraBenefitsComponent {
  protected readonly c = INFRA_BENEFITS;
}
