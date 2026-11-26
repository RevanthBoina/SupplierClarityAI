import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Eyebrow icons supplied by WhiteBlue (public/assets/icons/eyebrow). */
export type EyebrowIcon =
  | 'careers' | 'how-we-work' | 'industries' | 'leadership' | 'our-values' | 'products'
  | 'resources' | 'services' | 'testimonials' | 'track-record' | 'trust-security'
  | 'why-agentic' | 'how-we-help' | 'business-impact' | 'infrastructure' | 'capabilities';

/**
 * Section eyebrow: icon + label in a pill (Figma "Frame 118").
 *   <wb-pill-label icon="products">Products</wb-pill-label>
 */
@Component({
  selector: 'wb-pill-label',
  host: { '[class.is-light]': "tone() === 'light'" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img [src]="'assets/icons/eyebrow/' + icon() + '.svg'" alt="" /><span><ng-content /></span>`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 36px;
      padding: 6px 16px 6px 14px;
      border: 1px solid var(--wb-blue);
      border-radius: 32px;
      background: var(--wb-blue-tint);
      color: var(--wb-blue);
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: clamp(0.875rem, 0.85vw, 1rem); /* 16px max, was 22px */
      white-space: nowrap;
    }
    /* On dark/blue sections */
    :host(.is-light) { border-color: rgba(255, 255, 255, 0.55); background: rgba(255, 255, 255, 0.14); color: #fff; }
    :host(.is-light) img { filter: brightness(0) invert(1); }
    img { height: 18px; width: auto; max-width: 24px; flex: none; object-fit: contain; }
  `,
})
export class PillLabelComponent {
  readonly icon = input<EyebrowIcon>('resources');
  readonly tone = input<'default' | 'light'>('default');
}
