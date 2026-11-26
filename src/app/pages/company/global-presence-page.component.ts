import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { GLOBAL, PURPOSE } from '../../content/about-content';

/**
 * /company/global-presence: India, UAE and USA on one page.
 * Hero: three region cards that jump to each region's section. USA pillars reveal their points on hover/focus.
 */
@Component({
  selector: 'wb-global-presence-page',
  imports: [SectionThemeDirective, PillLabelComponent, RevealDirective, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' },
  template: `
    <header class="hero" wbSectionTheme="#ffffff">
      <div class="hero__nav-space" aria-hidden="true"></div>
      <div class="wb-container hero__inner">
        <div class="hero__copy">
          <wb-pill-label icon="industries">{{ c.hero.eyebrow }}</wb-pill-label>
          <h1 class="hero__title">{{ c.hero.titleLead }}<br /><span class="wb-accent">{{ c.hero.titleAccent }}</span></h1>
          <p class="wb-lead hero__lead">{{ c.hero.lead }}</p>
          <dl class="hero__stats">
            @for (s of c.hero.stats; track s.label) { <div><dt>{{ s.label }}</dt><dd>{{ s.value }}</dd></div> }
          </dl>
        </div>
        <div class="regions">
          @for (r of c.regions; track r.id; let i = $index) {
            <a class="region" [href]="'/company/global-presence#' + r.id" [style.animation-delay.ms]="i * 120">
              <img class="region__img" [src]="r.image" width="600" height="400" [alt]="r.imageAlt" />
              <span class="region__body">
                <span class="region__flag" aria-hidden="true">{{ r.flag }}</span>
                <span class="region__name">{{ r.name }}</span>
                <span class="region__cities">{{ r.cities }}</span>
              </span>
              <span class="region__go" aria-hidden="true">→</span>
            </a>
          }
        </div>
      </div>
    </header>

    <main>
      <!-- India -->
      <section class="rsec" id="india" wbSectionTheme="#ffffff" aria-labelledby="india-title">
        <div class="wb-container rsec__split">
          <figure class="rsec__art" wbReveal="left"><img [src]="c.regions[0].image" width="1080" height="720" [alt]="c.regions[0].imageAlt" loading="lazy" /></figure>
          <div>
            <p class="rsec__kicker"><span aria-hidden="true">{{ c.regions[0].flag }}</span> {{ c.regions[0].name }} · {{ c.regions[0].tagline }}</p>
            <h2 class="wb-h2 rsec__title" id="india-title">{{ c.india.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.india.titleAccent }}</span></h2>
            <p class="rsec__text">{{ c.india.text }}</p>
            <ul class="ticks">@for (p of c.india.points; track p) { <li>{{ p }}</li> }</ul>
          </div>
        </div>
      </section>

      <!-- UAE intro -->
      <section class="rsec rsec--tint" id="uae" wbSectionTheme="#f4f7ff" aria-labelledby="uae-title">
        <div class="wb-container rsec__split rsec__split--flip">
          <div>
            <p class="rsec__kicker"><span aria-hidden="true">{{ c.regions[1].flag }}</span> {{ c.regions[1].name }} · {{ c.regions[1].cities }}</p>
            <h2 class="wb-h2 rsec__title" id="uae-title">{{ c.uae.titleLead }}<br /><span class="wb-accent">{{ c.uae.titleAccent }}</span></h2>
            @for (p of c.uae.intro; track $index) { <p class="rsec__text">{{ p }}</p> }
          </div>
          <figure class="rsec__art" wbReveal="right"><img [src]="c.regions[1].image" width="612" height="408" [alt]="c.regions[1].imageAlt" loading="lazy" /></figure>
        </div>
      </section>

      <!-- UAE footprint + solutions -->
      <section class="foot" wbSectionTheme="#ffffff" aria-labelledby="foot-title">
        <div class="wb-container">
          <h2 class="foot__title" id="foot-title">{{ c.uae.footprintTitle }}</h2>
          <ol class="foot__cards">
            @for (f of c.uae.footprint; track f.title; let i = $index) {
              <li class="fcard" wbReveal="up" [wbRevealDelay]="i * 80">
                <span class="fcard__n">0{{ i + 1 }}</span>
                <h3 class="fcard__title">{{ f.title }}</h3>
                <p class="fcard__text">{{ f.text }}</p>
              </li>
            }
          </ol>
          <div class="sol">
            <div>
              <h3 class="sol__title">{{ c.uae.solutionsTitle }}</h3>
              <ul class="ticks">@for (s of c.uae.solutions; track s) { <li>{{ s }}</li> }</ul>
            </div>
            <div class="gallery">
              @for (g of c.uae.gallery; track g.image; let i = $index) {
                <img class="gallery__img" [src]="g.image" width="600" height="900" [alt]="g.alt" loading="lazy" [style.--i]="i" />
              }
            </div>
          </div>
        </div>
      </section>

      <!-- UAE advisors -->
      <section class="advs" wbSectionTheme="#f4f7ff" aria-labelledby="advs-title">
        <div class="wb-container">
          <h2 class="foot__title" id="advs-title">{{ c.uae.advisorsTitle }}</h2>
          <ul class="advs__list">
            @for (a of advisors; track a.name) {
              <li class="adv" wbReveal="up">
                <img class="adv__photo" [src]="a.image" width="388" height="388" [alt]="a.name" loading="lazy" />
                <div><h3 class="adv__name">{{ a.name }}</h3><p class="adv__role">{{ a.role }}</p><p class="adv__text">{{ a.bio[0] }}</p></div>
              </li>
            }
          </ul>
          <p class="advs__closing">{{ c.uae.closing }}</p>
        </div>
      </section>

      <!-- USA -->
      <section class="usa" id="usa" wbSectionTheme="#ffffff" aria-labelledby="usa-title">
        <div class="usa__banner" [style.background-image]="'url(' + c.regions[2].image + ')'">
          <div class="wb-container usa__banner-inner">
            <p class="rsec__kicker rsec__kicker--light"><span aria-hidden="true">{{ c.regions[2].flag }}</span> {{ c.regions[2].name }} · {{ c.regions[2].cities }}</p>
            <h2 class="wb-h2 usa__title" id="usa-title">{{ c.usa.titleLead }}<br /><span>{{ c.usa.titleAccent }}</span></h2>
          </div>
        </div>
        <div class="wb-container">
          <p class="usa__intro">{{ c.usa.intro }}</p>
        </div>
      </section>
      <section class="usa-p" wbSectionTheme="#ffffff" aria-label="What we bring to the USA">
        <div class="wb-container">
          <ul class="pillars">
            @for (p of c.usa.pillars; track p.title; let i = $index) {
              <li class="pillar" tabindex="0" wbReveal="up" [wbRevealDelay]="i * 90">
                <img class="pillar__img" [src]="p.image" width="520" height="740" alt="" loading="lazy" />
                <div class="pillar__body">
                  <h3 class="pillar__title">{{ p.title }}</h3>
                  <ul class="pillar__points">@for (x of p.points; track x) { <li>{{ x }}</li> }</ul>
                </div>
              </li>
            }
          </ul>
        </div>
      </section>

      <wb-cta-band wbSectionTheme="#ffffff" [content]="c.cta" />
    </main>
  `,
  styles: `
    :host { display: block; font-family: var(--wb-font-body); }

    .hero { position: relative; overflow: hidden; padding: 32px 0 var(--wb-section-y); background: linear-gradient(180deg, #fff 8%, rgba(255, 255, 255, 0) 72%), linear-gradient(90deg, #c5d7ff 0%, #e4ecff 55%, #f3f6ff 100%); }
    .hero__nav-space { height: 74px; }
    .hero__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(32px, 5vw, 80px); align-items: center; margin-top: var(--wb-space-md); }
    .hero__copy { display: flex; flex-direction: column; align-items: flex-start; }
    .hero__title { margin-top: var(--wb-space-xs); font-weight: 700; font-size: min(clamp(2rem, 3.4vw, 4rem), 7svh); line-height: 1.18; color: #0f0e09; }
    .hero__lead { margin-top: var(--wb-space-sm); max-width: 600px; }
    .hero__stats { margin: var(--wb-space-md) 0 0; display: flex; gap: clamp(24px, 3vw, 56px); }
    .hero__stats div { display: flex; flex-direction: column-reverse; }
    .hero__stats dt { font-size: 0.9375rem; color: var(--wb-ink-600); }
    .hero__stats dd { margin: 0; font-weight: 700; font-size: min(var(--wb-fs-h3), 6svh); color: var(--wb-blue); }

    .regions { display: flex; flex-direction: column; gap: 14px; }
    .region {
      position: relative; display: grid; grid-template-columns: clamp(110px, 12vw, 180px) 1fr auto; align-items: center; gap: 18px;
      padding: 10px 22px 10px 10px; border-radius: 22px; background: #fff; box-shadow: 0 12px 34px rgba(28, 44, 110, 0.1);
      animation: region-in 0.7s var(--wb-ease-out) both;
      transition: transform 0.35s var(--wb-ease-out), box-shadow 0.35s var(--wb-ease-out);
    }
    @keyframes region-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    .region:hover, .region:focus-visible { transform: translateX(-6px); box-shadow: 0 18px 44px rgba(44, 88, 241, 0.18); }
    .region__img { width: 100%; height: clamp(72px, 13svh, 120px); object-fit: cover; border-radius: 14px; }
    .region__body { display: flex; flex-direction: column; gap: 2px; }
    .region__flag { font-size: 1.25rem; }
    .region__name { font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .region__cities { font-size: 0.9375rem; color: var(--wb-ink-600); }
    .region__go { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: var(--wb-blue-tint); color: var(--wb-blue); font-size: 1.25rem; transition: background-color 0.3s ease, color 0.3s ease; }
    .region:hover .region__go { background: var(--wb-blue); color: #fff; }

    .rsec { padding: var(--wb-section-y) 0; background: #fff; scroll-margin-top: 70px; }
    .rsec--tint { background: #f4f7ff; }
    .rsec__split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 96px); align-items: center; }
    .rsec__art { margin: 0; }
    .rsec__art img { display: block; width: 100%; height: min(540px, calc(100svh - 2 * var(--wb-section-y))); object-fit: cover; border-radius: 28px; box-shadow: 0 24px 60px rgba(44, 88, 241, 0.14); }
    .rsec__kicker { font-weight: 700; font-size: 0.875rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wb-blue); }
    .rsec__kicker--light { color: #ffd84d; }
    .rsec__title { margin: var(--wb-space-xs) 0 var(--wb-space-sm); font-size: min(var(--wb-fs-h2), 6.4svh); }
    .rsec__text { margin-top: 12px; max-width: 620px; font-size: var(--wb-fs-body); line-height: 1.65; color: var(--wb-ink-600); }
    .ticks { margin-top: var(--wb-space-sm); display: flex; flex-direction: column; gap: 10px; }
    .ticks li { position: relative; padding-left: 30px; font-size: var(--wb-fs-body); line-height: 1.5; color: #2a2a2a; }
    .ticks li::before { content: ''; position: absolute; left: 0; top: 0.15em; width: 20px; height: 20px; border-radius: 50%; background: var(--wb-blue-tint) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m6 10 3 3 5-6' fill='none' stroke='%232c58f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 100% no-repeat; }

    .foot { padding: var(--wb-section-y) 0; background: #fff; }
    .foot__title { font-weight: 700; font-size: var(--wb-fs-h3); color: #0f0e09; text-align: center; }
    .foot__cards { margin-top: var(--wb-space-md); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wb-gap-cards); }
    .fcard { padding: clamp(20px, 2vw, 32px); border-radius: 20px; background: linear-gradient(160deg, #2c58f1, #4a74f6); color: #fff; transition: transform 0.4s var(--wb-ease-out); }
    .fcard:hover { transform: translateY(-6px); }
    .fcard__n { font-weight: 700; font-size: var(--wb-fs-h3); line-height: 1; color: #ffd84d; }
    .fcard__title { margin-top: 12px; font-weight: 700; font-size: var(--wb-fs-card-title); }
    .fcard__text { margin-top: 8px; font-size: var(--wb-fs-body); line-height: 1.5; color: rgba(255, 255, 255, 0.88); }
    .sol { margin-top: var(--wb-space-lg); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 96px); align-items: center; }
    .sol__title { font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; align-items: center; }
    .gallery__img { width: 100%; height: clamp(220px, 34svh, 360px); object-fit: cover; border-radius: 18px; transform: translateY(calc((var(--i) - 1) * -18px)); transition: transform 0.5s var(--wb-ease-out); }
    .gallery:hover .gallery__img { transform: none; }

    .advs { padding: var(--wb-section-y) 0; background: #f4f7ff; }
    .advs__list { margin-top: var(--wb-space-md); display: grid; grid-template-columns: 1fr 1fr; gap: var(--wb-gap-cards); }
    .adv { display: grid; grid-template-columns: 110px 1fr; gap: 22px; align-items: start; padding: clamp(20px, 2vw, 30px); border-radius: 22px; background: #fff; box-shadow: 0 10px 30px rgba(28, 44, 110, 0.06); }
    .adv__photo { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; }
    .adv__name { font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .adv__role { margin-top: 4px; font-size: 0.9375rem; color: var(--wb-blue); }
    .adv__text { margin-top: 10px; font-size: var(--wb-fs-body); line-height: 1.6; color: var(--wb-ink-600); }
    .advs__closing { margin: var(--wb-space-lg) auto 0; max-width: 980px; text-align: center; font-size: var(--wb-fs-lead); line-height: 1.6; color: #2a2a2a; }

    .usa { padding: 0 0 var(--wb-section-y); background: #fff; scroll-margin-top: 70px; }
    .usa-p { padding: var(--wb-section-y) 0; background: #fff; }
    .usa__banner { position: relative; padding: clamp(110px, 30svh, 300px) 0 clamp(36px, 7svh, 72px); background-size: cover; background-position: center 30%; }
    .usa__banner::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11, 21, 51, 0.1) 0%, rgba(11, 21, 51, 0.75) 100%); }
    .usa__banner-inner { position: relative; }
    .usa__title { margin-top: var(--wb-space-xs); color: #fff; font-size: min(var(--wb-fs-h2), 6.4svh); }
    .usa__title span { color: #ffd84d; }
    .usa__intro { margin: var(--wb-space-lg) auto 0; max-width: 980px; text-align: center; font-size: var(--wb-fs-lead); line-height: 1.6; color: var(--wb-ink-600); }
    .pillars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wb-gap-cards); }
    .pillar { position: relative; overflow: hidden; height: clamp(300px, calc(100svh - 2 * var(--wb-section-y)), 620px); border-radius: 24px; background: #2c58f1; outline: none; }
    .pillar__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s var(--wb-ease-out), opacity 0.45s ease; }
    .pillar__body { position: absolute; left: 0; right: 0; bottom: 0; padding: clamp(18px, 2vw, 28px); background: linear-gradient(180deg, rgba(20, 40, 120, 0) 0%, rgba(20, 40, 120, 0.92) 40%); color: #fff; }
    .pillar__title { font-weight: 700; font-size: var(--wb-fs-card-title); }
    .pillar__points { display: flex; flex-direction: column; gap: 8px; max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.5s var(--wb-ease-out), opacity 0.4s ease, margin-top 0.4s; }
    .pillar__points li { position: relative; padding-left: 16px; font-size: clamp(0.875rem, 0.92vw, 1rem); line-height: 1.5; color: rgba(255, 255, 255, 0.92); }
    .pillar__points li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 6px; height: 6px; border-radius: 50%; background: #ffd84d; }
    .pillar:hover .pillar__img, .pillar:focus-visible .pillar__img { transform: scale(1.06); }
    .pillar:hover .pillar__points, .pillar:focus-visible .pillar__points { max-height: 260px; opacity: 1; margin-top: 12px; }
    .pillar:focus-visible { box-shadow: 0 0 0 3px #ffd84d; }
    @media (hover: none) { .pillar__points { max-height: none; opacity: 1; margin-top: 12px; } }

    @media (prefers-reduced-motion: reduce) { .region, .gallery__img, .pillar__img, .pillar__points, .fcard { animation: none; transition: none; } }
    @media (max-width: 1100px) { .foot__cards, .pillars { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 900px) {
      .hero__inner, .rsec__split, .sol, .advs__list { grid-template-columns: 1fr; }
      .rsec__split--flip .rsec__art { order: -1; }
      .rsec__art img { height: 340px; }
    }
    @media (max-width: 560px) { .foot__cards, .pillars { grid-template-columns: 1fr; } .region { grid-template-columns: 90px 1fr auto; } }
  `,
})
export class GlobalPresencePageComponent {
  protected readonly c = GLOBAL;
  protected readonly advisors = PURPOSE.advisory.groups[1].advisors;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: GLOBAL.hero.lead });
  }
}
