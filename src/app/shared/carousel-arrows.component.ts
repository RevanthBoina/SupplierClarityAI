import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * The square prev/next controls that flank the testimonial and case-study carousels.
 * Previous is outlined grey; next is the yellow filled button, as drawn in Figma.
 * variant="chevron": just a bare ‹ › symbol on each side, no box.
 */
@Component({
  selector: 'wb-carousel-arrows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-chevron]': "variant() === 'chevron'" },
  template: `
    <button type="button" class="arrow arrow--prev" (click)="previous.emit()" [disabled]="!canGoBack()" [attr.aria-label]="'Previous ' + itemLabel()">
      @if (variant() === 'chevron') {
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 4 7 12l8 8" /></svg>
      } @else {
        <img src="assets/icons/arrow-left.svg" width="62" height="62" alt="" />
      }
    </button>
    <button type="button" class="arrow arrow--next" (click)="next.emit()" [disabled]="!canGoForward()" [attr.aria-label]="'Next ' + itemLabel()">
      @if (variant() === 'chevron') {
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
      } @else {
        <img src="assets/icons/arrow-left.svg" width="62" height="62" alt="" />
      }
    </button>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 50% 0 auto;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      z-index: 5;
    }
    .arrow {
      pointer-events: auto;
      width: 68px;
      height: 68px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      transition: transform 0.15s ease, background-color 0.2s ease, opacity 0.2s ease;
    }
    .arrow img { width: 62px; height: 62px; }
    .arrow--prev { border: 1px solid #8f8f8f; background: rgba(255, 255, 255, 0.85); }
    .arrow--prev img { opacity: 0.3; }
    .arrow--prev:not(:disabled):hover img { opacity: 0.7; }
    .arrow--next { background: var(--wb-yellow); }
    .arrow--next img { transform: scaleX(-1); }
    .arrow--next:not(:disabled):hover { background: #ffc23d; }
    .arrow:not(:disabled):active { transform: scale(0.96); }
    .arrow:disabled { cursor: default; }
    .arrow--next:disabled { opacity: 0.45; }
    @media (max-width: 720px) {
      .arrow { width: 48px; height: 48px; }
      .arrow img { width: 44px; height: 44px; }
    }

    /* Chevron variant: bare symbols, no box or fill */
    :host(.is-chevron) .arrow,
    :host(.is-chevron) .arrow--next:not(:disabled):hover {
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 50%;
      background: transparent;
    }
    :host(.is-chevron) svg {
      width: 36px;
      height: 36px;
      fill: none;
      stroke: var(--wb-ink-600);
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke 0.2s ease, transform 0.2s ease;
    }
    :host(.is-chevron) .arrow:not(:disabled):hover svg { stroke: var(--wb-blue); }
    :host(.is-chevron) .arrow--prev:not(:disabled):hover svg { transform: translateX(-3px); }
    :host(.is-chevron) .arrow--next:not(:disabled):hover svg { transform: translateX(3px); }
    :host(.is-chevron) .arrow:disabled { opacity: 0.3; }
  `,
})
export class CarouselArrowsComponent {
  readonly canGoBack = input(true);
  readonly canGoForward = input(true);
  readonly itemLabel = input('slide');
  readonly variant = input<'box' | 'chevron'>('box');
  readonly previous = output<void>();
  readonly next = output<void>();
}
