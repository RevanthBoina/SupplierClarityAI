import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from './button.component';
import { CtaBandContent } from '../content/content-types';

/**
 * Yellow closing band with a faint grid: centred heading, lead and one or two buttons (product pages).
 * Paints its own yellow, so put wbSectionTheme="#ffffff" on it: the page and footer stay white.
 */
@Component({
  selector: 'wb-cta-band',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="band" aria-labelledby="band-title">
      <div class="band__grid" aria-hidden="true"></div>
      <div class="wb-container band__inner">
        <h2 class="wb-h2 band__title" id="band-title">{{ c.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span></h2>
        <p class="wb-lead band__lead">{{ c.lead }}</p>
        <div class="band__actions">
          <wb-button [href]="c.primary.href">{{ c.primary.label }}</wb-button>
          @if (c.secondary) { <wb-button variant="outline" [href]="c.secondary.href">{{ c.secondary.label }}</wb-button> }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .band { position: relative; overflow: hidden; padding: calc(var(--wb-section-y) * 1.1) 0; background: #ffdb57; }
    .band__grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px);
      background-size: 96px 96px;
      background-position: center top;
    }
    .band__inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .band__title { font-family: var(--wb-font-body); font-size: min(clamp(2rem, 3.4vw, 4rem), 7svh); }
    .band__lead { margin-top: var(--wb-space-sm); max-width: 820px; color: #1e1e1e; }
    .band__actions { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
  `,
})
export class CtaBandComponent {
  readonly content = input.required<CtaBandContent>();
  protected get c(): CtaBandContent { return this.content(); }
}
