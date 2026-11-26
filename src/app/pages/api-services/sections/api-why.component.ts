import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { API_WHY } from '../../../content/api-services-content';

/**
 * "Why WhiteBlue?": four tall cards with a photo. Hovering (or focusing, or tapping) a card fades the photo
 * out, tints the card and reveals its one-line explanation, as in the design's hover states.
 */
@Component({
  selector: 'wb-api-why',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="why" aria-labelledby="why-title">
      <div class="wb-container">
        <div class="why__head">
          <h2 class="wb-h2" id="why-title">{{ c.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span></h2>
          <p class="wb-lead why__lead">{{ c.lead }}</p>
        </div>
        <ul class="cards">
          @for (card of c.cards; track card.title; let i = $index) {
            <li class="card" [class.is-on]="open() === i" [style.--tint]="card.tint" tabindex="0"
                (click)="toggle(i)" (keydown.enter)="toggle(i)" (keydown.space)="toggle(i); $event.preventDefault()"
                [attr.aria-expanded]="open() === i">
              <img class="card__img" [src]="card.image" width="372" height="436" alt="" loading="lazy" />
              <span class="card__num">0{{ i + 1 }}</span>
              <h3 class="card__title">{{ card.title }}</h3>
              <p class="card__text">{{ card.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    /* One screen tall: the cards take whatever height the heading leaves (capped on very tall screens) */
    .why { display: flex; flex-direction: column; justify-content: center; min-height: 100svh; padding: var(--wb-section-y) 0; background: #fff; font-family: var(--wb-font-body); }
    .why > .wb-container { display: flex; flex-direction: column; flex: 1 1 auto; max-height: 900px; }
    .why__head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px 64px; align-items: start; }
    .why__lead { max-width: 640px; }
    .cards {
      flex: 1 1 auto;
      min-height: 0;
      margin-top: var(--wb-space-lg);
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--wb-gap-cards);
    }
    .card {
      --tint: #eef3fd;
      position: relative;
      overflow: hidden;
      min-height: 340px;
      padding: clamp(22px, 2.4vw, 40px);
      border-radius: 24px;
      background: linear-gradient(180deg, #f6f8fe 0%, #edf1fb 100%);
      cursor: pointer;
      outline: none;
      transition: background-color 0.4s ease;
    }
    .card::before { content: ''; position: absolute; inset: 0; background: var(--tint); opacity: 0; transition: opacity 0.45s ease; }
    .card__img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 66%;
      object-fit: cover;
      object-position: center top;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 22%);
      mask-image: linear-gradient(to bottom, transparent 0%, #000 22%);
      transition: opacity 0.45s ease, transform 0.8s var(--wb-ease-out);
    }
    .card__num, .card__title, .card__text { position: relative; }
    .card__num { display: block; font-weight: 600; font-size: var(--wb-fs-body); color: var(--wb-blue); }
    .card__title { margin-top: var(--wb-space-sm); font-weight: 700; font-size: clamp(1.375rem, min(1.9vw, 3.8svh), 2.125rem); line-height: 1.3; color: #0f0e09; }
    .card__text {
      margin-top: var(--wb-space-sm);
      font-size: clamp(1rem, min(1.35vw, 2.8svh), 1.625rem);
      line-height: 1.6;
      color: #1e1e1e;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.4s ease, transform 0.45s var(--wb-ease-out);
    }
    /* Hover / keyboard focus / tap: photo fades, card tints, text appears */
    .card:hover::before, .card:focus-visible::before, .card.is-on::before { opacity: 1; }
    .card:hover .card__img, .card:focus-visible .card__img, .card.is-on .card__img { opacity: 0; transform: scale(1.04); }
    .card:hover .card__text, .card:focus-visible .card__text, .card.is-on .card__text { opacity: 1; transform: none; transition-delay: 0.08s; }
    .card:focus-visible { box-shadow: 0 0 0 3px var(--wb-blue); }

    @media (prefers-reduced-motion: reduce) {
      .card__img, .card__text, .card::before { transition: opacity 0.2s linear; transform: none !important; }
    }
    @media (max-width: 1000px) {
      .why { display: block; min-height: 0; }
      .why > .wb-container { display: block; max-height: none; }
      .why__head { grid-template-columns: 1fr; }
      .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .card { height: 420px; }
    }
    @media (max-width: 560px) {
      .cards { grid-template-columns: 1fr; }
      .card { height: 360px; }
    }
  `,
})
export class ApiWhyComponent {
  protected readonly c = API_WHY;
  /** Card opened by tap or keyboard (hover needs no state) */
  protected readonly open = signal<number | null>(null);
  protected toggle(i: number): void { this.open.update(v => (v === i ? null : i)); }
}
