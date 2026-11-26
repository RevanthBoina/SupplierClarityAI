import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonComponent } from '../../../shared/button.component';
import { ProductHeroContent } from '../../../content/content-types';

/**
 * Product page hero: headline, lead and two buttons on the left; the product logo in an orbit on the right,
 * with four fixed chips at the corners.
 * [animated]="true": dots swing back and forth along the two rings and the glow and layers behind the logo
 * breathe, as in the Dobby animation. Off for visitors who prefer reduced motion.
 */
@Component({
  selector: 'wb-product-hero',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-animated]': 'animated()', '[class.is-bob]': '!!c.orbit?.bob', '[class.is-halo]': "c.orbit?.backdrop === 'halo'", '[class.is-plain]': "c.orbit?.backdrop === 'plain'", '[style.--bob-logo]': '(c.orbit?.bob?.logo ?? 0) + "cqw"', '[style.--bob-chips]': '(c.orbit?.bob?.chips ?? 0) + "cqw"', '[style.--bob-dur]': 'bobDur() + "s"', '[style.--accent]': 'c.accent', '[style.--logo-size]': '(c.orbit?.logoSize ?? 32) + "%"' },
  template: `
    <header class="hero">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div class="hero__copy">
          <h1 class="hero__title">
            @for (seg of c.title; track $index) {
              @if (seg.accent) {<span class="wb-accent">{{ seg.text }}</span>} @else {{{ seg.text }}}
              @if (seg.breakAfter) {<br />}
            }
          </h1>
          <p class="wb-lead hero__lead">{{ c.lead }}</p>
          <div class="hero__actions">
            <wb-button [href]="c.primary.href">{{ c.primary.label }}</wb-button>
            <wb-button variant="outline" [href]="c.secondary.href">{{ c.secondary.label }}</wb-button>
          </div>
        </div>

        <div class="orbit">
          <svg class="orbit__rings" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <radialGradient id="orbit-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0.35" stop-color="var(--accent)" stop-opacity="0.2" />
                <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
              </radialGradient>
            </defs>
            <circle class="orbit__glow" cx="200" cy="200" r="150" fill="url(#orbit-glow)" />
            <circle class="orbit__inner" cx="200" cy="200" [attr.r]="innerR()" />
            <circle class="orbit__outer" cx="200" cy="200" r="182" />
            <!-- Each dot sits on its ring at a set angle and swings back and forth along it (oscillates, never a full turn) -->
            @for (d of dots(); track $index) {
              <g class="orbit__swing" [style.--from]="d.from + 'deg'" [style.--to]="d.to + 'deg'"
                 [style.animation-duration.s]="d.dur" [style.animation-delay.s]="d.delay">
                <circle cx="200" [attr.cy]="200 - (d.ring === 'inner' ? innerR() : 182)" [attr.r]="d.solid ? 6 : 4.5" [class]="d.solid ? 'dot dot--fill' : 'dot dot--ring'" />
              </g>
            }
          </svg>
          <!-- Soft fading layers behind the logo, all centred on the rings -->
          <span class="orbit__layers" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="orbit__logo"><img [src]="c.logo" width="360" height="360" [alt]="c.logoAlt" /></span>
          @for (chip of c.chips; track chip.label; let i = $index) {
            <span class="chip" [class]="'chip chip--' + i + ' chip--' + chip.tone">{{ chip.label }}</span>
          }
        </div>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; --accent: #b33fd6; }
    .hero {
      padding: 32px 0 var(--wb-section-y);
      background: linear-gradient(180deg, #fff 0%, #f7f9ff 100%);
      overflow: hidden;
    }
    .hero__nav-space { height: 74px; }
    .hero__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 4vw, 72px); align-items: center; margin-top: var(--wb-space-md); }
    .hero__title { font-family: var(--wb-font-body); font-weight: 700; font-size: min(clamp(2rem, 3.4vw, 4rem), 7svh); line-height: 1.2; letter-spacing: -0.01em; color: #0f0e09; }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 640px; }
    .hero__actions { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; gap: 14px; }

    /* Orbit: square, sized from the screen height so the hero stays one screen */
    .orbit { container-type: inline-size; position: relative; justify-self: center; width: min(100%, 560px, calc(100svh - 106px - 2 * var(--wb-section-y))); aspect-ratio: 1; }
    .orbit__rings { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .orbit__inner { fill: none; stroke: color-mix(in srgb, var(--accent) 22%, #dfe5f7); stroke-width: 1.4; }
    .orbit__outer { fill: none; stroke: #c9d3f0; stroke-width: 1.4; stroke-dasharray: 5 7; }
    .dot--fill { fill: var(--accent); }
    .dot--ring { fill: #fff; stroke: var(--wb-blue); stroke-width: 1.6; }
    .orbit__swing { transform-origin: 200px 200px; transform-box: view-box; transform: rotate(var(--from)); }
    .orbit__layers { position: absolute; inset: 0; pointer-events: none; }
    .orbit__layers span {
      position: absolute;
      left: 50%;
      top: 50%;
      aspect-ratio: 1;
      translate: -50% -50%;
      border-radius: 50%;
      background: radial-gradient(circle, #fff 55%, color-mix(in srgb, var(--accent) 10%, #fff) 100%);
      border: 1px solid color-mix(in srgb, var(--accent) 14%, transparent);
    }
    .orbit__layers span:nth-child(1) { width: calc(var(--logo-size) + 18%); opacity: 0.55; }
    .orbit__layers span:nth-child(2) { width: calc(var(--logo-size) + 12%); opacity: 0.75; }
    .orbit__layers span:nth-child(3) { width: calc(var(--logo-size) + 6%); opacity: 1; }
    .orbit__logo {
      position: absolute;
      left: 50%;
      top: 50%;
      width: var(--logo-size);
      aspect-ratio: 1;
      translate: -50% -50%;
      border-radius: 50%;
      box-shadow: 0 18px 50px color-mix(in srgb, var(--accent) 22%, transparent);
    }
    .orbit__logo img { display: block; width: 100%; height: 100%; }

    .chip {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 10px 26px rgba(28, 44, 110, 0.12);
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: clamp(0.75rem, 0.85vw, 0.9375rem);
      color: #0f0e09;
      white-space: nowrap;
      translate: -50% -50%;
    }
    .chip::before { content: ''; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--wb-blue); }
    .chip--accent::before { background: var(--accent); }
    .chip--0 { left: 20%; top: 9%; }
    .chip--1 { left: 88%; top: 4%; }
    .chip--2 { left: 15%; top: 82%; }
    .chip--3 { left: 90%; top: 88%; }

    /* Animation (Dobby): slow opposite rotations and a pulsing glow */
    :host(.is-animated) .orbit__swing { animation: swing 3.5s ease-in-out infinite alternate; }
    /* QuickQode: logo and its layers bob down and up while the chips drift the opposite way, in step with the dots */
    :host(.is-animated.is-bob) .orbit__logo, :host(.is-animated.is-bob) .orbit__layers { animation: bob var(--bob-dur) ease-in-out infinite alternate; }
    :host(.is-animated.is-bob) .chip { animation: drift var(--bob-dur) ease-in-out infinite alternate; }
    /* QuickQode look: one white halo with a soft blue shadow instead of stacked layers, chips over the dots' rest points */
    :host(.is-halo) .orbit__layers span:nth-child(1), :host(.is-halo) .orbit__layers span:nth-child(2), :host(.is-plain) .orbit__layers { display: none; }
    :host(.is-halo) .orbit__layers span:nth-child(3) { width: calc(var(--logo-size) + 7%); background: #fff; border: 0; box-shadow: 0 14px 40px rgba(44, 88, 241, 0.18), 0 0 0 1px rgba(44, 88, 241, 0.04); }
    :host(.is-plain) .orbit__logo { box-shadow: 0 16px 40px rgba(44, 88, 241, 0.16); }
    :host(.is-bob) .chip { z-index: 2; }
    :host(.is-bob) .chip--0 { left: 22%; top: 13%; }
    :host(.is-bob) .chip--2 { left: 17%; top: 79%; }
    :host(.is-bob) .chip--3 { left: 83%; top: 87%; }
    @keyframes bob { from { transform: translateY(calc(var(--bob-logo) * -1)); } to { transform: translateY(var(--bob-logo)); } }
    @keyframes drift { from { transform: translateY(calc(var(--bob-chips) * -1)); } to { transform: translateY(var(--bob-chips)); } }
    :host(.is-animated) .orbit__glow { transform-origin: 200px 200px; transform-box: view-box; animation: pulse 3.2s ease-in-out infinite; }
    :host(.is-animated) .orbit__layers span:nth-child(1) { animation: breathe 3.2s ease-in-out infinite; }
    :host(.is-animated) .orbit__layers span:nth-child(2) { animation: breathe 3.2s ease-in-out 0.4s infinite; }
    @keyframes swing { from { transform: rotate(var(--from)); } to { transform: rotate(var(--to)); } }
    @keyframes breathe { 0%, 100% { scale: 1; } 50% { scale: 1.06; } }
    @keyframes pulse { 0%, 100% { transform: scale(0.94); opacity: 0.75; } 50% { transform: scale(1.06); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      :host(.is-animated) .orbit__swing, :host(.is-animated) .orbit__glow, :host(.is-animated) .orbit__layers span,
      :host(.is-animated) .orbit__logo, :host(.is-animated) .orbit__layers, :host(.is-animated) .chip { animation: none; }
    }

    @media (max-width: 1000px) {
      .hero__inner { grid-template-columns: 1fr; }
      .orbit { width: min(86vw, 460px); margin-top: 24px; }
    }
    @media (max-width: 560px) {
      .chip { padding: 6px 10px; font-size: 0.6875rem; }
      .chip--0 { left: 22%; } .chip--1 { left: 80%; } .chip--2 { left: 20%; } .chip--3 { left: 80%; }
    }
  `,
})
export class ProductHeroComponent {
  readonly content = input.required<ProductHeroContent>();
  readonly animated = input(false);
  protected get c(): ProductHeroContent { return this.content(); }
  /** Dobby defaults: each dot swings around its resting angle at its own pace. */
  private readonly dobbyDots = [
    { ring: 'outer', from: -82, to: -54, solid: true, dur: 3.6, delay: 0 },
    { ring: 'inner', from: 4, to: 40, solid: true, dur: 3.2, delay: -1.1 },
    { ring: 'outer', from: 96, to: 120, solid: false, dur: 4.2, delay: -2 },
    { ring: 'outer', from: 186, to: 206, solid: false, dur: 3.8, delay: -0.6 },
    { ring: 'inner', from: 189, to: 221, solid: false, dur: 3.4, delay: -1.7 },
  ] as const;
  /** Float timing follows the first dot's swing */
  protected readonly bobDur = computed(() => this.content().orbit?.dots?.[0]?.dur ?? 3.5);
  protected readonly innerR = computed(() => this.content().orbit?.innerR ?? 120);
  protected readonly dots = computed(() => (this.content().orbit?.dots ?? this.dobbyDots)
    .map(d => ({ dur: 3.5, delay: 0, ...d })));}
