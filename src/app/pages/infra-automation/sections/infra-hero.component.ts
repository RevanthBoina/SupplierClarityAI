import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INFRA_HERO } from '../../../content/infra-automation-content';

/** Infra automation hero: headline, lead and three stats left, photo right. */
@Component({
  selector: 'wb-infra-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hero">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div class="hero__copy">
          <h1 class="hero__title">{{ c.titleLead }} <span class="wb-accent">{{ c.titleAccent }}</span></h1>
          <p class="wb-lead hero__lead">{{ c.lead }}</p>
          <dl class="stats">
            @for (s of c.stats; track s.value) {
              <div class="stat" [class]="'stat stat--' + s.tone">
                <dt class="stat__label">{{ s.label }}</dt>
                <dd class="stat__value">{{ s.value }}</dd>
              </div>
            }
          </dl>
        </div>
        <img class="hero__photo" [src]="c.image" width="396" height="490" [alt]="c.imageAlt" />
      </div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .hero {
      position: relative;
      overflow: hidden;
      padding: 32px 0 var(--wb-fit-y);
      background:
        linear-gradient(180deg, #fff 10%, rgba(255, 255, 255, 0) 75%),
        linear-gradient(90deg, #c9d8ff 0%, #e4ecff 55%, #f3f6ff 100%);
    }
    .hero__nav-space { height: 74px; }
    .hero__inner { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 64px; margin-top: var(--wb-fit-gap); }
    .hero__title {
      max-width: 820px;
      font-family: var(--wb-font-body);
      font-weight: 700;
      font-size: var(--wb-fit-h2);
      line-height: var(--wb-lh-h2);
      letter-spacing: -0.01em;
      color: #0f0e09;
    }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 760px; }
    .stats { margin: min(var(--wb-space-md), 4.5svh) 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 220px)); gap: 0; }
    .stat { display: flex; flex-direction: column-reverse; justify-content: flex-end; gap: 10px; padding-right: 24px; } /* numbers top-aligned */
    .stat + .stat { padding-left: 24px; border-left: 1px solid rgba(43, 58, 103, 0.14); }
    /* The number sits on a short coloured bar (blue, grey, yellow), as in the design */
    .stat__value {
      position: relative;
      width: fit-content;
      margin: 0;
      font-family: var(--wb-font-body);
      font-weight: 700;
      font-size: min(var(--wb-fs-h3), 6svh);
      line-height: 1.1;
      color: #0f0e09;
      z-index: 0;
    }
    .stat__value::after { content: ''; position: absolute; z-index: -1; left: 0.5em; right: -0.9em; bottom: 0.05em; height: 0.36em; background: var(--bar); }
    .stat--blue { --bar: #bfccff; }
    .stat--grey { --bar: #dbdbe5; }
    .stat--yellow { --bar: #ffdb59; }
    .stat__label { font-family: var(--wb-font-body); font-size: clamp(0.875rem, 0.9vw, 1rem); line-height: 1.45; color: var(--wb-ink-600); }
    /* Photo is as tall as the screen allows below the bar (one-screen rule) */
    .hero__photo { height: clamp(300px, calc(100svh - 106px - var(--wb-fit-y) - var(--wb-fit-gap)), 570px); width: auto; max-width: 30vw; aspect-ratio: 396 / 490; object-fit: cover; border-radius: 28px; }

    @media (max-width: 1000px) {
      .hero__inner { grid-template-columns: 1fr; }
      .hero__photo { justify-self: center; height: min(56svh, 480px); max-width: 100%; }
    }
    @media (max-width: 600px) {
      .stats { grid-template-columns: 1fr; gap: 20px; }
      .stat, .stat + .stat { padding: 0; border: 0; }
    }
  `,
})
export class InfraHeroComponent {
  protected readonly c = INFRA_HERO;
}
