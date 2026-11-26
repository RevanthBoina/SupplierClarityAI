import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { CompanyHeroComponent } from './sections/company-hero.component';
import { AgenticDeliveryComponent } from '../agentic-ai/sections/agentic-delivery.component';
import { FRAMEWORK } from '../../content/about-content';

/**
 * /company/framework: the 90-day AI-automation framework.
 * The approach section has a live 90-day cycle dial (one stage lights up at a time); the method reuses the
 * pinned ring from the service pages; success stories alternate image and text.
 */
@Component({
  selector: 'wb-framework-page',
  imports: [SectionThemeDirective, SectionHeadComponent, PillLabelComponent, RevealDirective, CtaBandComponent, CompanyHeroComponent, AgenticDeliveryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' },
  template: `
    <wb-company-hero wbSectionTheme="#ffffff" [titleLead]="c.hero.titleLead" [titleAccent]="c.hero.titleAccent" [lead]="c.hero.lead"
                     [image]="c.hero.image" [imageAlt]="c.hero.imageAlt" [primary]="c.hero.primary" [secondary]="c.hero.secondary" />
    <main>
      <!-- Approach: text left, 90-day cycle dial right -->
      <section class="approach" wbSectionTheme="#ffffff" aria-labelledby="approach-title">
        <div class="wb-container approach__inner">
          <div>
            <wb-pill-label icon="how-we-work">{{ c.approach.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 approach__title" id="approach-title">{{ c.approach.titleLead }}<br /><span class="wb-accent">{{ c.approach.titleAccent }}</span></h2>
            @for (p of c.approach.paragraphs; track $index) { <p class="approach__p">{{ p }}</p> }
          </div>
          <div class="dial" aria-label="The 90-day cycle">
            <svg class="dial__ring" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="168" class="dial__track" />
              <circle cx="200" cy="200" r="168" class="dial__progress" [style.stroke-dashoffset]="1 - (stage() + 1) / 4" pathLength="1" />
            </svg>
            <div class="dial__core">
              <span class="dial__days">90</span>
              <span class="dial__unit">day cycle</span>
              <span class="dial__now">{{ c.approach.cycle[stage()].text }}</span>
            </div>
            @for (s of c.approach.cycle; track s.label; let i = $index) {
              <button type="button" class="dial__stage" [class]="'dial__stage dial__stage--' + i" [class.is-on]="i === stage()" (click)="pick(i)">
                <span class="dial__n">0{{ i + 1 }}</span>{{ s.label }}
              </button>
            }
          </div>
        </div>
      </section>

      <wb-agentic-delivery wbSectionTheme="#ffffff" [content]="c.method" />

      <!-- Success stories -->
      <section class="stories" wbSectionTheme="#f7f8ff" aria-labelledby="stories-title">
        <div class="wb-container">
          <wb-section-head icon="track-record" [eyebrow]="c.stories.eyebrow" [title]="c.stories.titleLead" [accent]="c.stories.titleAccent" [lead]="c.stories.lead" headingId="stories-title" />
          @for (s of c.stories.items; track s.title; let i = $index) {
            <article class="story" [class.story--flip]="i % 2 === 1" wbReveal="up">
              <figure class="story__art"><img [src]="s.image" width="680" height="680" [alt]="s.industry + ' project'" loading="lazy" /></figure>
              <div class="story__body">
                <p class="story__kicker">{{ s.industry }}</p>
                <h3 class="story__title">{{ s.title }}</h3>
                <p class="story__client">Client: {{ s.client }}</p>
                @if (s.stat) { <p class="story__stat"><strong>{{ s.stat.value }}</strong> {{ s.stat.label }}</p> }
                <div class="story__qs">
                  <div><p class="story__q">Quarter 1</p><ul>@for (p of s.q1; track p) { <li>{{ p }}</li> }</ul></div>
                  <div><p class="story__q">Quarter 2</p><ul>@for (p of s.q2; track p) { <li>{{ p }}</li> }</ul></div>
                </div>
                <a class="story__cta" href="#contact">{{ s.cta }} <span aria-hidden="true">→</span></a>
              </div>
            </article>
          }
        </div>
      </section>

      <!-- Philosophy: blue band -->
      <section class="philo" wbSectionTheme="#ffffff" aria-labelledby="philo-title">
        <div class="philo__grid" aria-hidden="true"></div>
        <div class="wb-container philo__inner">
          <wb-pill-label icon="our-values" tone="light">{{ c.philosophy.eyebrow }}</wb-pill-label>
          <h2 class="wb-h2 philo__title" id="philo-title">{{ c.philosophy.titleLead }}{{ ' ' }}<span>{{ c.philosophy.titleAccent }}</span></h2>
          <p class="wb-lead philo__lead">{{ c.philosophy.lead }}</p>
          <div class="philo__cards">
            @for (p of c.philosophy.items; track p.title; let i = $index) {
              <article class="pcard" wbReveal="up" [wbRevealDelay]="i * 110">
                <span class="pcard__icon" aria-hidden="true">
                  @switch (p.icon) {
                    @case ('bulb') { <svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3z" /></svg> }
                    @case ('trend') { <svg viewBox="0 0 24 24"><path d="m4 16 6-6 4 4 6-6" /><path d="M15 8h5v5" /></svg> }
                    @default { <svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg> }
                  }
                </span>
                <h3 class="pcard__title">{{ p.title }}</h3>
                <ul class="pcard__points">@for (x of p.points; track x) { <li>{{ x }}</li> }</ul>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- What makes it different -->
      <section class="diff" wbSectionTheme="#ffffff" aria-labelledby="diff-title">
        <div class="wb-container">
          <wb-section-head icon="trust-security" [eyebrow]="c.different.eyebrow" [title]="c.different.titleLead" [accent]="c.different.titleAccent" headingId="diff-title" />
          <ul class="diff__list">
            @for (d of c.different.items; track d.title; let i = $index) {
              <li class="diff__item" wbReveal="up" [wbRevealDelay]="i * 80">
                <span class="diff__n">0{{ i + 1 }}</span>
                <div><h3 class="diff__title">{{ d.title }}</h3><p class="diff__text">{{ d.text }}</p></div>
              </li>
            }
          </ul>
        </div>
      </section>

      <!-- Capabilities -->
      <section class="caps" wbSectionTheme="#f4f7ff" aria-labelledby="fcaps-title">
        <div class="wb-container">
          <wb-section-head icon="services" [eyebrow]="c.capabilities.eyebrow" [title]="c.capabilities.titleLead" [accent]="c.capabilities.titleAccent" [lead]="c.capabilities.lead" headingId="fcaps-title" />
          <div class="caps__grid">
            @for (k of c.capabilities.items; track k.title; let i = $index) {
              <article class="ccard" wbReveal="up" [wbRevealDelay]="i * 80">
                <span class="ccard__badge" aria-hidden="true">{{ i + 1 }}</span>
                <h3 class="ccard__title">{{ k.title }}</h3>
                <ul class="ccard__points">@for (x of k.points; track x) { <li>{{ x }}</li> }</ul>
              </article>
            }
          </div>
        </div>
      </section>

      <wb-cta-band wbSectionTheme="#ffffff" [content]="c.cta" />
    </main>
  `,
  styles: `
    :host { display: block; font-family: var(--wb-font-body); }

    .approach { padding: var(--wb-section-y) 0; background: #fff; }
    .approach__inner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 96px); align-items: center; }
    .approach__title { margin: var(--wb-space-xs) 0 var(--wb-space-sm); }
    .approach__p { margin-top: 14px; max-width: 640px; font-size: var(--wb-fs-body); line-height: 1.65; color: var(--wb-ink-600); }

    /* 90-day dial */
    .dial { position: relative; justify-self: center; width: min(100%, 460px, calc(100svh - 2 * var(--wb-section-y) - 40px)); aspect-ratio: 1; }
    .dial__ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
    .dial__track { fill: none; stroke: #e3e9fb; stroke-width: 14; }
    .dial__progress { fill: none; stroke: var(--wb-blue); stroke-width: 14; stroke-linecap: round; stroke-dasharray: 1; transition: stroke-dashoffset 0.9s var(--wb-ease-out); }
    .dial__core { position: absolute; inset: 22%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-radius: 50%; background: linear-gradient(160deg, #f4f7ff, #e6edff); box-shadow: inset 0 0 0 1px #dfe6fa; padding: 8%; }
    .dial__days { font-weight: 700; font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1; color: var(--wb-blue); }
    .dial__unit { font-weight: 600; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; color: #44506e; }
    .dial__now { margin-top: 10px; font-size: clamp(0.8125rem, 0.9vw, 1rem); line-height: 1.4; color: var(--wb-ink-600); min-height: 2.8em; }
    .dial__stage {
      position: absolute;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 8px 22px rgba(28, 44, 110, 0.12);
      font-weight: 600; font-size: clamp(0.8125rem, 0.9vw, 1rem); color: #0f0e09;
      translate: -50% -50%;
      transition: background-color 0.35s ease, color 0.35s ease, transform 0.35s var(--wb-ease-out);
    }
    .dial__n { font-size: 0.75rem; color: var(--wb-blue); }
    .dial__stage.is-on { background: var(--wb-blue); color: #fff; transform: scale(1.06); }
    .dial__stage.is-on .dial__n { color: #ffd04a; }
    .dial__stage--0 { left: 50%; top: 4%; }
    .dial__stage--1 { left: 96%; top: 50%; }
    .dial__stage--2 { left: 50%; top: 96%; }
    .dial__stage--3 { left: 4%; top: 50%; }

    /* Stories */
    .stories { padding: var(--wb-section-y) 0; background: #f7f8ff; }
    .story { margin-top: var(--wb-space-lg); display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr); gap: clamp(28px, 4vw, 72px); align-items: center; }
    .story--flip .story__art { order: 2; }
    .story__art { margin: 0; overflow: hidden; border-radius: 28px; box-shadow: 0 20px 50px rgba(44, 88, 241, 0.12); }
    .story__art img { display: block; width: 100%; height: min(520px, calc(100svh - 2 * var(--wb-section-y) - 60px)); object-fit: cover; transition: transform 0.8s var(--wb-ease-out); }
    .story:hover .story__art img { transform: scale(1.04); }
    .story__kicker { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.875rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wb-blue); }
    .story__kicker::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ffd04a; }
    .story__title { margin-top: 10px; font-weight: 700; font-size: var(--wb-fs-h3); line-height: 1.15; color: #0f0e09; }
    .story__client { margin-top: 8px; font-size: var(--wb-fs-body); color: var(--wb-ink-600); }
    .story__stat { margin-top: var(--wb-space-xs); font-size: var(--wb-fs-body); color: var(--wb-ink-600); }
    .story__stat strong { font-size: var(--wb-fs-h3); color: var(--wb-blue); margin-right: 6px; }
    .story__qs { margin-top: var(--wb-space-sm); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .story__q { padding-bottom: 8px; margin-bottom: 10px; border-bottom: 1px solid #dfe5f4; font-weight: 700; font-size: 0.8125rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wb-blue); }
    .story__qs ul { display: flex; flex-direction: column; gap: 8px; }
    .story__qs li { position: relative; padding-left: 18px; font-size: clamp(0.9375rem, 0.94vw, 1.0625rem); line-height: 1.5; color: #2a2a2a; }
    .story__qs li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 7px; height: 7px; border-radius: 50%; background: var(--wb-blue); }
    .story__cta { display: inline-flex; gap: 8px; margin-top: var(--wb-space-sm); padding: 10px 20px; border: 1.5px solid var(--wb-blue); border-radius: 999px; font-weight: 700; color: var(--wb-blue); transition: background-color 0.3s ease, color 0.3s ease; }
    .story__cta:hover { background: var(--wb-blue); color: #fff; }

    /* Philosophy */
    .philo { position: relative; overflow: hidden; padding: var(--wb-section-y) 0; background: #2f5bf0; color: #fff; }
    .philo__grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px); background-size: 120px 120px; }
    .philo__inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .philo__title { margin-top: var(--wb-space-xs); color: #fff; }
    .philo__title span { color: #ffd84d; }
    .philo__lead { margin-top: var(--wb-space-xs); color: rgba(255, 255, 255, 0.85); }
    .philo__cards { width: 100%; margin-top: min(var(--wb-space-lg), 4svh); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--wb-gap-cards); text-align: left; }
    .pcard { padding: clamp(20px, min(2.2vw, 3.6svh), 36px); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 20px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08)); transition: transform 0.4s var(--wb-ease-out), background-color 0.4s ease; }
    .pcard:hover { transform: translateY(-6px); background-color: rgba(255, 255, 255, 0.06); }
    .pcard__icon { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 50%; background: #fff; }
    .pcard__icon svg { width: 24px; height: 24px; fill: none; stroke: var(--wb-blue); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .pcard__title { margin-top: min(var(--wb-space-sm), 2.4svh); font-weight: 700; font-size: var(--wb-fs-card-title); }
    .pcard__points { margin-top: var(--wb-space-xs); display: flex; flex-direction: column; gap: 10px; }
    .pcard__points li { position: relative; padding-left: 18px; font-size: min(var(--wb-fs-body), 2.3svh); line-height: 1.5; color: rgba(255, 255, 255, 0.9); }
    .pcard__points li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 7px; height: 7px; border-radius: 50%; background: #ffd84d; }

    /* Different */
    .diff { padding: var(--wb-section-y) 0; background: #fff; }
    .diff__list { margin-top: var(--wb-space-lg); display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(32px, 5vw, 96px); }
    .diff__item { display: grid; grid-template-columns: auto 1fr; gap: 20px; padding: clamp(20px, 3svh, 32px) 0; border-top: 1px solid #e3e8f4; }
    .diff__n { font-weight: 700; font-size: var(--wb-fs-h3); line-height: 1; color: #dbe3fb; transition: color 0.35s ease; }
    .diff__item:hover .diff__n { color: var(--wb-blue); }
    .diff__title { font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .diff__text { margin-top: 8px; font-size: var(--wb-fs-body); line-height: 1.6; color: var(--wb-ink-600); }

    /* Capabilities */
    .caps { padding: var(--wb-section-y) 0; background: #f4f7ff; }
    .caps__grid { margin-top: min(var(--wb-space-lg), 4svh); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--wb-gap-cards); }
    .ccard { position: relative; padding: clamp(18px, min(2.4vw, 3.4svh), 40px); border-radius: 22px; background: #fff; box-shadow: 0 10px 30px rgba(28, 44, 110, 0.06); transition: transform 0.4s var(--wb-ease-out), box-shadow 0.4s var(--wb-ease-out); }
    .ccard:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(28, 44, 110, 0.12); }
    .ccard__badge { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; background: var(--wb-blue-tint); font-weight: 700; color: var(--wb-blue); }
    .ccard__title { margin-top: min(var(--wb-space-xs), 1.8svh); font-weight: 700; font-size: min(var(--wb-fs-card-title), 3.4svh); color: #0f0e09; }
    .ccard__points { margin-top: var(--wb-space-xs); display: flex; flex-direction: column; gap: 8px; }
    .ccard__points li { position: relative; padding-left: 18px; font-size: min(var(--wb-fs-body), 2.3svh); line-height: 1.5; color: var(--wb-ink-600); }
    .ccard__points li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 7px; height: 7px; border-radius: 50%; background: #ffd04a; }

    @media (max-width: 640px) { .dial { width: min(calc(100% - 96px), 320px); } }
    @media (prefers-reduced-motion: reduce) { .dial__progress, .story__art img, .pcard, .ccard { transition: none; } }
    @media (max-width: 1200px) { .caps__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 1000px) {
      .approach__inner, .story, .diff__list, .caps__grid { grid-template-columns: 1fr; }
      .story--flip .story__art { order: 0; }
      .philo__cards { grid-template-columns: 1fr; }
      .story__art img { height: 360px; }
    }
    @media (max-width: 560px) { .story__qs { grid-template-columns: 1fr; } }
  `,
})
export class FrameworkPageComponent {
  protected readonly c = FRAMEWORK;
  protected readonly stage = signal(0);
  private paused = false;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: FRAMEWORK.hero.lead });
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // The dial steps through the four stages; a click picks one and holds it for a cycle
      const t = setInterval(() => { if (!this.paused) this.stage.update(s => (s + 1) % 4); this.paused = false; }, 2600);
      destroyRef.onDestroy(() => clearInterval(t));
    });
  }

  protected pick(i: number): void { this.stage.set(i); this.paused = true; }
}
