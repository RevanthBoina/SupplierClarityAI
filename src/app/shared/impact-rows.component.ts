import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal, viewChild, viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SectionHeadComponent } from './section-head.component';
import { PillLabelComponent } from './pill-label.component';
import { ImpactContent } from '../content/content-types';

/**
 * Shared "Business impact" section used on service pages: three rows (coloured card + illustration)
 * with a sticky side menu that highlights the row in view and jumps to a row when clicked, then a
 * product banner.  <wb-impact-rows [content]="IMPACT" />
 *
 * [pinned]="true" (one-screen pages): on desktop the section pins to the screen and scrolling steps
 * through the rows in place (the side menu still highlights and jumps), so it never runs past one
 * screen height. Below 901px wide or 600px tall it falls back to the stacked layout.
 */
@Component({
  selector: 'wb-impact-rows',
  imports: [SectionHeadComponent, PillLabelComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- One row: coloured card + illustration -->
    <ng-template #rowTpl let-item>
      <article class="card" [class]="'card card--' + item.tone">
        <span class="card__icon" aria-hidden="true">
          @switch (item.icon) {
            @case ('trend') { <svg viewBox="0 0 24 24"><path d="m4 16 6-6 4 4 6-6" /><path d="M15 8h5v5" /></svg> }
            @case ('spark') { <svg viewBox="0 0 24 24"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" /></svg> }
            @case ('bolt') { <svg viewBox="0 0 24 24"><path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" /></svg> }
            @default { <svg viewBox="0 0 24 24"><path d="M6 5v14M10 5v14M14 5v14M18 5v14" /></svg> }
          }
        </span>
        <p class="card__kicker">{{ item.kicker }}</p>
        <h3 class="card__title">{{ item.title }}</h3>
        <p class="card__text">
          @if (item.strong) { {{ item.textLead }} <strong>{{ item.strong }}</strong>{{ item.text }} } @else { {{ item.text }} }
        </p>
      </article>
      <figure class="art"><img [src]="item.image" width="502" height="500" alt="" /></figure>
    </ng-template>

    <ng-template #menuTpl>
      <ul>
        @for (item of c.items; track item.kicker; let i = $index) {
          <li><button type="button" class="menu__item" [class.menu__item--on]="i === active()" (click)="goTo(i)"
                      [attr.aria-current]="i === active() ? 'true' : null">{{ item.kicker }}</button></li>
        }
      </ul>
    </ng-template>

    <section class="impact" [class.impact--pinned]="isPinned()" aria-labelledby="impact-title">
      <div class="impact__grid" aria-hidden="true"></div>

      @if (isPinned()) {
        <!-- Pinned: the stage sticks for the length of the track; scroll position picks the row -->
        <div class="track" #track [style.--rows]="c.items.length">
          <div class="stage">
            <div class="wb-container stage__inner">
              <header class="phead">
                <div>
                  <wb-pill-label icon="business-impact">{{ c.eyebrow }}</wb-pill-label>
                  <h2 class="wb-h2 phead__title" id="impact-title">{{ c.titleLead }}{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span></h2>
                </div>
                <p class="wb-lead phead__lead">{{ c.lead }}</p>
              </header>
              <div class="impact__body pbody">
                <nav class="menu" aria-label="Business impact"><ng-container [ngTemplateOutlet]="menuTpl" /></nav>
                <div class="prows">
                  @for (item of c.items; track item.kicker; let i = $index) {
                    <div class="row prow" [class.prow--on]="i === active()" [class.prow--past]="i < active()" [attr.aria-hidden]="i !== active()">
                      <ng-container [ngTemplateOutlet]="rowTpl" [ngTemplateOutletContext]="{ $implicit: item }" />
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="wb-container impact__inner pafter">
          <ng-container [ngTemplateOutlet]="actionTpl" />
        </div>
      } @else {
        <div class="wb-container impact__inner">
          <wb-section-head icon="business-impact" [eyebrow]="c.eyebrow" [title]="c.titleLead" [accent]="c.titleAccent" [lead]="c.lead" headingId="impact-title" />

          <div class="impact__body">
            <nav class="menu menu--sticky" aria-label="Business impact"><ng-container [ngTemplateOutlet]="menuTpl" /></nav>
            <div class="rows">
              @for (item of c.items; track item.kicker; let i = $index) {
                <div class="row" #row [attr.data-index]="i">
                  <ng-container [ngTemplateOutlet]="rowTpl" [ngTemplateOutletContext]="{ $implicit: item }" />
                </div>
              }
            </div>
          </div>
          <ng-container [ngTemplateOutlet]="actionTpl" />
        </div>
      }
    </section>

    <ng-template #actionTpl>
      <aside class="action" aria-labelledby="action-title">
        <div>
          <p class="action__kicker">{{ c.action.kicker }}</p>
          <h3 class="action__title" id="action-title">{{ c.action.title }}</h3>
          <p class="action__text">{{ c.action.text }}</p>
        </div>
        <a class="action__cta" [href]="c.action.href">{{ c.action.cta }} <span aria-hidden="true">→</span></a>
      </aside>
    </ng-template>
  `,
  styles: `
    :host { display: block; }
    .impact { position: relative; padding: var(--wb-section-y) 0; background: #f7f8ff; font-family: var(--wb-font-body); overflow: clip; } /* clip, not hidden: hidden stops the menu sticking */
    .impact__grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(to right, rgba(44, 88, 241, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(44, 88, 241, 0.05) 1px, transparent 1px);
      background-size: 120px 120px;
      background-position: calc(50% - 900px) 0, 0 0;
      mask-image: linear-gradient(to bottom, #000, transparent 60%);
    }
    .impact__inner { position: relative; }

    .impact__body { margin-top: var(--wb-space-lg); display: grid; grid-template-columns: minmax(200px, 300px) minmax(0, 1fr); gap: 48px; }
    .menu { align-self: stretch; }
    .menu--sticky ul { position: sticky; top: 140px; }
    .menu ul { display: flex; flex-direction: column; gap: 22px; padding-top: 24px; }
    .menu__item {
      position: relative;
      padding-left: 22px;
      font-weight: 600;
      font-size: 0.9375rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-align: left;
      color: #8a90a6;
      transition: color 0.3s ease;
    }
    .menu__item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 8px;
      height: 8px;
      margin-top: -4px;
      border-radius: 50%;
      background: currentColor;
      transform: scale(0);
      transition: transform 0.3s var(--wb-ease-spring);
    }
    .menu__item:hover { color: #44506e; }
    .menu__item--on { color: #2b4a6b; }
    .menu__item--on::before { transform: scale(1); }

    .rows { display: flex; flex-direction: column; gap: clamp(48px, 6vw, 120px); }
    .row { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: var(--wb-gap-cards); align-items: stretch; scroll-margin-top: 140px; }
    .card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: clamp(28px, 3.3vw, 60px);
      border-radius: 28px;
      color: #fff;
    }
    .card--teal { background: linear-gradient(135deg, #508fa1 0%, #4673a8 55%, #4166aa 100%); }
    .card--purple { background: linear-gradient(135deg, #574ba0 0%, #614494 55%, #6b3f8a 100%); }
    .card--green { background: linear-gradient(160deg, #2e7a62 0%, #31907a 55%, #35a08f 100%); }
    .card__icon { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: #fff; margin-bottom: var(--wb-space-md); }
    .card__icon svg { width: 26px; height: 26px; fill: none; stroke: #3b4f8a; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .card--purple .card__icon svg { stroke: #5b4597; }
    .card--green .card__icon svg { stroke: #2e7a62; }
    .card__kicker { font-weight: 600; font-size: 0.9375rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .card__title { margin-top: var(--wb-space-xs); font-weight: 700; font-size: var(--wb-fs-h3); line-height: 1.18; }
    .card__text { margin-top: var(--wb-space-xs); max-width: 560px; font-size: var(--wb-fs-body); line-height: 1.6; color: rgba(255, 255, 255, 0.92); }
    .card__text strong { font-weight: 700; color: #fff; }
    .art {
      margin: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 1px solid #e6ebf7;
      border-radius: 28px;
      background: #f2f5fd;
      box-shadow: 0 18px 40px rgba(44, 88, 241, 0.08);
    }
    /* contain, not cover: the whole illustration is shown at the same scale whatever the box shape (no zoomed-in crops) */
    .art img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.8s var(--wb-ease-out); }
    .row:hover .art img { transform: scale(1.04); }

    .action {
      margin-top: clamp(56px, 6vw, 112px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px 48px;
      padding: clamp(28px, 2.8vw, 52px) clamp(24px, 2.8vw, 52px);
      border-radius: 28px;
      background: linear-gradient(90deg, #4a58e0 0%, #5a6ae8 100%);
      color: #fff;
    }
    .action__kicker { font-weight: 700; font-size: 0.9375rem; letter-spacing: 0.1em; text-transform: uppercase; color: #ffd04a; }
    .action__title { margin-top: 10px; font-weight: 700; font-size: var(--wb-fs-card-title); line-height: 1.3; }
    .action__text { margin-top: 10px; font-size: var(--wb-fs-body); line-height: 1.55; color: rgba(255, 255, 255, 0.9); }
    .action__cta {
      flex: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 60px;
      padding: 0 32px;
      border-radius: 999px;
      background: #fff;
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: var(--wb-fs-button);
      color: #3a49c9;
      transition: background-color 0.25s ease;
    }
    .action__cta:hover { background: #ffd04a; }
    .action__cta span { display: inline-block; transition: transform 0.3s var(--wb-ease-out); }
    .action__cta:hover span { transform: translateX(4px); }


    /* ---------- One-screen pages (.wb-fit): rows scroll past a sticky menu, each row sized to one screen ---------- */
    :host-context(.wb-fit) .rows { gap: clamp(32px, 6svh, 96px); }
    :host-context(.wb-fit) .row { height: clamp(300px, calc(100svh - 200px), 540px); scroll-margin-top: 120px; }
    :host-context(.wb-fit) .row .card { padding: clamp(24px, min(3.3vw, 4.5svh), 56px); min-height: 0; }
    :host-context(.wb-fit) .row .card__icon { width: clamp(44px, 6svh, 64px); height: clamp(44px, 6svh, 64px); margin-bottom: min(var(--wb-space-md), 3svh); }
    :host-context(.wb-fit) .row .card__title { font-size: min(var(--wb-fs-h3), 5svh); }
    :host-context(.wb-fit) .row .card__text { font-size: min(var(--wb-fs-body), 2.5svh); }
    :host-context(.wb-fit) .row .art { min-height: 0; }
    :host-context(.wb-fit) .menu--sticky ul { top: calc(50svh - 70px); } /* sticks mid-screen beside the rows; starts in line with the first row */

    /* ---------- Pinned layout (one-screen pages) ---------- */
    .impact--pinned { padding: 0 0 var(--wb-section-y); }
    .track { position: relative; height: calc(100svh + (var(--rows) - 1) * 80svh); }
    .stage {
      position: sticky;
      top: 0;
      height: 100svh;
      display: grid;
      align-content: center;
      padding: 96px 0 clamp(24px, 4svh, 48px); /* top clears the condensed nav bar */
    }
    .phead { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 24px 64px; align-items: end; }
    .phead__title { margin-top: var(--wb-space-xs); font-size: min(var(--wb-fs-h2), 6.4svh); }
    .phead__lead { font-size: min(var(--wb-fs-lead), 2.8svh); }
    .pbody { margin-top: min(var(--wb-fit-gap), 5svh); }
    .pbody .menu ul { padding-top: 24px; }
    .prows {
      display: grid;
      height: clamp(300px, calc(100svh - 96px - min(var(--wb-fs-h2), 6.4svh) * 2.4 - 140px), 560px);
    }
    .prow {
      grid-area: 1 / 1;
      min-height: 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(40px);
      transition: opacity 0.5s ease, transform 0.6s var(--wb-ease-out), visibility 0s linear 0.5s;
    }
    .prow--past { transform: translateY(-40px); }
    .prow--on { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    .prow .card { padding: clamp(24px, min(3.3vw, 4.5svh), 56px); }
    .prow .card__icon { width: clamp(44px, 6svh, 64px); height: clamp(44px, 6svh, 64px); margin-bottom: min(var(--wb-space-md), 3svh); }
    .prow .card__title { font-size: min(var(--wb-fs-h3), 5svh); }
    .prow .card__text { font-size: min(var(--wb-fs-body), 2.5svh); }
    .prow .art { min-height: 0; }
    .pafter .action { margin-top: 0; }
    @media (prefers-reduced-motion: reduce) {
      .prow, .prow--past { transform: none; }
    }

    @media (max-width: 1100px) {
      .impact__body { grid-template-columns: 1fr; }
      .menu { display: none; }
    }
    @media (max-width: 760px) {
      .row { grid-template-columns: 1fr; }
      .art { aspect-ratio: 1; }
      .action { flex-direction: column; align-items: flex-start; }
    }
  `,
})
export class ImpactRowsComponent {
  readonly content = input.required<ImpactContent>();
  /** Pin the section and step through rows in place (one-screen pages). Desktop only. */
  readonly pinned = input(false);
  protected get c(): ImpactContent { return this.content(); }
  protected readonly active = signal(0);
  /** pinned() and the screen is big enough for the pinned layout */
  protected readonly isPinned = signal(false);
  private readonly rows = viewChildren<ElementRef<HTMLElement>>('row');
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const mq = window.matchMedia('(min-width: 901px) and (min-height: 600px)');
      const setMode = () => this.isPinned.set(this.pinned() && mq.matches);
      setMode();
      mq.addEventListener('change', setMode);

      let frame = 0;
      const update = () => {
        frame = 0;
        let current = 0;
        const track = this.track()?.nativeElement;
        if (this.isPinned() && track) {
          // Pinned: progress through the track picks the row
          const r = track.getBoundingClientRect();
          const range = r.height - window.innerHeight;
          const p = range > 0 ? Math.min(Math.max(-r.top / range, 0), 0.999) : 0;
          current = Math.floor(p * this.c.items.length);
        } else {
          // Stacked: the current row is the last one whose top has passed 45% of the way down the screen
          const line = window.innerHeight * 0.45;
          this.rows().forEach((row, i) => { if (row.nativeElement.getBoundingClientRect().top <= line) current = i; });
        }
        if (current !== this.active()) this.active.set(current);
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        mq.removeEventListener('change', setMode);
        cancelAnimationFrame(frame);
      });
    });
  }

  protected goTo(i: number): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    const track = this.track()?.nativeElement;
    if (this.isPinned() && track) {
      // Scroll to the middle of row i's stretch of the track
      const r = track.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const top = window.scrollY + r.top + ((i + 0.5) / this.c.items.length) * range;
      window.scrollTo({ top, behavior });
      return;
    }
    this.rows()[i]?.nativeElement.scrollIntoView({ behavior, block: 'start' });
  }
}
