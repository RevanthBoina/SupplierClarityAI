import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { CompanyHeroComponent } from './sections/company-hero.component';
import { SOCIAL } from '../../content/about-content';

/** /company/social-initiative: WhiteBlue and Sai Sankalp Nursery and Primary School. The hero counter counts up once. */
@Component({
  selector: 'wb-social-initiative-page',
  imports: [SectionThemeDirective, PillLabelComponent, RevealDirective, CtaBandComponent, CompanyHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' },
  template: `
    <wb-company-hero wbSectionTheme="#ffffff" [eyebrow]="c.hero.eyebrow" eyebrowIcon="our-values" [titleLead]="c.hero.titleLead" [titleAccent]="c.hero.titleAccent"
                     [lead]="c.hero.lead" [image]="c.hero.image" [imageAlt]="c.hero.imageAlt">
      <div slot="extra" class="count" #counter>
        <span class="count__value">{{ count() }}</span>
        <span class="count__label">{{ c.hero.stat.label }}</span>
      </div>
    </wb-company-hero>
    <main>
      <section class="split" wbSectionTheme="#ffffff" aria-labelledby="community-title">
        <div class="wb-container split__inner">
          <figure class="split__art" wbReveal="left">
            <img [src]="c.community.image" width="1000" height="666" [alt]="c.community.imageAlt" loading="lazy" />
            <figcaption class="split__pin"><span aria-hidden="true">●</span> {{ c.community.place }}</figcaption>
          </figure>
          <div>
            <wb-pill-label icon="industries">{{ c.community.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 split__title" id="community-title">{{ c.community.titleLead }}<br /><span class="wb-accent">{{ c.community.titleAccent }}</span></h2>
            <p class="split__text">{{ c.community.text }}</p>
          </div>
        </div>
      </section>

      <section class="contrib" wbSectionTheme="#ffdb57" aria-labelledby="contrib-title">
        <div class="contrib__grid" aria-hidden="true"></div>
        <div class="wb-container contrib__inner">
          <wb-pill-label icon="how-we-help">{{ c.contribute.eyebrow }}</wb-pill-label>
          <h2 class="wb-h2 contrib__title" id="contrib-title">{{ c.contribute.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.contribute.titleAccent }}</span></h2>
          <div class="contrib__cards">
            @for (k of c.contribute.items; track k.title; let i = $index) {
              <article class="kcard" [class]="'kcard kcard--' + k.tone" wbReveal="up" [wbRevealDelay]="i * 120">
                <span class="kcard__icon" aria-hidden="true">
                  @if (k.icon === 'book') { <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z" /></svg> }
                  @else { <svg viewBox="0 0 24 24"><path d="M7 11V7a2 2 0 1 1 4 0v4M11 10V5a2 2 0 1 1 4 0v5M15 10V7a2 2 0 1 1 4 0v6a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L3 13a2 2 0 0 1 3.4-2.1L7 12" /></svg> }
                </span>
                <p class="kcard__stat"><strong>{{ k.stat }}</strong> {{ k.statLabel }}</p>
                <h3 class="kcard__title">{{ k.title }}</h3>
                <p class="kcard__text">{{ k.text }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="split split--flip" wbSectionTheme="#ffffff" aria-labelledby="journey-title">
        <div class="wb-container split__inner">
          <div>
            <wb-pill-label icon="careers">{{ c.journey.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 split__title" id="journey-title">{{ c.journey.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.journey.titleAccent }}</span></h2>
            <p class="split__text">{{ c.journey.text }}</p>
            <ul class="words">
              @for (w of c.journey.words; track w; let i = $index) { <li [style.animation-delay.s]="i * 0.9">{{ w }}</li> }
            </ul>
          </div>
          <figure class="split__art" wbReveal="right">
            <img [src]="c.journey.image" width="1000" height="666" [alt]="c.journey.imageAlt" loading="lazy" />
          </figure>
        </div>
      </section>

      <wb-cta-band wbSectionTheme="#ffffff" [content]="c.cta" />
    </main>
  `,
  styles: `
    :host { display: block; font-family: var(--wb-font-body); }
    .count { margin-top: var(--wb-space-md); display: flex; align-items: center; gap: 18px; padding: 14px 22px 14px 14px; border-radius: 20px; background: #fff; box-shadow: 0 14px 34px rgba(44, 88, 241, 0.12); }
    .count__value { min-width: 2.2ch; padding: 6px 14px; border-radius: 14px; background: #ffdb57; font-weight: 700; font-size: min(var(--wb-fs-h3), 6svh); line-height: 1.1; text-align: center; color: #0f0e09; font-variant-numeric: tabular-nums; }
    .count__label { max-width: 220px; font-size: var(--wb-fs-body); line-height: 1.35; color: #2a2a2a; }

    .split { padding: var(--wb-section-y) 0; background: #fff; }
    .split__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 96px); align-items: center; }
    .split__art { position: relative; margin: 0; }
    .split__art img { display: block; width: 100%; height: min(560px, calc(100svh - 2 * var(--wb-section-y))); object-fit: cover; border-radius: 28px; box-shadow: 0 24px 60px rgba(44, 88, 241, 0.14); }
    .split__pin { position: absolute; left: 18px; bottom: 18px; padding: 10px 16px; border-radius: 12px; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(8px); font-weight: 600; font-size: 0.9375rem; color: #0f0e09; }
    .split__pin span { color: var(--wb-blue); margin-right: 4px; }
    .split__title { margin: var(--wb-space-xs) 0 var(--wb-space-sm); }
    .split__text { max-width: 620px; font-size: var(--wb-fs-lead); line-height: 1.6; color: var(--wb-ink-600); }
    .words { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; gap: 12px; }
    .words li { padding: 10px 20px; border-radius: 999px; background: var(--wb-blue-tint); font-weight: 700; color: var(--wb-blue); animation: glow 2.7s ease-in-out infinite; }
    @keyframes glow { 0%, 66%, 100% { background: var(--wb-blue-tint); box-shadow: 0 0 0 0 rgba(52, 100, 230, 0); transform: scale(1); } 33% { background: #fff; box-shadow: 0 0 0 2px var(--wb-blue), 0 10px 24px rgba(52, 100, 230, 0.22); transform: scale(1.06); } }

    .contrib { position: relative; overflow: hidden; padding: var(--wb-section-y) 0; background: #ffdb57; }
    .contrib__grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px); background-size: 96px 96px; }
    .contrib__inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .contrib__title { margin-top: var(--wb-space-xs); }
    .contrib__cards { width: 100%; margin-top: var(--wb-space-lg); display: grid; grid-template-columns: 1fr 1fr; gap: var(--wb-gap-cards); text-align: left; }
    .kcard { padding: clamp(24px, 2.6vw, 44px); border-radius: 26px; transition: transform 0.4s var(--wb-ease-out), box-shadow 0.4s var(--wb-ease-out); }
    .kcard:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(30, 30, 60, 0.18); }
    .kcard--blue { background: var(--wb-blue); color: #fff; }
    .kcard--yellow { background: #fff; color: #0f0e09; }
    .kcard__icon { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 255, 255, 0.18); }
    .kcard--yellow .kcard__icon { background: #fff3c4; }
    .kcard__icon svg { width: 26px; height: 26px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
    .kcard__stat { margin-top: var(--wb-space-sm); font-size: var(--wb-fs-body); opacity: 0.85; }
    .kcard__stat strong { font-size: var(--wb-fs-h3); margin-right: 6px; opacity: 1; }
    .kcard--blue .kcard__stat strong { color: #ffd84d; }
    .kcard--yellow .kcard__stat strong { color: var(--wb-blue); }
    .kcard__title { margin-top: 10px; font-weight: 700; font-size: var(--wb-fs-card-title); }
    .kcard__text { margin-top: 10px; font-size: var(--wb-fs-body); line-height: 1.6; opacity: 0.9; }

    @media (prefers-reduced-motion: reduce) { .words li { animation: none; } .kcard { transition: none; } }
    @media (max-width: 1000px) {
      .split__inner, .contrib__cards { grid-template-columns: 1fr; }
      .split--flip .split__art { order: -1; }
      .split__art img { height: 360px; }
    }
  `,
})
export class SocialInitiativePageComponent {
  protected readonly c = SOCIAL;
  protected readonly count = signal(0);
  private readonly counter = viewChild<ElementRef<HTMLElement>>('counter');

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: SOCIAL.hero.lead });
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const target = SOCIAL.hero.stat.value;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { this.count.set(target); return; }
      let raf = 0;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        this.count.set(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      destroyRef.onDestroy(() => cancelAnimationFrame(raf));
    });
  }
}
