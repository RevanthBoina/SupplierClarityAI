import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STATS } from '../../content/site-content';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';

/** Figma "trust-sats" (805:60792): "The scoreboard so far". */
@Component({
  selector: 'wb-stats',
  imports: [CountUpDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats" aria-label="Track record">
      <div class="wb-container">
        <dl wbReveal="zoom" class="stats__board">
          @for (stat of stats; track stat.label; let i = $index) {
            <div class="stats__cell" wbReveal [wbRevealDelay]="200 + i * 110">
              <dt class="stats__label">{{ stat.label }}</dt>
              <dd class="stats__value">
                @if (asNumber(stat.value); as n) { <span [wbCountUp]="n"></span> } @else { {{ stat.value }} }<span class="wb-accent stats__accent">{{ stat.accent }}</span>
              </dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .stats {
      /* Sits directly under the client logos, so no top padding */
      padding: 0 0 var(--wb-section-y);
      background: transparent;
    }
    /* Column widths follow the Figma dividers: 430 / 358 / 328 / 545 */
    .stats__board {
      margin: 0;
      display: grid;
      grid-template-columns: 430fr 358fr 328fr 545fr;
      border: 1px solid var(--wb-line);
    }
    .stats__cell {
      display: flex;
      flex-direction: column-reverse;
      /* Numbers start from the same top line in every box (column-reverse: flex-end = top) */
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      min-height: clamp(150px, 10.5vw, 200px);
      padding: clamp(28px, 2.3vw, 44px) clamp(16px, 2vw, 40px) 32px;
      text-align: center;
    }
    .stats__cell + .stats__cell { border-left: 1px solid var(--wb-line); }
    .stats__value { font-variant-numeric: tabular-nums; }
    .stats__accent { display: inline-block; }
    .stats__value {
      margin: 0;
      font-family: var(--wb-font-display);
      font-weight: 900;
      font-size: clamp(1.75rem, 2.9vw, 3.5rem); /* 56px max, was 78px */
      line-height: 1.35;
      color: var(--wb-ink-900);
      white-space: nowrap;
    }
    .stats__label {
      max-width: 285px;
      font-family: var(--wb-font-body);
      font-size: var(--wb-fs-lead);
      line-height: 1.36;
      color: var(--wb-ink-800);
    }
    @media (max-width: 1000px) {
      .stats__board { grid-template-columns: 1fr 1fr; }
      .stats__cell:nth-child(3) { border-left: 0; }
      .stats__cell:nth-child(n + 3) { border-top: 1px solid var(--wb-line); }
    }
    @media (max-width: 520px) {
      .stats__board { grid-template-columns: 1fr; }
      .stats__cell + .stats__cell { border-left: 0; border-top: 1px solid var(--wb-line); }
      .stats__cell { min-height: 0; }
    }
  `,
})
export class StatsComponent {
  protected readonly stats = STATS;

  /** "2500" counts up; "ISO " is static text. */
  protected asNumber(value: string): number | null {
    return /^\d+$/.test(value) ? Number(value) : null;
  }
}
