import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SERVICES } from '../../content/site-content';

/** Figma "services" (805:60815): "From playbook to production". */
@Component({
  selector: 'wb-services',
  imports: [RevealDirective, PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="services" id="services" aria-labelledby="services-title">
      <div class="services__grid-lines" aria-hidden="true"></div>
      <!-- Cricket field (from Figma "fielding_positions"), turned so the pitch lies horizontally and
           centred on the right edge of the section, as in the Services reference design. -->
      <svg class="services__field" wbReveal="fade" viewBox="0 0 968 968" aria-hidden="true">
        <g transform="rotate(-90 484 484)">
          <g class="services__field-lines" fill="none" stroke-width="2.2">
            <circle cx="484" cy="484" r="468" pathLength="1" />
            <circle cx="484" cy="484" r="446.4" pathLength="1" />
            <circle cx="484" cy="484" r="251.4" pathLength="1" />
            <rect x="449.3" y="404.4" width="69.5" height="122.5" pathLength="1" />
            <path d="M416.6 424.8H551.5" pathLength="1" />
            <path d="M416.6 506.5H551.5" pathLength="1" />
          </g>
          <g class="services__field-fielders" fill="none" stroke-width="2.2">
            @for (f of fielders; track $index) {
              <circle [attr.cx]="f.x" [attr.cy]="f.y" r="11.4" />
            }
          </g>
        </g>
      </svg>

      <div class="wb-container services__inner">
        <wb-pill-label wbReveal icon="services" class="services__eyebrow">Services</wb-pill-label>
        <h2 wbReveal class="wb-h2" id="services-title">From playbook to <span class="wb-accent">production</span></h2>
        <p wbReveal [wbRevealDelay]="120" class="wb-lead services__lead">
          We bring the same deep-tech disciplines to every industry, shaped around how each one actually works.
        </p>

        <ul class="services__cards">
          @for (service of services; track service.title; let i = $index) {
            <li class="card" wbReveal [wbRevealDelay]="i * 110">
              <h3 class="card__title">
                <img [src]="service.icon" [width]="service.iconSize" [height]="service.iconSize" alt="" />
                {{ service.title }}
              </h3>
              <p class="card__text">{{ service.description }}</p>
              <a class="wb-link-arrow card__link" [href]="service.href">{{ service.linkLabel }} <span aria-hidden="true">→</span></a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .services {
      position: relative;
      overflow: hidden; /* the field is cut off by the section's edges */
      /* Tighter than other sections so the whole section fits in one screen height */
      padding: clamp(40px, 3.4vw, 64px) 0;
      background: transparent;
    }
    /* ~99px hairline grid in white, Figma "lines" group */
    .services__grid-lines {
      position: absolute;
      inset: 0 0 auto;
      height: 100%;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px);
      background-size: 98.77px 100px;
      background-position: calc(50% - 900.7px) 0, 0 0;
      mask-image: linear-gradient(to bottom, #000 75%, transparent);
    }
    /* A full half-field: centred on the right edge of the section, halfway down, and sized from the
       section's height so the whole semicircle shows (as in the Services reference design) */
    .services__field {
      position: absolute;
      top: 50%;
      right: 0;
      translate: 50% -50%;
      height: 88%;
      width: auto;
      aspect-ratio: 1;
      max-width: none;
      overflow: visible;
      pointer-events: none;
      z-index: 0;
    }
    .services__field { stroke: #fff; }
    /* Kept faint: a background texture, not a feature */
    .services__field-lines,
    .services__field-fielders { opacity: 0.38; }
    .services__field-lines > * {
      stroke-opacity: 0.95;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset 1.6s cubic-bezier(0.45, 0, 0.2, 1);
    }
    .services__field-lines > :nth-child(2) { transition-delay: 0.15s; }
    .services__field-lines > :nth-child(3) { transition-delay: 0.35s; }
    .services__field-lines > :nth-child(n + 4) { transition-delay: 0.6s; transition-duration: 0.8s; }
    .services__field.is-visible .services__field-lines > * { stroke-dashoffset: 0; }
    .services__field-fielders circle {
      opacity: 0;
      transform-box: fill-box;
      transform-origin: center;
      transform: scale(0.3);
      transition: opacity 0.4s ease, transform 0.5s var(--wb-ease-spring);
    }
    .services__field.is-visible .services__field-fielders circle { opacity: 0.95; transform: none; }
    .services__field-fielders circle:nth-child(1) { transition-delay: 0.9s; }
    .services__field-fielders circle:nth-child(2) { transition-delay: 0.98s; }
    .services__field-fielders circle:nth-child(3) { transition-delay: 1.06s; }
    .services__field-fielders circle:nth-child(4) { transition-delay: 1.14s; }
    .services__inner { position: relative; z-index: 1; }
    .services__eyebrow { margin-bottom: var(--wb-space-xs); }
    .services__lead { margin-top: var(--wb-space-xs); max-width: 951px; }

    .services__cards {
      margin-top: var(--wb-space-sm);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 582px));
      gap: var(--wb-gap-cards);
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px 22px;
      border: 1px solid var(--wb-glass-border);
      border-radius: 8px;
      background: var(--wb-glass-fill-strong);
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }
    .card { transition: transform 0.45s var(--wb-ease-out), background-color 0.3s ease, box-shadow 0.45s var(--wb-ease-out); }
    .card:hover { transform: translateY(-6px); background-color: rgba(255, 255, 255, 0.22); box-shadow: 0 18px 36px rgba(156, 101, 0, 0.16); }
    .card__title img { transition: transform 0.6s var(--wb-ease-spring); }
    .card:hover .card__title img { transform: rotate(-10deg) scale(1.12); }
    .card__link span { display: inline-block; transition: transform 0.3s var(--wb-ease-out); }
    .card:hover .card__link span { transform: translateX(6px); }
    .services__grid-lines { animation: wb-grid-drift 30s linear infinite; }
    .card__title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--wb-font-display);
      font-weight: 500;
      font-size: clamp(1.375rem, 1.46vw, 1.75rem); /* 28px max, was 42px */
      line-height: 1.3;
      color: var(--wb-ink);
    }
    .card__title img { flex: none; width: 1.05em; height: 1.05em; }
    .card__text {
      font-family: var(--wb-font-body);
      font-size: clamp(0.9375rem, 0.94vw, 1.125rem); /* 18px max, was 20px */
      line-height: 1.6;
      color: var(--wb-ink-600);
    }
    .card__link { margin-top: auto; padding-top: 4px; }

    @media (max-width: 1100px) {
      .services__cards { grid-template-columns: 1fr 1fr; }
      .services__field { opacity: 0.8; }
    }
    @media (max-width: 760px) {
      .services__cards { grid-template-columns: 1fr; }
      .card { min-height: 0; }
    }
  `,
})
export class ServicesComponent {
  protected readonly services = SERVICES;
  /** Fielder positions on the field (viewBox units, before the field is turned), from Figma. */
  protected readonly fielders = [
    { x: 247, y: 157 }, { x: 437, y: 312 }, { x: 482, y: 351 }, { x: 294, y: 404 },
  ];
}
