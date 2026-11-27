import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../shared/button.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { enhanceInBrowser } from './browser-enhance';
import {
  DEFAULT_MODELS,
  EnhanceApiService,
  EnhanceModel,
  EngineStatus,
  JobView,
} from './enhance-api.service';

type Phase = 'idle' | 'uploading' | 'queued' | 'working' | 'done' | 'error';
type EngineState = 'checking' | 'ready' | 'browser';
type Mode = 'engine' | 'browser';

interface ResultView {
  format: 'png' | 'jpg';
  /** Downscaled preview used in the before/after slider. */
  preview: string;
  /** Full-resolution file behind the download button. */
  download: string;
  downloadName: string;
  width: number;
  height: number;
  bytes: number;
  ms: number;
  mode: Mode;
  capped: boolean;
}

interface Sample {
  name: string;
  url: string;
  thumb: string;
}

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'queued', label: 'Queued' },
  { key: 'enhancing', label: 'Enhancement' },
  { key: 'save', label: 'Download' },
];

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_PIXELS = 1_600_000;

@Component({
  selector: 'wb-enhance-page',
  imports: [ButtonComponent, PillLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .tool-hero { background: var(--wb-blue); color: var(--wb-white); padding: 106px 0 clamp(64px, 5vw, 96px); position: relative; overflow: hidden; }
    .tool-hero::after { content: ''; position: absolute; inset: 0; background-image:
      linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px);
      background-size: 100px 100px; mask-image: linear-gradient(to bottom, #000 40%, transparent 95%); pointer-events: none; }
    .tool-hero__inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--wb-space-lg); align-items: end; }
    .tool-hero h1 { font-family: var(--wb-font-body); font-weight: 700; font-size: var(--wb-fs-h2); line-height: 1.15; letter-spacing: -0.01em; margin: var(--wb-space-xs) 0 0; text-wrap: balance; }
    .tool-hero p { margin: var(--wb-space-xs) 0 0; font-size: var(--wb-fs-lead); line-height: 1.4; color: rgba(255,255,255,0.92); max-width: 34em; }
    .tool-hero__meta { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    .tool-hero__chip { border: 1px solid rgba(255,255,255,0.45); background: var(--wb-glass-fill); border-radius: var(--wb-radius-pill); padding: 7px 14px; font-size: 0.9rem; font-weight: 600; }

    .tool { position: relative; z-index: 2; margin-top: calc(-1 * clamp(24px, 3vw, 56px)); }
    .tool__card { background: var(--wb-white); border: 1px solid var(--wb-line); border-radius: 28px; box-shadow: 0 24px 60px rgba(8, 84, 92, 0.14); padding: clamp(20px, 2.4vw, 40px); }
    .tool__grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(20px, 2.2vw, 36px); }
    @media (max-width: 900px) { .tool-hero__inner { grid-template-columns: 1fr; } .tool-hero__meta { justify-content: flex-start; } .tool__grid { grid-template-columns: 1fr; } }

    /* File input (visually hidden, still focusable for assistive tech) */
    .file-input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

    /* Dropzone */
    .drop { border: 1.5px dashed var(--wb-blue-border); background: var(--wb-blue-chip); border-radius: 20px; min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; cursor: pointer; transition: border-color .2s ease, background-color .2s ease, transform .2s ease; position: relative; gap: 6px; }
    .drop:hover, .drop:focus-visible, .drop--over { border-color: var(--wb-blue); background: var(--wb-blue-tint); }
    .drop:focus-visible { outline: 3px solid var(--wb-yellow); outline-offset: 3px; }
    .drop--over { transform: scale(1.01); }
    .drop__icon { width: 64px; height: 64px; border-radius: 50%; background: var(--wb-blue); display: grid; place-items: center; margin-bottom: var(--wb-space-xs); }
    .drop__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-card-title); color: var(--wb-ink-900); }
    .drop__text { color: var(--wb-ink-600); font-size: 1rem; margin-top: 6px; max-width: 34ch; }
    .drop__cta { margin-top: var(--wb-space-xs); display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--wb-blue); color: var(--wb-blue-deep); background: var(--wb-white); border-radius: 999px; padding: 10px 20px; font-family: var(--wb-font-display); font-weight: 700; }
    .drop__samples { margin-top: var(--wb-space-sm); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .drop__samples-label { font-size: 0.9rem; color: var(--wb-ink-muted); font-weight: 600; }
    .sample-chip { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--wb-line); background: var(--wb-white); border-radius: 999px; padding: 6px 12px 6px 6px; font-size: 0.9rem; font-weight: 600; color: var(--wb-ink-800); transition: border-color .2s ease, box-shadow .2s ease; cursor: pointer; }
    .sample-chip:hover { border-color: var(--wb-blue); box-shadow: 0 4px 12px rgba(8, 84, 92, 0.12); }
    .sample-chip img { width: 32px; height: 32px; border-radius: 999px; object-fit: cover; }

    /* Staged upload */
    .staged { border: 1px solid var(--wb-line); border-radius: 20px; background: var(--wb-blue-chip); padding: 16px; display: grid; gap: 14px; }
    .staged__row { display: flex; gap: 16px; align-items: center; min-width: 0; }
    .staged__thumb { width: 96px; height: 96px; border-radius: 14px; object-fit: cover; background: var(--wb-white); border: 1px solid var(--wb-line); flex: none; }
    .staged__name { font-family: var(--wb-font-display); font-weight: 700; font-size: 1.05rem; color: var(--wb-ink-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .staged__meta { color: var(--wb-ink-600); font-size: 0.95rem; margin-top: 4px; }
    .staged__actions { display: flex; gap: 16px; flex-wrap: wrap; }
    .link-btn { background: none; border: 0; padding: 0; color: var(--wb-blue-deep); font: inherit; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
    .link-btn:hover { color: var(--wb-blue); }
    .link-btn:focus-visible { outline: 3px solid var(--wb-yellow); outline-offset: 3px; border-radius: 4px; }

    /* Options */
    .opts__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-card-title); color: var(--wb-ink-900); margin-bottom: var(--wb-space-xs); }
    .opt { margin-bottom: var(--wb-space-sm); }
    .opt__label { display: block; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wb-ink-muted); margin-bottom: 10px; }
    .seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 6px; }
    .seg__item { border: 1px solid var(--wb-line); border-radius: 14px; padding: 12px 10px; text-align: left; background: var(--wb-white); transition: border-color .2s ease, background-color .2s ease; cursor: pointer; }
    .seg__item strong { display: block; font-family: var(--wb-font-display); font-size: 0.98rem; color: var(--wb-ink-900); }
    .seg__item span { display: block; font-size: 0.82rem; color: var(--wb-ink-muted); margin-top: 2px; }
    .seg__item--active { border-color: var(--wb-blue); background: var(--wb-blue-tint); }
    .seg__item:focus-visible { outline: 3px solid var(--wb-yellow); outline-offset: 2px; }
    .seg__item:disabled { opacity: 0.5; cursor: not-allowed; }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .engine-note { display: flex; align-items: flex-start; gap: 8px; margin: 0 0 var(--wb-space-xs); font-size: 0.88rem; color: var(--wb-ink-muted); line-height: 1.45; }
    .engine-note__dot { width: 9px; height: 9px; border-radius: 50%; background: var(--wb-ink-muted); margin-top: 6px; flex: none; }
    .engine-note--ready { color: var(--wb-ink-600); }
    .engine-note--ready .engine-note__dot { background: #1f9d6b; }
    .engine-note--browser .engine-note__dot { background: var(--wb-amber); }

    .run { margin-top: var(--wb-space-sm); display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .run__hint { font-size: 0.9rem; color: var(--wb-ink-muted); }
    .run__error { margin-top: var(--wb-space-xs); background: #fdf0f1; border: 1px solid #f3c2c8; color: #8f1d2c; border-radius: 14px; padding: 12px 16px; font-size: 0.95rem; display: grid; gap: 8px; justify-items: start; }
    .run__notice { margin-top: var(--wb-space-xs); background: var(--wb-blue-chip); border: 1px solid var(--wb-line); color: var(--wb-ink-600); border-radius: 14px; padding: 10px 14px; font-size: 0.9rem; }

    /* Progress */
    .prog { margin-top: var(--wb-space-sm); }
    .prog__bar { height: 10px; border-radius: 999px; background: var(--wb-blue-chip); overflow: hidden; }
    .prog__fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--wb-blue) 0%, var(--wb-yellow) 120%); transition: width .35s var(--wb-ease-out, ease-out); }
    .prog__meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 10px; font-size: 0.88rem; color: var(--wb-ink-600); font-weight: 600; }
    .prog__steps { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.85rem; color: var(--wb-ink-muted); font-weight: 600; }
    .prog__step--active { color: var(--wb-blue-deep); }
    .prog__step--done { color: var(--wb-blue); }

    /* Result */
    .result { margin-top: var(--wb-space-lg); border-top: 1px solid var(--wb-line); padding-top: var(--wb-space-md); }
    .result__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: var(--wb-space-xs); }
    .result__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-h3); color: var(--wb-ink); }
    .result__stats { color: var(--wb-ink-muted); font-weight: 600; font-size: 0.95rem; }
    .mode-tag { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 3px 10px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; background: var(--wb-blue-chip); color: var(--wb-blue-deep); }
    .mode-tag--browser { background: #fff5e3; color: #8a5a05; }
    .compare { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--wb-line); background: repeating-conic-gradient(#f2f4f6 0% 25%, #fff 0% 50%) 50% / 24px 24px; touch-action: none; }
    .compare img { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
    .compare__after { position: absolute; inset: 0; clip-path: inset(0 0 0 var(--split, 50%)); }
    .compare__handle { position: absolute; top: 0; bottom: 0; left: var(--split, 50%); width: 3px; background: var(--wb-white); transform: translateX(-1.5px); box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 0 14px rgba(0,0,0,0.28); pointer-events: none; }
    .compare__knob { position: absolute; top: 50%; left: var(--split, 50%); transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: var(--wb-white); border: 2px solid var(--wb-blue); display: grid; place-items: center; box-shadow: 0 6px 18px rgba(8, 84, 92, 0.3); pointer-events: none; }
    .compare__input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }
    .compare__input:focus-visible { opacity: 0; }
    .compare:focus-within { outline: 3px solid var(--wb-yellow); outline-offset: 3px; }
    .compare__tag { position: absolute; top: 12px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(12, 40, 44, 0.72); color: #fff; border-radius: 999px; padding: 5px 12px; pointer-events: none; }
    .compare__tag--before { left: 12px; }
    .compare__tag--after { right: 12px; background: var(--wb-blue); }
    .result__actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: var(--wb-space-sm); }
    .result__note { font-size: 0.9rem; color: var(--wb-ink-muted); }
    .result__note a { color: var(--wb-blue-deep); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }

    /* How it works */
    .how { padding: var(--wb-section-y) 0; }
    .how__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--wb-gap-cards); margin-top: var(--wb-space-lg); }
    @media (max-width: 900px) { .how__grid { grid-template-columns: 1fr; } }
    .how__card { background: var(--wb-white); border: 1px solid var(--wb-line); border-radius: 22px; padding: clamp(20px, 2vw, 32px); }
    .how__num { font-family: var(--wb-font-numeral); font-weight: 700; font-size: 1rem; color: var(--wb-blue-deep); background: var(--wb-blue-chip); border-radius: 999px; width: 44px; height: 44px; display: grid; place-items: center; margin-bottom: var(--wb-space-xs); }
    .how__card h3 { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-card-title); color: var(--wb-ink-900); margin-bottom: 8px; }
    .how__card p { color: var(--wb-ink-600); line-height: 1.5; font-size: var(--wb-fs-body); }
    .how__foot { margin-top: var(--wb-space-lg); color: var(--wb-ink-muted); font-size: 0.95rem; max-width: 62em; }
    .how__foot a { color: var(--wb-blue-deep); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  `,
  template: `
    <header class="tool-hero">
      <div class="wb-container tool-hero__inner">
        <div>
          <wb-pill-label wbReveal icon="services">Clarity Upscaler</wb-pill-label>
          <h1>Make any supplier image <span style="color: var(--wb-yellow)">catalog-ready</span></h1>
          <p>Drop in a low-resolution product photo. The Clarity engine upscales it up to 4×, rebuilds edge detail and returns a crisp file that passes marketplace checks.</p>
        </div>
        <div class="tool-hero__meta">
          <span class="tool-hero__chip">CPU enhancement engine</span>
          <span class="tool-hero__chip">Up to 4× resolution</span>
          <span class="tool-hero__chip">PNG / JPG out</span>
        </div>
      </div>
    </header>

    <section class="tool wb-container" aria-label="Image upscaler tool">
      <div class="tool__card">
        <input #picker class="file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" (change)="onFile($event)" aria-label="Choose a supplier image to enhance" />

        <div class="tool__grid">
          <!-- Left: input -->
          <div>
            @if (!file()) {
              <div class="drop" [class.drop--over]="dragOver()" (click)="picker.click()" (keydown.enter)="picker.click()" (keydown.space)="picker.click(); $event.preventDefault()" (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)" role="button" tabindex="0" aria-label="Drop a supplier photo here or press Enter to choose a file">
                <span class="drop__icon" aria-hidden="true">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0 4.5 4.5M12 4 7.5 8.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <p class="drop__title">Drop a supplier photo here</p>
                <p class="drop__text">JPG, PNG, WebP, GIF or BMP — up to 12 MB and about 1.6 MP. Enhancement starts automatically.</p>
                <span class="drop__cta" aria-hidden="true">Choose an image</span>
              </div>
              <div class="drop__samples">
                <span class="drop__samples-label">No photo handy? Try a sample:</span>
                @for (s of samples; track s.name) {
                  <button type="button" class="sample-chip" (click)="useSample(s)" [disabled]="busy()">
                    <img [src]="s.thumb" alt="" width="32" height="32" />
                    {{ s.name }}
                  </button>
                }
              </div>
            } @else {
              <div class="staged">
                <div class="staged__row">
                  @if (previewUrl(); as src) {
                    <img class="staged__thumb" [src]="src" alt="The image you selected" />
                  }
                  <div style="min-width: 0">
                    <p class="staged__name" [title]="file()!.name">{{ file()!.name }}</p>
                    <p class="staged__meta">
                      @if (dimensions(); as d) { {{ d.width }}×{{ d.height }} px · }
                      {{ fmtBytes(file()!.size) }}
                    </p>
                  </div>
                </div>
                <div class="staged__actions">
                  <button type="button" class="link-btn" (click)="picker.click()" [disabled]="busy()">Change image</button>
                  <button type="button" class="link-btn" (click)="reset()" [disabled]="busy()">Remove</button>
                </div>
              </div>
            }
          </div>

          <!-- Right: options -->
          <div class="opts">
            <h2 class="opts__title">Enhancement settings</h2>

            <p class="engine-note" [class.engine-note--ready]="engineState() === 'ready'" [class.engine-note--browser]="engineState() === 'browser'" [attr.title]="engineHint()">
              <span class="engine-note__dot" aria-hidden="true"></span>
              <span>{{ engineLabel() }}</span>
            </p>

            <div class="opt">
              <span class="opt__label" id="engine-label">Engine</span>
              <div class="seg" role="group" aria-labelledby="engine-label">
                @for (m of models(); track m.id) {
                  <button type="button" class="seg__item" [class.seg__item--active]="model() === m.id" [disabled]="m.available === false || busy()" (click)="selectModel(m.id)" [attr.title]="m.about || null">
                    <strong>{{ m.label }}</strong>
                    <span>{{ m.available === false ? 'not installed' : estLabel(m) }}</span>
                  </button>
                }
              </div>
            </div>

            <div class="opt row2">
              <div>
                <span class="opt__label">Output size</span>
                <div class="seg" role="group" aria-label="Output size">
                  @for (o of [2, 3, 4]; track o) {
                    <button type="button" class="seg__item" [class.seg__item--active]="outscale() === o" [disabled]="busy()" (click)="outscale.set(o)">
                      <strong>{{ o }}×</strong>
                      <span>{{ sourceWidth() ? (sourceWidth()! * o) + 'px' : o * 1000 + 'px+' }}</span>
                    </button>
                  }
                </div>
              </div>
              <div>
                <span class="opt__label" id="fmt-label">Format</span>
                <div class="seg" role="group" aria-labelledby="fmt-label">
                  <button type="button" class="seg__item" [class.seg__item--active]="format() === 'png'" [disabled]="busy()" (click)="format.set('png')"><strong>PNG</strong><span>lossless</span></button>
                  <button type="button" class="seg__item" [class.seg__item--active]="format() === 'jpg'" [disabled]="busy()" (click)="format.set('jpg')"><strong>JPG</strong><span>smaller</span></button>
                </div>
              </div>
            </div>

            <div class="run">
              <wb-button (click)="run()" [disabled]="!file() || busy()">
                {{ busy() ? 'Enhancing…' : phase() === 'done' ? 'Enhance again' : 'Enhance image' }}
              </wb-button>
              @if (busy()) {
                <button type="button" class="link-btn" (click)="cancel()">Cancel</button>
              }
              <span class="run__hint">{{ runHint() }}</span>
            </div>

            @if (errorMessage(); as err) {
              <p class="run__error" role="alert">
                <span>{{ err }}</span>
                @if (file()) { <button type="button" class="link-btn" (click)="run()">Try again</button> }
              </p>
            }
            @if (notice(); as note) {
              <p class="run__notice" role="status">{{ note }}</p>
            }

            @if (showProgress()) {
              <div class="prog" aria-live="polite">
                <div class="prog__bar" role="progressbar" [attr.aria-valuenow]="progress()" aria-valuemin="0" aria-valuemax="100">
                  <div class="prog__fill" [style.width.%]="progress()"></div>
                </div>
                <div class="prog__meta">
                  <span>{{ stageText() }}</span>
                  <span>{{ displayProgress() }}%@if (elapsed() > 0) { · {{ elapsed() }}s }</span>
                </div>
                <div class="prog__steps">
                  @for (s of steps; track s.key) {
                    <span class="prog__step" [class.prog__step--done]="stepIndex() > $index" [class.prog__step--active]="stepIndex() === $index">{{ s.label }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Result -->
        @if (phase() === 'done' && result(); as r) {
          <div class="result">
            <div class="result__head">
              <h2 class="result__title">Catalog-ready result</h2>
              <p class="result__stats">
                {{ job()?.input?.width || dimensions()?.width }}×{{ job()?.input?.height || dimensions()?.height }} → <strong>{{ r.width }}×{{ r.height }}</strong>
                · {{ fmtBytes(r.bytes) }} · {{ (r.ms / 1000).toFixed(1) }}s
                <span class="mode-tag" [class.mode-tag--browser]="r.mode === 'browser'">{{ r.mode === 'engine' ? 'AI engine' : 'Browser preview' }}</span>
              </p>
            </div>
            <div class="compare" [style]="{ '--split': split() + '%' }">
              @if (previewUrl(); as before) { <img [src]="before" alt="The original supplier image" /> }
              <img class="compare__after" [src]="r.preview" alt="The enhanced image" />
              <span class="compare__handle" aria-hidden="true"></span>
              <span class="compare__knob" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3 2 8l3 5M11 3l3 5-3 5" stroke="#0c7e88" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="compare__tag compare__tag--before">Supplier</span>
              <span class="compare__tag compare__tag--after">Clarity</span>
              <input class="compare__input" type="range" min="0" max="100" [value]="split()" (input)="onSplit($event)" aria-label="Compare the original and enhanced image" />
            </div>
            <div class="result__actions">
              <wb-button [href]="r.download" [download]="r.downloadName">Download {{ r.format === 'jpg' ? 'JPG' : 'PNG' }}</wb-button>
              <wb-button variant="outline" (click)="run()">Enhance again</wb-button>
              <wb-button variant="outline" (click)="reset()">New image</wb-button>
              <span class="result__note">
                Drag the handle to compare · <a [href]="r.download" target="_blank" rel="noopener">open full size</a>
                @if (r.capped) { · preview capped to fit browser memory }
              </span>
            </div>
          </div>
        }
      </div>
    </section>

    <section class="how" aria-labelledby="how-title">
      <div class="wb-container">
        <wb-pill-label wbReveal icon="services">Under the hood</wb-pill-label>
        <h2 class="wb-h2" id="how-title" wbReveal style="margin-top: var(--wb-space-xs)">From supplier inbox<br />to catalog in one pass</h2>
        <div class="how__grid">
          <div class="how__card" wbReveal>
            <span class="how__num">01</span>
            <h3>Upload any supplier photo</h3>
            <p>Blurry thumbnails, compressed JPGs, screenshots — if a product is visible, the engine can work with it. Files stay on the server and are deleted automatically.</p>
          </div>
          <div class="how__card" wbReveal [wbRevealDelay]="120">
            <span class="how__num">02</span>
            <h3>The Clarity engine restores detail</h3>
            <p>Neural super-resolution rebuilds edges, text and fabric grain instead of stretching pixels, using tiled inference so even large photos run on a CPU.</p>
          </div>
          <div class="how__card" wbReveal [wbRevealDelay]="240">
            <span class="how__num">03</span>
            <h3>Download a catalog-ready file</h3>
            <p>Pick 2× to 4× output and PNG or JPG. What lands in your catalog meets marketplace resolution rules without a reshoot request to the vendor.</p>
          </div>
        </div>
        <p class="how__foot" wbReveal>
          This demo runs the enhancement models on this server's CPU, one image at a time, and keeps results for two hours.
          Batch processing, PIM sync and compliance checks are part of the full <a href="/products/batchforge">BatchForge</a> platform.
        </p>
      </div>
    </section>
  `,
})
export class EnhancePageComponent implements OnDestroy {
  private readonly api = inject(EnhanceApiService);
  private readonly http = inject(HttpClient);
  private readonly subs = new Subscription();

  protected readonly steps = STEPS;

  protected readonly models = signal<EnhanceModel[]>(DEFAULT_MODELS);
  protected readonly model = signal('balanced');
  protected readonly outscale = signal(4);
  protected readonly format = signal<'png' | 'jpg'>('png');

  protected readonly engine = signal<EngineStatus | null>(null);
  protected readonly engineState = signal<EngineState>('checking');

  protected readonly phase = signal<Phase>('idle');
  protected readonly progress = signal(0);
  protected readonly progressLabel = signal('');
  protected readonly elapsed = signal(0);
  protected readonly dragOver = signal(false);
  protected readonly split = signal(50);

  protected readonly file = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly dimensions = signal<{ width: number; height: number } | null>(null);

  protected readonly job = signal<JobView | null>(null);
  protected readonly result = signal<ResultView | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly notice = signal<string | null>(null);

  protected readonly samples: Sample[] = [
    { name: 'Sneaker', url: 'assets/samples/sneaker-lowres.jpg', thumb: 'assets/samples/sneaker-lowres.jpg' },
    { name: 'Headphones', url: 'assets/samples/headphones-lowres.jpg', thumb: 'assets/samples/headphones-lowres.jpg' },
  ];

  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private estimatedMs = 0;
  private pollFailures = 0;
  private clock: ReturnType<typeof setInterval> | null = null;
  private jobId: string | null = null;
  private fallback = false;
  private browserResultUrl: string | null = null;
  private runToken = 0;

  protected readonly busy = computed(() => ['uploading', 'queued', 'working'].includes(this.phase()));

  /**
   * The worker reports real tile counts, but a single-pass job only reports at
   * its start and end. Interpolating against the server's estimate keeps the
   * bar moving without ever claiming more than the job has actually reached.
   */
  protected readonly displayProgress = computed(() => {
    const actual = this.progress();
    if (this.phase() !== 'working' || this.fallback || !this.estimatedMs) return actual;
    const ratio = Math.min(0.9, (this.elapsed() * 1000) / Math.max(1500, this.estimatedMs));
    return Math.min(92, Math.max(actual, Math.round(10 + ratio * 80)));
  });
  protected readonly showProgress = computed(() => this.busy());
  protected readonly sourceWidth = computed(() => this.dimensions()?.width ?? null);

  protected readonly runHint = computed(() => {
    if (this.engineState() === 'browser') return 'Runs in your browser, no server needed.';
    if (this.busy()) return 'Keep this tab open — the file downloads when it is ready.';
    if (this.model() === 'max-detail') return 'Photo Max Detail is slow on CPU — about a minute per megapixel.';
    return 'Runs on this server’s CPU — usually a few seconds.';
  });

  protected readonly engineLabel = computed(() => {
    switch (this.engineState()) {
      case 'checking':
        return 'Checking the enhancement engine…';
      case 'ready':
        return 'Enhancement engine ready';
      default:
        return 'Browser preview mode — no AI worker on this host, so the upscale runs in your browser.';
    }
  });

  protected readonly engineHint = computed(() => {
    const engine = this.engine();
    return engine?.hint || engine?.detail || '';
  });

  protected readonly stageText = computed(() => {
    if (this.phase() === 'uploading') return 'Uploading image';
    if (this.phase() === 'queued') {
      const position = this.job()?.queuePosition || 0;
      return position > 1 ? `Queued — position ${position}` : 'Queued';
    }
    if (this.phase() === 'working') {
      if (this.fallback) return this.progressLabel() || 'Enhancing in your browser';
      const job = this.job();
      switch (job?.stage) {
        case 'load':
          return 'Loading the enhancement engine';
        case 'enhancing': {
          const tiles = job?.tiles;
          return tiles?.total ? `Enhancing detail — tile ${tiles.done} of ${tiles.total}` : 'Enhancing detail';
        }
        case 'resize':
          return 'Resizing to your chosen output';
        case 'save':
          return 'Writing your catalog-ready file';
        default:
          return 'Enhancing detail';
      }
    }
    return '';
  });

  protected readonly stepIndex = computed(() => {
    switch (this.phase()) {
      case 'uploading':
        return 0;
      case 'queued':
        return 1;
      case 'working':
        return this.job()?.stage === 'save' ? 3 : 2;
      case 'done':
        return 4;
      default:
        return 0;
    }
  });

  constructor() {
    this.subs.add(
      this.api.health().subscribe({
        next: (health) => {
          this.engine.set(health.engine);
          this.engineState.set(health.engine.available ? 'ready' : 'browser');
          if (health.models?.length) {
            // Per-engine availability only matters in AI mode; in browser mode
            // every engine falls back to the same resampler, so keep them usable.
            const models = health.engine.available
              ? health.models
              : health.models.map((m) => ({ ...m, available: true }));
            this.models.set(this.mergeModels(models));
            const firstAvailable = models.find((m) => m.available !== false);
            if (firstAvailable && !models.find((m) => m.id === this.model())?.available) {
              this.model.set(firstAvailable.id);
            }
          }
          if (!health.engine.available) {
            this.notice.set(
              'Preview mode: this page upscales in your browser. You still get a real, downloadable file — connect the AI engine for maximum detail.',
            );
          }
        },
        error: () => {
          this.engineState.set('browser');
          this.notice.set(
            'The enhancement API is not reachable from this page, so images are upscaled in your browser.',
          );
        },
      }),
    );
  }

  /* --------------------------------- input --------------------------------- */

  protected onDragOver(ev: DragEvent): void {
    ev.preventDefault();
    this.dragOver.set(true);
  }

  protected onDrop(ev: DragEvent): void {
    ev.preventDefault();
    this.dragOver.set(false);
    const dropped = ev.dataTransfer?.files?.[0];
    if (dropped) void this.accept(dropped);
  }

  protected onFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const picked = input.files?.[0];
    input.value = '';
    if (picked) void this.accept(picked);
  }

  protected useSample(sample: Sample): void {
    if (this.busy()) return;
    this.errorMessage.set(null);
    this.subs.add(
      this.http.get(sample.url, { responseType: 'blob' }).subscribe({
        next: (blob) => void this.accept(new File([blob], `${sample.name.toLowerCase()}-supplier.jpg`, { type: 'image/jpeg' })),
        error: () => this.errorMessage.set('Could not load that sample image. Please choose your own file.'),
      }),
    );
  }

  private async accept(file: File): Promise<void> {
    if (this.busy()) return;

    if (!file.type.startsWith('image/') && !/\.(jpe?g|png|webp|gif|bmp)$/i.test(file.name)) {
      this.errorMessage.set('That does not look like an image. Use a JPG, PNG, WebP, GIF or BMP file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      this.errorMessage.set(`That file is ${this.fmtBytes(file.size)}. The limit is 12 MB — try a smaller supplier photo.`);
      return;
    }

    const dims = await this.readDimensions(file);
    if (dims && dims.width * dims.height > MAX_PIXELS) {
      this.errorMessage.set(
        `That image is ${dims.width}×${dims.height}px. The CPU engine accepts up to 1.6 MP — resize it to about 1264×1264 first.`,
      );
      return;
    }

    this.stopTimers();
    this.revokePreview();
    this.errorMessage.set(null);

    this.file.set(file);
    this.dimensions.set(dims);
    this.previewUrl.set(URL.createObjectURL(file));
    this.job.set(null);
    this.result.set(null);
    this.clearBrowserResult();
    this.phase.set('idle');

    // Enhancement starts immediately — one drop is the whole interaction.
    await this.run();
  }

  private readDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  /* --------------------------------- running -------------------------------- */

  protected async run(): Promise<void> {
    const file = this.file();
    if (!file || this.busy()) return;

    const token = ++this.runToken;
    this.errorMessage.set(null);
    this.job.set(null);
    this.result.set(null);
    this.clearBrowserResult();
    this.fallback = false;
    this.estimatedMs = 0;
    this.pollFailures = 0;
    this.startClock();

    if (this.engineState() === 'browser') {
      await this.runInBrowser();
      return;
    }

    this.phase.set('uploading');
    this.progress.set(4);
    this.progressLabel.set('Uploading image');

    try {
      const created = await firstValueFrom(
        this.api.create(file, { model: this.model(), outscale: this.outscale(), format: this.format() }),
      );
      if (token !== this.runToken) {
        // The visitor canceled or picked another file while the upload finished.
        this.subs.add(this.api.cancel(created.id).subscribe({ error: () => undefined }));
        return;
      }
      this.jobId = created.id;
      this.estimatedMs = created.estimatedMs || 0;
      this.phase.set('queued');
      this.progress.set(6);
      this.schedulePoll(created.id, token);
    } catch (err) {
      if (token !== this.runToken) return;
      if (this.api.isEngineUnavailable(err)) {
        this.engineState.set('browser');
        this.notice.set('The AI enhancement worker is not available here, so this image was upscaled in your browser.');
        await this.runInBrowser();
        return;
      }
      this.stopTimers();
      this.phase.set('error');
      this.progress.set(0);
      this.errorMessage.set(this.api.messageFor(err));
    }
  }

  private schedulePoll(id: string, token: number): void {
    this.pollTimer = setTimeout(() => {
      this.subs.add(
        this.api.job(id).subscribe({
          next: (job) => {
            if (token !== this.runToken) return;
            this.job.set(job);
            if (job.status === 'queued') {
              this.phase.set('queued');
              this.progress.set(Math.max(6, job.progress || 6));
            } else if (job.status === 'processing') {
              this.phase.set('working');
              this.progress.set(Math.max(10, job.progress || 10));
            } else if (job.status === 'done') {
              this.completeEngineJob(job);
              return;
            } else if (job.status === 'error' || job.status === 'canceled') {
              this.stopTimers();
              this.phase.set(job.status === 'canceled' ? 'idle' : 'error');
              this.errorMessage.set(job.status === 'canceled' ? null : job.error || 'The enhancement failed.');
              this.progress.set(0);
              return;
            }
            this.schedulePoll(id, token);
          },
          error: () => {
            if (token !== this.runToken) return;
            // A transient status failure should not kill a running job, but a
            // server that has gone away must not poll forever.
            this.pollFailures += 1;
            if (this.pollFailures > 10) {
              this.stopTimers();
              this.phase.set('error');
              this.progress.set(0);
              this.errorMessage.set('Lost contact with the enhancement server. Check your connection and try again.');
              return;
            }
            this.schedulePoll(id, token);
          },
        }),
      );
    }, 500);
  }

  private completeEngineJob(job: JobView): void {
    this.stopTimers();
    this.job.set(job);
    if (!job.files || !job.output) {
      this.phase.set('error');
      this.errorMessage.set('The job finished but no output file was returned. Please try again.');
      return;
    }
    this.phase.set('done');
    this.progress.set(100);
    this.split.set(50);
    this.result.set({
      format: job.format,
      preview: job.files.preview,
      download: job.files.result,
      downloadName: this.downloadName(job.format, job.outscale),
      width: job.output.width,
      height: job.output.height,
      bytes: job.output.bytes,
      ms: job.output.ms || 0,
      mode: 'engine',
      capped: false,
    });
  }

  private async runInBrowser(): Promise<void> {
    const file = this.file();
    if (!file) return;
    const token = this.runToken;
    this.fallback = true;
    this.phase.set('working');
    this.progress.set(4);
    this.progressLabel.set('Preparing your image');

    try {
      const output = await enhanceInBrowser(file, this.outscale(), this.format(), (percent, label) => {
        if (token !== this.runToken) return;
        this.progress.set(Math.max(4, percent));
        this.progressLabel.set(label);
      });
      if (token !== this.runToken) return; // canceled while resampling
      if (this.browserResultUrl) URL.revokeObjectURL(this.browserResultUrl);
      this.browserResultUrl = URL.createObjectURL(output.blob);
      this.stopTimers();
      this.phase.set('done');
      this.progress.set(100);
      this.split.set(50);
      this.result.set({
        format: this.format(),
        preview: this.browserResultUrl,
        download: this.browserResultUrl,
        downloadName: this.downloadName(this.format()),
        width: output.width,
        height: output.height,
        bytes: output.blob.size,
        ms: output.ms,
        mode: 'browser',
        capped: output.capped,
      });
    } catch (err) {
      if (token !== this.runToken) return;
      this.stopTimers();
      this.phase.set('error');
      this.progress.set(0);
      this.errorMessage.set(err instanceof Error ? err.message : 'The image could not be processed.');
    }
  }

  protected cancel(): void {
    if (!this.busy()) return;
    this.runToken += 1;
    this.stopTimers();
    if (this.jobId && !this.fallback) {
      this.subs.add(this.api.cancel(this.jobId).subscribe({ error: () => undefined }));
    }
    this.jobId = null;
    this.phase.set('idle');
    this.progress.set(0);
    this.progressLabel.set('');
    this.notice.set('Enhancement canceled.');
    this.job.set(null);
  }

  /* --------------------------------- helpers -------------------------------- */

  protected selectModel(id: string): void {
    const model = this.models().find((m) => m.id === id);
    if (model?.available === false) return;
    this.model.set(id);
  }

  protected estLabel(model: EnhanceModel): string {
    if (model.id === 'max-detail') return 'slowest, most detail';
    if (model.id === 'sketch') return 'fastest';
    return 'balanced';
  }

  protected fmtBytes(bytes: number): string {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  protected onSplit(ev: Event): void {
    this.split.set(Number((ev.target as HTMLInputElement).value));
  }

  protected reset(): void {
    if (this.busy()) return;
    this.runToken += 1;
    this.stopTimers();
    this.revokePreview();
    this.clearBrowserResult();
    this.file.set(null);
    this.dimensions.set(null);
    this.job.set(null);
    this.result.set(null);
    this.jobId = null;
    this.phase.set('idle');
    this.progress.set(0);
    this.progressLabel.set('');
    this.errorMessage.set(null);
    this.notice.set(null);
  }

  private mergeModels(incoming: EnhanceModel[]): EnhanceModel[] {
    const byId = new Map(incoming.map((m) => [m.id, m]));
    return DEFAULT_MODELS.map((fallback) => ({ ...fallback, ...byId.get(fallback.id) }));
  }

  private downloadName(format: 'png' | 'jpg', scale = this.outscale()): string {
    const base = (this.file()?.name || 'supplier-image').replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi, '-').slice(0, 60);
    return `clarity-${base}-${scale}x.${format}`;
  }

  private startClock(): void {
    this.stopClock();
    this.elapsed.set(0);
    this.clock = setInterval(() => this.elapsed.update((s) => s + 1), 1000);
  }

  private stopClock(): void {
    if (this.clock) clearInterval(this.clock);
    this.clock = null;
  }

  private stopTimers(): void {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    this.pollTimer = null;
    this.stopClock();
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
  }

  private clearBrowserResult(): void {
    if (this.browserResultUrl) URL.revokeObjectURL(this.browserResultUrl);
    this.browserResultUrl = null;
  }

  ngOnDestroy(): void {
    this.runToken += 1;
    if (this.busy() && this.jobId && !this.fallback) {
      this.api.cancel(this.jobId).subscribe({ error: () => undefined });
    }
    this.stopTimers();
    this.subs.unsubscribe();
    this.revokePreview();
    this.clearBrowserResult();
  }
}
