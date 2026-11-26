import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal, viewChild,
} from '@angular/core';
import { PillLabelComponent } from '../../../shared/pill-label.component';
import { AGENTIC_DELIVERY } from '../../../content/agentic-ai-content';
import { DeliveryContent } from '../../../content/content-types';

/**
 * "Intelligent agent delivery": a gradient card beside a three-step ring.
 * On desktop the card and ring are pinned while the visitor scrolls; each third of the scroll
 * shows the next step (card, colour, ring segment and centre icon all change). The ring's numbers
 * are buttons that jump to their step. On narrow screens the three cards simply stack.
 */
@Component({
  selector: 'wb-agentic-delivery',
  imports: [PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="delivery" aria-labelledby="delivery-title">
      <!-- Desktop: the whole section (heading + card + ring) pins for one screen while scrolling steps through 01 → 0n -->
      <div class="track" #track>
      <div class="stage">
      <div class="wb-container">
        <div class="delivery__head" [class.delivery__head--center]="c.centered">
          <div class="delivery__head-main">
            <wb-pill-label icon="services">{{ c.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 delivery__title" id="delivery-title">{{ c.title }}@if (c.titleAccent) {{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span>}</h2>
            @if (c.subtitle) { <p class="delivery__subtitle">{{ c.subtitle }}</p> }
          </div>
          <p class="wb-lead delivery__lead">{{ c.lead }}</p>
        </div>

          <div class="pin" #pin>
            @for (s of [step()]; track active()) {
              <article class="step-card" [class]="'step-card step-card--' + s.tone" aria-live="polite">
                <p class="step-card__count">0{{ active() + 1 }} / 0{{ c.steps.length }}</p>
                <h3 class="step-card__title" [class.step-card__title--lg]="s.intro">{{ s.title }}</h3>
                @if (s.intro) { <p class="step-card__intro">{{ s.intro }}</p> }
                <ul class="step-card__points">
                  @for (p of s.points; track p.text) {
                    <li>@if (p.strong) {<strong>{{ p.strong }}</strong>{{ ' ' }}}{{ p.text }}</li>
                  }
                </ul>
                @if (s.link) { <a class="step-card__link" [href]="s.link.href">{{ s.link.label }} <span aria-hidden="true">→</span></a> }
              </article>
            }

            <div class="ring" [class]="'ring ring--' + step().tone" [class.ring--has-bottom]="hasBottomNode()">
              <svg class="ring__svg" viewBox="0 0 400 400" aria-hidden="true">
                <defs>
                  <linearGradient id="arc-teal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#76b4ea" /><stop offset="1" stop-color="#4f7de6" /></linearGradient>
                  <linearGradient id="arc-purple" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b6fd6" /><stop offset="1" stop-color="#6b3fa0" /></linearGradient>
                  <linearGradient id="arc-green" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#45c08f" /><stop offset="1" stop-color="#2e9a78" /></linearGradient>
                  <linearGradient id="arc-rose" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c25b7d" /><stop offset="1" stop-color="#8e4f9e" /></linearGradient>
                  <radialGradient id="ring-core" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#eef3fe" /></radialGradient>
                </defs>
                <circle cx="200" cy="200" r="190" fill="none" stroke="#d9e4fb" stroke-width="3" />
                <!-- One segment per step, from its node to the next (the last one closes the ring) -->
                @for (a of arcs(); track $index; let i = $index) {
                  <path class="ring__arc" [class.ring__arc--on]="i === active()" [attr.d]="a.d" [attr.stroke]="'url(#arc-' + a.tone + ')'"
                        fill="none" stroke-width="5" stroke-linecap="round" pathLength="1" />
                }
                <circle cx="200" cy="200" r="125" fill="url(#ring-core)" stroke="#e6edfc" />
              </svg>
              <!-- Centre icon changes with the step -->
              @for (s of [step()]; track active()) {
                <span class="ring__icon" aria-hidden="true">
                  @switch (s.icon) {
                    @case ('code') {
                      <svg viewBox="0 0 48 48"><path d="M18 12 8 24l10 12M30 12l10 12-10 12" /><path d="M27 10 21 38" /></svg>
                    }
                    @case ('orbit') {
                      <svg viewBox="0 0 48 48"><path d="M24 17.5 30.5 24 24 30.5 17.5 24z" /><path d="M13 31a13 13 0 0 1 4-18" /><path d="M35 17a13 13 0 0 1-4 18" /><circle cx="22" cy="9" r="2.4" class="fill" /><circle cx="11" cy="33" r="2.4" class="fill" /><circle cx="37" cy="15" r="2.4" class="fill" /></svg>
                    }
                    @case ('database') {
                      <svg viewBox="0 0 48 48"><ellipse cx="24" cy="12" rx="14" ry="5.5" /><path d="M10 12v12c0 3 6.3 5.5 14 5.5S38 27 38 24V12" /><path d="M10 24v12c0 3 6.3 5.5 14 5.5S38 39 38 36V24" /></svg>
                    }
                    @case ('cloud') {
                      <svg viewBox="0 0 48 48"><path d="M14 36h21a8 8 0 0 0 1-15.9A11 11 0 0 0 15 18.5 8.8 8.8 0 0 0 14 36Z" /><path d="m19 27 4 4 7-8" /></svg>
                    }
                    @case ('shield') {
                      <svg viewBox="0 0 48 48"><path d="M24 6 10 11.5v10c0 9.5 6 16.8 14 20.5 8-3.7 14-11 14-20.5v-10z" /><path d="m17.5 24.5 4.5 4.5 8.5-9" /></svg>
                    }
                    @case ('chip') {
                      <svg viewBox="0 0 48 48"><rect x="12" y="12" width="24" height="24" rx="4" /><path d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6" /><path d="M24 17l1.8 5.2L31 24l-5.2 1.8L24 31l-1.8-5.2L17 24l5.2-1.8z" class="fill" /></svg>
                    }
                    @case ('chart') {
                      <svg viewBox="0 0 48 48"><path d="M8 8v32h32" /><path d="m14 31 8-8 6 5 11-11" /><path d="M31 17h8v8" /></svg>
                    }
                    @default {
                      <svg viewBox="0 0 48 48"><path d="M22 8a16 16 0 1 0 18 17" /><path d="M23 16a8 8 0 1 0 9 9" /><circle cx="24" cy="24" r="2" class="fill" /><path d="m24 24 14-14M31 9h8v8" /></svg>
                    }
                  }
                </span>
              }
              @for (s of c.steps; track s.label; let i = $index) {
                <button type="button" class="ring__node" [class.ring__node--on]="i === active()" [style.left.%]="nodes()[i].x" [style.top.%]="nodes()[i].y"
                        [attr.aria-label]="'Step ' + (i + 1) + ': ' + s.label" [attr.aria-current]="i === active() ? 'step' : null"
                        (click)="goTo(i)">0{{ i + 1 }}</button>
                <span class="ring__label" [class.ring__label--on]="i === active()" [style]="nodes()[i].label">{{ s.label }}</span>
              }
            </div>
          </div>
      </div>
      </div>
      </div>

      <!-- Narrow screens: all three cards in sequence -->
      <div class="wb-container stack-wrap">
        <div class="delivery__head delivery__head--stack" [class.delivery__head--center]="c.centered">
          <div class="delivery__head-main">
            <wb-pill-label icon="services">{{ c.eyebrow }}</wb-pill-label>
            <h2 class="wb-h2 delivery__title">{{ c.title }}@if (c.titleAccent) {{{ ' ' }}<span class="wb-accent">{{ c.titleAccent }}</span>}</h2>
            @if (c.subtitle) { <p class="delivery__subtitle">{{ c.subtitle }}</p> }
          </div>
          <p class="wb-lead delivery__lead">{{ c.lead }}</p>
        </div>
        <div class="stack">
          @for (s of c.steps; track s.label; let i = $index) {
            <article class="step-card" [class]="'step-card step-card--' + s.tone">
              <p class="step-card__count">0{{ i + 1 }} / 0{{ c.steps.length }}</p>
              <h3 class="step-card__title" [class.step-card__title--lg]="s.intro">{{ s.title }}</h3>
                @if (s.intro) { <p class="step-card__intro">{{ s.intro }}</p> }
              <ul class="step-card__points">
                @for (p of s.points; track p.text) {
                    <li>@if (p.strong) {<strong>{{ p.strong }}</strong>{{ ' ' }}}{{ p.text }}</li>
                  }
              </ul>
              @if (s.link) { <a class="step-card__link" [href]="s.link.href">{{ s.link.label }} <span aria-hidden="true">→</span></a> }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .delivery { background: #fff; font-family: var(--wb-font-body); overflow: clip; }
    .delivery__head { display: grid; grid-template-columns: 1fr 1fr; gap: var(--wb-space-sm) 64px; align-items: end; }
    .delivery__head-main .wb-h2 { font-size: min(var(--wb-fs-h2), 6.6svh); }
    .delivery__lead { font-size: min(var(--wb-fs-lead), 2.7svh); }
    .delivery__head--center { grid-template-columns: 1fr; justify-items: center; text-align: center; }
    .delivery__head--center .delivery__head-main { align-items: center; }
    .delivery__head--center .delivery__title { max-width: none; }
    .delivery__head--center .delivery__lead { max-width: 1000px; }
    .delivery__head-main { display: flex; flex-direction: column; align-items: flex-start; gap: min(var(--wb-space-xs), 1.6svh); }
    .delivery__title { max-width: 620px; }
    .delivery__subtitle { font-weight: 600; font-size: min(var(--wb-fs-lead), 2.7svh); color: var(--wb-blue); }

    /* Scroll track: one screen plus room to scroll through the three steps while the stage stays pinned */
    .track { position: relative; height: calc(100svh + 160svh); }
    .stage {
      position: sticky;
      top: 0;
      height: 100svh;
      display: grid;
      align-content: center;
      padding: 96px 0 clamp(20px, 3svh, 40px); /* top clears the condensed nav bar */
    }
    /* Height left for the card and ring after the heading block */
    .pin {
      --pin-h: clamp(300px, calc(100svh - 96px - 40px - min(var(--wb-fs-h2), 6.6svh) * 1.2 - 150px), 520px);
      margin-top: min(var(--wb-space-lg), 4.5svh);
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 48px;
      align-items: center;
    }
    .stack-wrap { display: none; }

    .step-card {
      min-height: var(--pin-h);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: clamp(24px, min(2.6vw, 4.4svh), 48px);
      border-radius: 28px;
      color: #fff;
      animation: card-in 0.55s var(--wb-ease-out) both;
    }
    @keyframes card-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    .step-card--teal { background: linear-gradient(135deg, #508fa1 0%, #4673a8 55%, #4166aa 100%); }
    .step-card--purple { background: linear-gradient(135deg, #574ba0 0%, #614494 55%, #6b3f8a 100%); }
    .step-card--green { background: linear-gradient(160deg, #2e7a62 0%, #31907a 55%, #35a08f 100%); }
    .step-card--rose { background: linear-gradient(135deg, #8a4566 0%, #744a86 55%, #5f4a9a 100%); }
    .step-card__title--lg { font-size: min(var(--wb-fs-h3), 5svh); font-weight: 700; line-height: 1.15; }
    .step-card__intro { margin-top: min(10px, 1.2svh); font-size: clamp(0.9375rem, min(1.04vw, 2.3svh), 1.25rem); line-height: 1.5; color: rgba(255, 255, 255, 0.92); }
    .step-card__count { font-weight: 600; font-size: var(--wb-fs-body); }
    .step-card__title { margin-top: var(--wb-space-xs); font-weight: 600; font-size: var(--wb-fs-card-title); line-height: 1.3; }
    .step-card__points { margin-top: min(var(--wb-space-sm), 2.6svh); display: flex; flex-direction: column; gap: min(10px, 1.2svh); }
    .step-card__points li { position: relative; padding-left: 34px; font-size: clamp(0.875rem, min(0.94vw, 2.2svh), 1.125rem); line-height: 1.55; }
    .step-card__points li::before {
      content: '';
      position: absolute;
      left: 0;
      /* Centred on the first line of text (1lh = one line; the cloud shape sits low in its box, hence the offset) */
      top: calc(0.75em - 8px);
      top: calc(0.5lh - 8px);
      width: 22px;
      height: 13px;
      background: #fff;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 14'%3E%3Cpath d='M6 14a5 5 0 0 1-.6-10A6 6 0 0 1 16.5 5 4.5 4.5 0 0 1 17 14Z'/%3E%3C/svg%3E") center / contain no-repeat;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 14'%3E%3Cpath d='M6 14a5 5 0 0 1-.6-10A6 6 0 0 1 16.5 5 4.5 4.5 0 0 1 17 14Z'/%3E%3C/svg%3E") center / contain no-repeat;
    }
    .step-card__points strong { font-weight: 700; }
    .step-card__link { margin-top: var(--wb-space-sm); align-self: flex-start; font-weight: 700; font-size: clamp(0.9375rem, 0.94vw, 1.125rem); text-decoration: underline; text-underline-offset: 4px; color: #fff; }
    .step-card__link span { display: inline-block; transition: transform 0.3s var(--wb-ease-out); }
    .step-card__link:hover span { transform: translateX(5px); }

    /* Ring: 400-unit box, radius 190, nodes at 0°, 120° and 240° */
    .ring { --c1: #76b4ea; --c2: #4f7de6; position: relative; width: min(100% - 200px, 420px, var(--pin-h) - 56px); aspect-ratio: 1; margin: 40px auto 0; }
    .ring--purple { --c1: #9b6fd6; --c2: #6b3fa0; }
    .ring--green { --c1: #45c08f; --c2: #2e9a78; }
    .ring--rose { --c1: #c25b7d; --c2: #8e4f9e; }
    .ring--has-bottom { width: min(100% - 200px, 420px, var(--pin-h) - 100px); margin-bottom: 36px; } /* room for the label under the bottom node */
    .ring__svg { width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 18px 30px rgba(79, 125, 230, 0.12)); }
    .ring__arc { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: stroke-dashoffset 0.8s var(--wb-ease-out), opacity 0.3s ease; }
    .ring__arc--on { stroke-dashoffset: 0; opacity: 1; }
    .ring__icon {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 20%;
      translate: -50% -50%;
      animation: icon-in 0.5s var(--wb-ease-out) both;
    }
    @keyframes icon-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: none; } }
    .ring__icon svg { width: 100%; height: auto; fill: none; stroke: var(--c2); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .ring__icon .fill { fill: var(--c2); stroke: none; }

    .ring__node {
      position: absolute;
      width: 12%;
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      translate: -50% -50%;
      border: 1.5px solid #dfe7f8;
      border-radius: 50%;
      background: #fff;
      font-weight: 600;
      font-size: var(--wb-fs-body);
      color: #1e1e1e;
      transition: background 0.4s ease, color 0.4s ease, transform 0.4s var(--wb-ease-spring), border-color 0.4s ease;
    }
    .ring__node:hover { border-color: var(--c2); }
    .ring__node--on { width: 16%; border-color: transparent; background: linear-gradient(135deg, var(--c1), var(--c2)); color: #fff; box-shadow: 0 6px 16px color-mix(in srgb, var(--c2) 40%, transparent); }

    .ring__label { position: absolute; font-size: var(--wb-fs-body); line-height: 1.4; color: var(--wb-ink-600); transition: color 0.4s ease; }
    .ring__label--on {
      font-weight: 600;
      background: linear-gradient(90deg, var(--c1), var(--c2));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    @media (prefers-reduced-motion: reduce) {
      .step-card, .ring__icon { animation: none; }
      .ring__arc { transition: none; }
    }
    @media (max-width: 900px) {
      .delivery__head { grid-template-columns: 1fr; }
      .track { display: none; }
      .stack-wrap { display: block; padding: var(--wb-section-y) 0; }
      .stack { display: flex; flex-direction: column; gap: var(--wb-gap-cards); margin-top: var(--wb-space-lg); }
      .stack .step-card { min-height: 0; animation: none; }
    }
  `,
})
export class AgenticDeliveryComponent {
  /** Page content; defaults to the Agentic AI copy. Other service pages pass their own. */
  readonly content = input<DeliveryContent>(AGENTIC_DELIVERY);
  protected get c(): DeliveryContent { return this.content(); }
  protected readonly active = signal(0);
  protected readonly step = computed(() => this.c.steps[this.active()]);

  /** Node i sits at i × (360° / steps) clockwise from the top of a radius-190 ring centred in a 400-unit box. */
  private angle(i: number): number { return (i * 2 * Math.PI) / this.c.steps.length; }

  /** Node centre (in % of the ring box) and where its label goes: above, below, right or left of the node. */
  protected readonly nodes = computed(() => this.c.steps.map((_, i) => {
    const a = this.angle(i);
    const x = +(50 + 47.5 * Math.sin(a)).toFixed(2);
    const y = +(50 - 47.5 * Math.cos(a)).toFixed(2);
    const sin = Math.sin(a), cos = Math.cos(a);
    let label: Record<string, string>;
    if (Math.abs(sin) < 0.2 && cos > 0) label = { left: x + '%', bottom: `calc(${100 - y + 8}% + 12px)`, translate: '-50% 0', 'white-space': 'nowrap' };
    else if (Math.abs(sin) < 0.2) label = { left: x + '%', top: `calc(${y + 8}% + 8px)`, translate: '-50% 0', 'white-space': 'nowrap' };
    else if (sin > 0) label = { left: `calc(${x}% + 9%)`, top: y + '%', translate: '0 -50%', width: '170px' };
    else label = { right: `calc(${+(100 - x).toFixed(2)}% + 9%)`, top: y + '%', translate: '0 -50%', width: '150px', 'text-align': 'right' };
    return { x, y, label };
  }));

  /** One arc per step, from its node to the next, coloured like the step. */
  protected readonly arcs = computed(() => this.c.steps.map((s, i) => {
    const p = (k: number) => `${(200 + 190 * Math.sin(this.angle(k))).toFixed(1)} ${(200 - 190 * Math.cos(this.angle(k))).toFixed(1)}`;
    return { tone: s.tone, d: `M${p(i)} A190 190 0 0 1 ${p(i + 1)}` };
  }));

  protected readonly hasBottomNode = computed(() => this.nodes().some(n => n.y > 90));

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let frame = 0;
      const update = () => {
        frame = 0;
        const track = this.track().nativeElement;
        if (!track.offsetParent) return; // hidden on narrow screens
        // Progress through the track (pinned for its whole length) picks the step
        const range = track.offsetHeight - window.innerHeight;
        const progress = range > 0 ? Math.min(0.999, Math.max(0, -track.getBoundingClientRect().top / range)) : 0;
        const next = Math.min(this.c.steps.length - 1, Math.floor(progress * this.c.steps.length));
        if (next !== this.active()) this.active.set(next);
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        cancelAnimationFrame(frame);
      });
    });
  }

  /** Scroll to the middle of a step's share of the track. */
  protected goTo(i: number): void {
    const track = this.track().nativeElement;
    const range = track.offsetHeight - window.innerHeight;
    const y = window.scrollY + track.getBoundingClientRect().top + range * ((i + 0.5) / this.c.steps.length);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
}
