import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SectionHeadComponent } from '../../../shared/section-head.component';
import { PURPOSE } from '../../../content/about-content';

/** Advisory board on /company/purpose-leadership: domain / regional tabs, cards expand with "Read more". */
@Component({
  selector: 'wb-advisory-board',
  imports: [SectionHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  template: `
  <section class="adv" aria-labelledby="adv-title">
    <div class="wb-container">
      <wb-section-head icon="leadership" [eyebrow]="c.advisory.eyebrow" [title]="c.advisory.titleLead" [accent]="c.advisory.titleAccent" [lead]="c.advisory.lead" headingId="adv-title" />
      <div class="tabs" role="tablist" aria-label="Advisory board">
        @for (g of c.advisory.groups; track g.label; let i = $index) {
          <button type="button" role="tab" class="tabs__tab" [class.tabs__tab--on]="i === group()" [attr.aria-selected]="i === group()" (click)="group.set(i)">{{ g.label }}</button>
        }
      </div>
      @for (g of [c.advisory.groups[group()]]; track group()) {
        <ul class="advisors" role="tabpanel">
          @for (a of g.advisors; track a.name; let i = $index) {
            <li class="advisor" [class.is-open]="openAdv() === a.name" [style.animation-delay.ms]="i * 80">
              <img class="advisor__photo" [src]="a.image" width="388" height="388" [alt]="a.name" loading="lazy" />
              <div>
                <h3 class="advisor__name">{{ a.name }}</h3>
                <p class="advisor__role">{{ a.role }}</p>
                @for (p of a.bio; track $index) { <p class="advisor__text">{{ p }}</p> }
                <button type="button" class="advisor__toggle" (click)="openAdv.set(openAdv() === a.name ? null : a.name)" [attr.aria-expanded]="openAdv() === a.name">{{ openAdv() === a.name ? 'Show less' : 'Read more' }}</button>
                @if (a.highlights) {
                  <ul class="advisor__awards">
                    @for (h of a.highlights; track h) { <li>{{ h }}</li> }
                  </ul>
                }
              </div>
            </li>
          }
        </ul>
      }
    </div>
  </section>
  `,
  styles: `
    .adv { padding: calc(var(--wb-section-y) * 0.85) 0; background: #f4f7ff; }
    .tabs { width: fit-content; margin: min(var(--wb-space-md), 3svh) auto 0; display: flex; gap: 6px; padding: 5px; border: 1px solid #e1e7f5; border-radius: 999px; background: #fff; }
    .tabs__tab { padding: 10px 26px; border-radius: 999px; font-size: var(--wb-fs-body); color: #2a2a2a; transition: background-color 0.3s ease, color 0.3s ease; }
    .tabs__tab--on { background: var(--wb-blue); color: #fff; font-weight: 600; }
    .advisors { margin-top: min(var(--wb-space-lg), 4svh); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wb-gap-cards); align-items: start; }
    .advisors:has(> :nth-child(2):last-child) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .advisor {
      display: flex; flex-direction: column; gap: 14px;
      padding: clamp(20px, 2vw, 28px);
      border-radius: 22px; background: #fff;
      box-shadow: 0 10px 30px rgba(28, 44, 110, 0.06);
      animation: adv-in 0.5s var(--wb-ease-out) both;
      transition: transform 0.35s var(--wb-ease-out), box-shadow 0.35s var(--wb-ease-out);
    }
    .advisor:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(28, 44, 110, 0.12); }
    @keyframes adv-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    .advisor__photo { width: clamp(64px, 11svh, 96px); height: clamp(64px, 11svh, 96px); border-radius: 50%; object-fit: cover; }
    .advisor__name { font-weight: 700; font-size: clamp(1.0625rem, 1.2vw, 1.375rem); color: #0f0e09; }
    .advisor__role { margin-top: 4px; font-size: 0.9375rem; color: var(--wb-blue); }
    .advisor__text { margin-top: 10px; font-size: clamp(0.9375rem, 0.94vw, 1.0625rem); line-height: 1.6; color: var(--wb-ink-600); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .advisor.is-open .advisor__text { -webkit-line-clamp: unset; }
    .advisor.is-open .advisor__awards { display: flex; }
    .advisor__toggle { margin-top: 6px; font-weight: 700; font-size: 0.875rem; color: var(--wb-blue); }
    .advisor__awards { display: none; margin-top: 10px; flex-wrap: wrap; gap: 8px; }
    .advisor.is-open { grid-column: span 2; }
    .advisor__awards li { padding: 6px 12px; border-radius: 999px; background: #fff6d6; font-size: 0.8125rem; font-weight: 600; color: #6b5600; }
    @media (prefers-reduced-motion: reduce) { .advisor { transition: none; animation: none; } }
    @media (max-width: 1100px) { .advisors { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .advisors { grid-template-columns: 1fr; } }
  `,
})
export class AdvisoryBoardComponent {
  protected readonly c = PURPOSE;
  protected readonly group = signal(0);
  protected readonly openAdv = signal<string | null>(null);
}
