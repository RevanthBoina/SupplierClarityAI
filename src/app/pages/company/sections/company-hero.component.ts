import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from '../../../shared/button.component';
import { PillLabelComponent } from '../../../shared/pill-label.component';

/**
 * Company page hero: optional eyebrow, headline with a blue phrase, lead, buttons and a photo with floating chips.
 * Content projected into [slot=extra] sits under the lead (e.g. a stat counter).
 */
@Component({
  selector: 'wb-company-hero',
  imports: [ButtonComponent, PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hero">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div class="hero__copy">
          @if (eyebrow()) { <wb-pill-label [icon]="$any(eyebrowIcon())">{{ eyebrow() }}</wb-pill-label> }
          <h1 class="hero__title">{{ titleLead() }}<br /><span class="wb-accent">{{ titleAccent() }}</span></h1>
          <p class="wb-lead hero__lead">{{ lead() }}</p>
          <ng-content select="[slot=extra]" />
          @if (primary() || secondary()) {
            <div class="hero__actions">
              @if (primary(); as p) { <wb-button [href]="p.href">{{ p.label }}</wb-button> }
              @if (secondary(); as s) { <wb-button variant="outline" [href]="s.href">{{ s.label }}</wb-button> }
            </div>
          }
        </div>
        <div class="hero__media">
          <img class="hero__photo" [src]="image()" width="640" height="480" [alt]="imageAlt()" />
          @for (chip of chips(); track chip; let i = $index) {
            <span class="chip" [class]="'chip chip--' + i">{{ chip }}</span>
          }
        </div>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .hero {
      position: relative;
      overflow: hidden;
      padding: 32px 0 var(--wb-section-y);
      background:
        linear-gradient(180deg, #fff 8%, rgba(255, 255, 255, 0) 72%),
        linear-gradient(90deg, #c5d7ff 0%, #e4ecff 55%, #f3f6ff 100%);
    }
    .hero__nav-space { height: 74px; }
    .hero__inner { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 88px); align-items: center; margin-top: var(--wb-space-md); }
    .hero__copy { display: flex; flex-direction: column; align-items: flex-start; }
    .hero__title { margin-top: var(--wb-space-xs); font-family: var(--wb-font-body); font-weight: 700; font-size: min(clamp(2rem, 3.4vw, 4rem), 7svh); line-height: 1.18; letter-spacing: -0.01em; color: #0f0e09; }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 640px; }
    .hero__actions { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; gap: 14px; }
    .hero__media { position: relative; }
    .hero__photo {
      display: block;
      width: 100%;
      height: auto;
      max-height: calc(100svh - 106px - 2 * var(--wb-section-y));
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border: 8px solid #fff;
      border-radius: 28px;
      box-shadow: 0 24px 60px rgba(14, 154, 165, 0.16);
      animation: hero-in 0.9s var(--wb-ease-out) both;
    }
    @keyframes hero-in { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: none; } }
    .chip {
      position: absolute;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(28, 44, 110, 0.14);
      font-family: var(--wb-font-body);
      font-weight: 600;
      font-size: clamp(0.8125rem, 0.9vw, 1rem);
      color: #0f0e09;
      white-space: nowrap;
      animation: chip-float 5s ease-in-out infinite alternate;
    }
    .chip::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--wb-blue); }
    .chip--1::before { background: #ffc45c; }
    .chip--0 { right: -3%; top: 8%; }
    .chip--1 { left: -6%; top: 46%; animation-delay: -1.6s; }
    .chip--2 { right: 6%; bottom: -4%; animation-delay: -3.2s; }
    @keyframes chip-float { from { transform: translateY(-5px); } to { transform: translateY(5px); } }
    @media (prefers-reduced-motion: reduce) { .hero__photo, .chip { animation: none; } }
    @media (max-width: 1000px) {
      .hero__inner { grid-template-columns: 1fr; }
      .hero__photo { max-height: none; }
      .chip--1 { left: 2%; }
      .chip--0 { right: 2%; }
    }
  `,
})
export class CompanyHeroComponent {
  readonly eyebrow = input('');
  readonly eyebrowIcon = input('our-values');
  readonly titleLead = input.required<string>();
  readonly titleAccent = input.required<string>();
  readonly lead = input.required<string>();
  readonly image = input.required<string>();
  readonly imageAlt = input('');
  readonly chips = input<string[]>([]);
  readonly primary = input<{ label: string; href: string } | null>(null);
  readonly secondary = input<{ label: string; href: string } | null>(null);
}
