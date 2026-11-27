import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * WhiteBlue pill button (Figma component "primary-btn", 544:40283).
 * primary: blue fill with amber hairline. light: white fill, blue text.
 * Renders an <a> because every CTA in the design navigates.
 */
@Component({
  selector: 'wb-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-beam' },
  template: `<a class="btn" [class.btn--light]="variant() === 'light'" [class.btn--outline]="variant() === 'outline'" [class.btn--yellow]="variant() === 'yellow'" [class.btn--outline-light]="variant() === 'outline-light'" [attr.href]="href()" [attr.download]="download()"><ng-content /></a>`,
  styles: `
    :host { display: inline-flex; border-radius: var(--wb-radius-pill); }
    /* Keep the outline beam (drawn on the host) moving with the button's hover lift */
    :host::after { transition: transform 0.2s ease; }
    :host(:hover)::after { transform: translateY(-2px); }
    :host(:active)::after { transform: translateY(1px); }
    :host([variant='outline-light']) { --wb-beam-tail: #fff; --wb-beam-core: #fff; }
    :host([variant='light']), :host([variant='outline']) { --wb-beam-tail: var(--wb-blue); --wb-beam-core: #a9dfe4; }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--wb-btn-pad, 12px 24px);
      border-radius: var(--wb-radius-pill);
      border: 1px solid var(--wb-amber);
      background: var(--wb-blue);
      color: var(--wb-white);
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: var(--wb-fs-button);
      line-height: 1.35;
      white-space: nowrap;
      transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, padding 0.35s ease, font-size 0.35s ease;
    }
    .btn { position: relative; overflow: hidden; isolation: isolate; }
    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.35) 50%, transparent 70%);
      transform: translateX(-120%);
      transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .btn:hover::before { transform: translateX(120%); }
    .btn:hover { background: var(--wb-blue-deep); box-shadow: 0 8px 22px rgba(14, 154, 165, 0.32); transform: translateY(-2px); }
    .btn:active { transform: translateY(1px); }
    .btn--light { background: var(--wb-white); color: var(--wb-blue); border-color: var(--wb-white); }
    .btn--light:hover { background: var(--wb-blue-tint); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); }
    /* outline: white fill, blue text and blue border */
    .btn--outline { background: var(--wb-white); color: var(--wb-blue); border-color: var(--wb-blue); }
    .btn--outline:hover { background: var(--wb-blue-tint); box-shadow: 0 6px 18px rgba(14, 154, 165, 0.12); }
    /* For blue panels: yellow fill with dark text, and a white outline */
    .btn--yellow { background: var(--wb-yellow); color: #1e1e1e; border-color: var(--wb-yellow); }
    .btn--yellow:hover { background: #ffc23d; box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18); }
    .btn--outline-light { background: transparent; color: #fff; border-color: rgba(255, 255, 255, 0.9); }
    .btn--outline-light:hover { background: rgba(255, 255, 255, 0.14); box-shadow: none; }
  `,
})
export class ButtonComponent {
  readonly href = input<string>('#');
  readonly variant = input<'primary' | 'light' | 'outline' | 'yellow' | 'outline-light'>('primary');
  readonly download = input<string | null>(null);
}
