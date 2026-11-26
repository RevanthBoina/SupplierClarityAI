import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from './button.component';
import { CONSULTATION_HREF } from '../content/site-content';

/**
 * Closing call to action used at the end of pages: grid panel (yellow or blue), photo, heading, lead
 * and two buttons ("Book a consultation" + an outline button).
 */
@Component({
  selector: 'wb-cta-panel',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta" [attr.aria-labelledby]="headingId()">
      <div class="wb-container">
        <div class="panel" [class.panel--blue]="tone() === 'blue'">
          <img class="panel__img" [src]="image()" width="560" height="460" [alt]="imageAlt()" />
          <div class="panel__copy">
            <h2 class="wb-h2" [id]="headingId()">{{ title() }}@if (accent()) {{{ ' ' }}<span class="wb-accent">{{ accent() }}</span>}</h2>
            <p class="wb-lead panel__lead">{{ lead() }}</p>
            <div class="panel__actions">
              <wb-button [href]="primaryHref()" [variant]="tone() === 'blue' ? 'yellow' : 'primary'">{{ primaryLabel() }}</wb-button>
              @if (secondaryLabel()) {
                <wb-button [href]="secondaryHref()" [variant]="tone() === 'blue' ? 'outline-light' : 'outline'">{{ secondaryLabel() }}</wb-button>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .cta { padding: var(--wb-section-y) 0; }
    .panel {
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-columns: minmax(0, 560px) minmax(0, 1fr);
      align-items: center;
      gap: clamp(32px, 4.4vw, 64px);
      padding: 24px;
      border-radius: 32px;
      background-color: #ffdb57;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
      background-size: 96px 96px;
    }
    /* Blue version: white heading, yellow phrase, white text */
    .panel--blue {
      background-color: #3159ea;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(120deg, #2c58f1 0%, #3d63f0 100%);
      background-size: 96px 96px, 96px 96px, auto;
      color: #fff;
    }
    .panel--blue .wb-h2 { color: #fff; }
    .panel--blue .wb-accent { color: var(--wb-yellow); }
    .panel--blue .panel__lead { color: rgba(255, 255, 255, 0.88); }
    .panel__img { display: block; width: 100%; height: auto; aspect-ratio: 560 / 460; object-fit: cover; border-radius: 24px; }
    .panel__copy { padding: 16px clamp(0px, 4vw, 64px) 16px 0; }
    .panel__lead { margin-top: var(--wb-space-sm); max-width: 640px; color: #2a2a2a; }
    .panel__actions { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; gap: 16px; }
    @media (max-width: 1000px) {
      .panel { grid-template-columns: 1fr; }
      .panel__copy { padding: 8px 12px 16px; }
    }
  `,
})
export class CtaPanelComponent {
  readonly title = input.required<string>();
  readonly accent = input('');
  readonly lead = input('');
  readonly image = input.required<string>();
  readonly imageAlt = input('');
  readonly primaryLabel = input('Book a consultation');
  readonly primaryHref = input(CONSULTATION_HREF);
  readonly secondaryLabel = input('');
  readonly secondaryHref = input('#');
  readonly headingId = input('cta-title');
  /** 'yellow' (default) or 'blue' */
  readonly tone = input<'yellow' | 'blue'>('yellow');
}
