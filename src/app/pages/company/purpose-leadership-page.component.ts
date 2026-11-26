import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { ButtonComponent } from '../../shared/button.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CompanyHeroComponent } from './sections/company-hero.component';
import { AdvisoryBoardComponent } from './sections/advisory-board.component';
import { Leader, PURPOSE } from '../../content/about-content';

/**
 * /company/purpose-leadership: story, values, leadership and advisory board.
 * Values cards lift on hover; leader cards open a full profile in a dialog; advisory board switches
 * between domain and regional advisors.
 */
@Component({
  selector: 'wb-purpose-leadership-page',
  imports: [SectionThemeDirective, SectionHeadComponent, PillLabelComponent, ButtonComponent, RevealDirective, CompanyHeroComponent, AdvisoryBoardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' },
  template: `
    <wb-company-hero wbSectionTheme="#ffffff" [titleLead]="c.hero.titleLead" [titleAccent]="c.hero.titleAccent" [lead]="c.hero.lead"
                     [image]="c.hero.image" [imageAlt]="c.hero.imageAlt" [primary]="c.hero.primary" [secondary]="c.hero.secondary" />
    <main>
      <!-- Story: text left, milestone tiles right -->
      <section class="story" wbSectionTheme="#ffffff" aria-labelledby="story-title">
        <div class="wb-container story__inner">
          <div>
            <wb-pill-label icon="track-record">{{ c.story.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 story__title" id="story-title">{{ c.story.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.story.titleAccent }}</span></h2>
            @for (p of c.story.paragraphs; track $index) { <p class="story__p">{{ p }}</p> }
          </div>
          <ul class="miles">
            @for (m of c.story.milestones; track m.label; let i = $index) {
              <li class="mile" [class]="'mile mile--' + i" wbReveal="up" [wbRevealDelay]="i * 90">
                <span class="mile__value">{{ m.year }}</span>
                <span class="mile__label">{{ m.label }}</span>
              </li>
            }
          </ul>
        </div>
      </section>

      <!-- Values: yellow band, three gradient cards -->
      <section class="values" wbSectionTheme="#ffffff" aria-labelledby="values-title">
        <div class="values__grid" aria-hidden="true"></div>
        <div class="wb-container values__inner">
          <wb-section-head icon="our-values" [eyebrow]="c.values.eyebrow" [title]="c.values.titleLead" [accent]="c.values.titleAccent" [lead]="c.values.lead" headingId="values-title" />
          <div class="vcards">
            @for (v of c.values.items; track v.title; let i = $index) {
              <article class="vcard" [class]="'vcard vcard--' + v.tone" wbReveal="up" [wbRevealDelay]="i * 110">
                <span class="vcard__num" aria-hidden="true">0{{ i + 1 }}</span>
                <span class="vcard__icon" aria-hidden="true">
                  @switch (v.icon) {
                    @case ('heart') { <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg> }
                    @case ('target') { <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></svg> }
                    @default { <svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z" /><path d="m9 12 2 2 4-4" /></svg> }
                  }
                </span>
                <h3 class="vcard__title">{{ v.title }}</h3>
                <ul class="vcard__points">
                  @for (p of v.points; track p) { <li>{{ p }}</li> }
                </ul>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- Leadership: founder feature + team grid; cards open a profile dialog -->
      <section class="lead" id="leadership" wbSectionTheme="#ffffff" aria-labelledby="lead-title">
        <div class="wb-container">
          <wb-section-head icon="leadership" [eyebrow]="c.leadership.eyebrow" [title]="c.leadership.titleLead" [accent]="c.leadership.titleAccent" [lead]="c.leadership.lead" headingId="lead-title" />
          @if (founder; as f) {
            <article class="founder" wbReveal="up">
              <img class="founder__photo" [src]="f.image" width="480" height="752" [alt]="f.name" />
              <div class="founder__body">
                <p class="founder__kicker">Founder</p>
                <h3 class="founder__name">{{ f.name }}</h3>
                <p class="founder__role">{{ f.role }}</p>
                @for (p of f.bio; track $index) { <p class="founder__text">{{ p }}</p> }
                @if (f.education) { <p class="founder__edu">{{ f.education }}</p> }
              </div>
            </article>
          }
        </div>
      </section>

      <section class="team" wbSectionTheme="#ffffff" aria-labelledby="team-title">
        <div class="wb-container">
          <h2 class="team__title" id="team-title">{{ c.leadership.teamTitle }}</h2>
          <p class="team__lead">{{ c.leadership.teamLead }}</p>
          <ul class="people">
            @for (l of team; track l.name; let i = $index) {
              <li wbReveal="up" [wbRevealDelay]="(i % 5) * 70">
                <button type="button" class="person" (click)="open(l)" [attr.aria-label]="'Read profile: ' + l.name + ', ' + l.role">
                  <img class="person__photo" [src]="l.image" width="480" height="752" alt="" loading="lazy" />
                  <span class="person__info">
                    <span class="person__name">{{ l.name }}</span>
                    <span class="person__role">{{ l.role }}</span>
                  </span>
                  <span class="person__more" aria-hidden="true">+</span>
                </button>
              </li>
            }
          </ul>
        </div>
      </section>

      <!-- Advisory board: domain / regional tabs -->
      <wb-advisory-board wbSectionTheme="#f0f9fa" />

      <!-- Join our team -->
      <section class="join" wbSectionTheme="#ffffff" aria-labelledby="join-title">
        <div class="wb-container">
          <div class="join__panel">
            <div class="join__copy">
              <p class="join__kicker">{{ c.join.kicker }}</p>
              <h2 class="join__title" id="join-title">{{ c.join.titleLead }}<br /><span>{{ c.join.titleAccent }}</span></h2>
              <p class="join__lead">{{ c.join.lead }}</p>
              <dl class="join__stats">
                @for (s of c.join.stats; track s.label) {
                  <div><dt>{{ s.label }}</dt><dd>{{ s.value }}</dd></div>
                }
              </dl>
              <div class="join__actions">
                <wb-button variant="yellow" [href]="c.join.primary.href">{{ c.join.primary.label }}</wb-button>
                <wb-button variant="outline-light" [href]="c.join.secondary.href">{{ c.join.secondary.label }}</wb-button>
              </div>
            </div>
            <img class="join__photo" [src]="c.join.image" width="1080" height="720" alt="" loading="lazy" />
          </div>
        </div>
      </section>
    </main>

    <!-- Leader profile -->
    <dialog class="profile" #dialog (click)="onBackdrop($event)" (close)="selected.set(null)" aria-labelledby="profile-name">
      @if (selected(); as s) {
        <div class="profile__inner">
          <img class="profile__photo" [src]="s.image" width="480" height="752" [alt]="s.name" />
          <div class="profile__body">
            <h3 class="profile__name" id="profile-name">{{ s.name }}</h3>
            <p class="profile__role">{{ s.role }}</p>
            @for (p of s.bio; track $index) { <p class="profile__text">{{ p }}</p> }
            @if (s.education) { <p class="profile__edu">{{ s.education }}</p> }
          </div>
          <button type="button" class="profile__close" (click)="close()" aria-label="Close profile">×</button>
        </div>
      }
    </dialog>
  `,
  styles: `
    :host { display: block; font-family: var(--wb-font-body); }

    /* Story */
    .story { padding: var(--wb-section-y) 0; background: #fff; }
    .story__inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 96px); align-items: center; }
    .story__title { margin: var(--wb-space-xs) 0 var(--wb-space-sm); }
    .story__p { margin-top: 14px; font-size: var(--wb-fs-body); line-height: 1.65; color: var(--wb-ink-600); max-width: 620px; }
    .miles { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wb-gap-cards); }
    .mile {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 8px;
      min-height: clamp(150px, 22svh, 220px);
      padding: clamp(20px, 2vw, 32px);
      border-radius: 24px;
      background: #f0f9fa;
      transition: transform 0.4s var(--wb-ease-out), box-shadow 0.4s var(--wb-ease-out);
    }
    .mile:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(14, 154, 165, 0.12); }
    .mile--0 { background: var(--wb-blue); color: #fff; }
    .mile--3 { background: #ffdb57; }
    .mile__value { font-weight: 700; font-size: min(var(--wb-fs-h3), 6svh); line-height: 1; }
    .mile__label { font-size: var(--wb-fs-body); line-height: 1.4; opacity: 0.85; }

    /* Values */
    .values { position: relative; overflow: hidden; padding: var(--wb-section-y) 0; background: #ffdb57; }
    .values__grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px);
      background-size: 96px 96px;
    }
    .values__inner { position: relative; }
    .vcards { margin-top: var(--wb-space-lg); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--wb-gap-cards); }
    .vcard {
      position: relative;
      overflow: hidden;
      padding: clamp(24px, 2.4vw, 40px);
      min-height: clamp(240px, 36svh, 360px);
      border-radius: 24px;
      color: #fff;
      transition: transform 0.45s var(--wb-ease-out), box-shadow 0.45s var(--wb-ease-out);
    }
    .vcard:hover { transform: translateY(-8px) rotate(-0.6deg); box-shadow: 0 26px 50px rgba(30, 30, 60, 0.22); }
    .vcard--teal { background: linear-gradient(135deg, #508fa1 0%, #4166aa 100%); }
    .vcard--purple { background: linear-gradient(135deg, #574ba0 0%, #6b3f8a 100%); }
    .vcard--green { background: linear-gradient(160deg, #2e7a62 0%, #35a08f 100%); }
    .vcard__num { position: absolute; right: 22px; top: 8px; font-weight: 700; font-size: clamp(4rem, 8vw, 7rem); line-height: 1; opacity: 0.12; }
    .vcard__icon { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; background: #fff; }
    .vcard__icon svg { width: 24px; height: 24px; fill: none; stroke: #3b4f8a; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .vcard__title { margin-top: var(--wb-space-sm); font-weight: 700; font-size: var(--wb-fs-card-title); }
    .vcard__points { margin-top: var(--wb-space-xs); display: flex; flex-direction: column; gap: 10px; }
    .vcard__points li { position: relative; padding-left: 20px; font-size: var(--wb-fs-body); }
    .vcard__points li::before { content: ''; position: absolute; left: 0; top: 0.55em; width: 8px; height: 8px; border-radius: 50%; background: #ffc45c; }

    /* Leadership: founder */
    .lead { padding: var(--wb-section-y) 0; background: #fff; scroll-margin-top: 80px; }
    .founder {
      margin-top: min(var(--wb-space-lg), 4svh);
      display: grid;
      grid-template-columns: minmax(0, 0.36fr) minmax(0, 1fr);
      gap: clamp(28px, 4vw, 72px);
      align-items: center;
      padding: clamp(16px, min(2.4vw, 3svh), 40px);
      border-radius: 32px;
      background: linear-gradient(135deg, #f0f9fa 0%, #e2f2f3 100%);
    }
    .founder__photo { width: 100%; height: clamp(240px, calc(100svh - 2 * var(--wb-section-y) - 345px), 560px); aspect-ratio: auto; object-fit: cover; object-position: top; border-radius: 24px; }
    .founder__kicker { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.875rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--wb-blue); }
    .founder__kicker::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ffc45c; }
    .founder__name { margin-top: var(--wb-space-xs); font-weight: 700; font-size: min(var(--wb-fs-h3), 5svh); line-height: 1.1; color: #0f0e09; }
    .founder__role { margin-top: 8px; font-weight: 600; font-size: var(--wb-fs-body); color: var(--wb-blue); }
    .founder__text { margin-top: min(14px, 1.6svh); max-width: 760px; font-size: min(var(--wb-fs-body), 2.4svh); line-height: 1.6; color: var(--wb-ink-600); }
    .founder__edu { margin-top: var(--wb-space-sm); font-size: 0.9375rem; color: #7a7f8f; }

    /* Team grid */
    .team { padding: var(--wb-section-y) 0; background: #fff; }
    /* Two rows of portraits fit one screen with the heading */
    .team { --tile-h: clamp(200px, calc((100svh - 2 * var(--wb-section-y) - 120px - var(--wb-gap-cards)) / 2), 380px); }
    .team__title { text-align: center; font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .team__lead { margin-top: 8px; text-align: center; font-size: var(--wb-fs-body); color: var(--wb-ink-600); }
    .people { margin-top: min(var(--wb-space-lg), 4svh); display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--wb-gap-cards); }
    .person { position: relative; display: block; width: 100%; overflow: hidden; border-radius: 22px; text-align: left; background: #3464e6; cursor: pointer; }
    .person__photo { display: block; width: 100%; height: var(--tile-h); object-fit: cover; object-position: center 12%; transition: transform 0.7s var(--wb-ease-out); }
    .person__info {
      position: absolute; left: 10px; right: 10px; bottom: 10px;
      display: flex; flex-direction: column; gap: 2px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      transform: translateY(calc(100% + 14px));
      transition: transform 0.45s var(--wb-ease-out);
    }
    .person__name { font-weight: 700; font-size: clamp(0.875rem, 0.95vw, 1.0625rem); color: #0f0e09; }
    .person__role { font-size: clamp(0.75rem, 0.8vw, 0.875rem); color: var(--wb-blue); }
    .person__more {
      position: absolute; right: 12px; top: 12px;
      width: 32px; height: 32px; display: grid; place-items: center;
      border-radius: 50%; background: rgba(255, 255, 255, 0.9); color: var(--wb-blue); font-size: 1.25rem; font-weight: 600;
      transition: transform 0.35s var(--wb-ease-out);
    }
    .person:hover .person__photo, .person:focus-visible .person__photo { transform: scale(1.05); }
    .person:hover .person__info, .person:focus-visible .person__info { transform: none; }
    .person:hover .person__more { transform: rotate(90deg); }
    .person:focus-visible { outline: 3px solid var(--wb-blue); outline-offset: 3px; }
    @media (hover: none) { .person__info { transform: none; } }

    /* Join */
    .join { padding: var(--wb-section-y) 0; background: #fff; }
    .join__panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); gap: 32px; align-items: stretch; overflow: hidden; border-radius: 32px; background: linear-gradient(120deg, #0e9aa5 0%, #12b0ba 100%); color: #fff; }
    .join__copy { padding: clamp(28px, 3.6vw, 64px); }
    .join__kicker { font-weight: 700; font-size: 0.875rem; letter-spacing: 0.12em; text-transform: uppercase; color: #ffc45c; }
    .join__title { margin-top: var(--wb-space-xs); font-weight: 700; font-size: min(var(--wb-fs-h2), 7svh); line-height: 1.12; }
    .join__title span { color: #ffd84d; }
    .join__lead { margin-top: var(--wb-space-xs); max-width: 560px; font-size: var(--wb-fs-body); line-height: 1.6; color: rgba(255, 255, 255, 0.88); }
    .join__stats { margin: var(--wb-space-md) 0 0; display: flex; flex-wrap: wrap; gap: clamp(20px, 3vw, 48px); }
    .join__stats div { display: flex; flex-direction: column-reverse; }
    .join__stats dt { font-size: 0.875rem; color: rgba(255, 255, 255, 0.8); }
    .join__stats dd { margin: 0; font-weight: 700; font-size: min(var(--wb-fs-h3), 6svh); line-height: 1.1; }
    .join__actions { margin-top: var(--wb-space-md); display: flex; flex-wrap: wrap; gap: 14px; }
    .join__photo { width: 100%; height: 100%; min-height: 320px; object-fit: cover; }

    /* Profile dialog */
    .profile { width: min(920px, calc(100vw - 32px)); max-height: calc(100svh - 48px); padding: 0; border: 0; border-radius: 28px; box-shadow: 0 40px 100px rgba(11, 21, 51, 0.35); }
    .profile::backdrop { background: rgba(11, 21, 51, 0.55); backdrop-filter: blur(4px); }
    .profile[open] { animation: profile-in 0.35s var(--wb-ease-out); }
    @keyframes profile-in { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
    .profile__inner { position: relative; display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); }
    .profile__photo { width: 100%; height: 100%; max-height: calc(100svh - 48px); object-fit: cover; object-position: top; }
    .profile__body { padding: clamp(24px, 3vw, 48px); overflow-y: auto; max-height: calc(100svh - 48px); }
    .profile__name { font-weight: 700; font-size: var(--wb-fs-card-title); color: #0f0e09; }
    .profile__role { margin-top: 6px; font-weight: 600; color: var(--wb-blue); }
    .profile__text { margin-top: 14px; font-size: var(--wb-fs-body); line-height: 1.65; color: var(--wb-ink-600); }
    .profile__edu { margin-top: 18px; font-size: 0.9375rem; color: #7a7f8f; }
    .profile__close { position: absolute; right: 14px; top: 14px; width: 40px; height: 40px; border-radius: 50%; background: #f1f4fc; font-size: 1.5rem; color: #0f0e09; }

    @media (prefers-reduced-motion: reduce) {
      .mile, .vcard, .person__photo, .person__info { transition: none; animation: none; }
    }
    @media (max-width: 1100px) {
      .people { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .vcards { grid-template-columns: 1fr; }
    }
    @media (max-width: 900px) {
      .story__inner, .founder, .join__panel, .profile__inner { grid-template-columns: 1fr; }
      .founder__photo { max-height: 420px; }
      .profile__photo { max-height: 320px; }
    }
    @media (max-width: 560px) { .people { grid-template-columns: 1fr 1fr; } }
  `,
})
export class PurposeLeadershipPageComponent {
  protected readonly c = PURPOSE;
  protected readonly founder = PURPOSE.leaders.find(l => l.founder);
  protected readonly team = PURPOSE.leaders.filter(l => !l.founder);
  protected readonly selected = signal<Leader | null>(null);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: PURPOSE.hero.lead });
  }

  protected open(l: Leader): void {
    this.selected.set(l);
    this.dialog().nativeElement.showModal();
  }
  protected close(): void { this.dialog().nativeElement.close(); }
  /** Clicking the dimmed backdrop (the dialog element itself) closes it */
  protected onBackdrop(e: MouseEvent): void { if (e.target === this.dialog().nativeElement) this.close(); }
}
