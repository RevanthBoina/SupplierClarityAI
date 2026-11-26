import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../../shared/button.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';

interface ModelInfo { id: string; label: string; scale: number; avgMsPerMp: number; }
type Phase = 'idle' | 'uploading' | 'queued' | 'working' | 'done' | 'error';

interface JobView {
  id: string;
  status: string;
  stage: string;
  tiles?: { done: number; total: number };
  error?: string;
  input: { name: string; bytes: number; width: number; height: number };
  output?: { file: string; bytes: number; width: number; height: number; ms: number | null };
  files?: { result: string; preview: string; original: string };
}

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'queued', label: 'Queued' },
  { key: 'enhancing', label: 'AI enhancement' },
  { key: 'save', label: 'Catalog-ready file' },
];

@Component({
  selector: 'wb-enhance-page',
  imports: [ButtonComponent, PillLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .tool-hero { background: var(--wb-blue); color: var(--wb-white); padding: 32px 0 clamp(40px, 3vw, 64px); position: relative; overflow: hidden; }
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

    /* Dropzone */
    .drop { border: 1.5px dashed var(--wb-blue-border); background: var(--wb-blue-chip); border-radius: 20px; min-height: 320px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 24px; cursor: pointer; transition: border-color .2s ease, background-color .2s ease, transform .2s ease; position: relative; }
    .drop:hover, .drop--over { border-color: var(--wb-blue); background: var(--wb-blue-tint); }
    .drop--over { transform: scale(1.01); }
    .drop__icon { width: 64px; height: 64px; border-radius: 50%; background: var(--wb-blue); display: grid; place-items: center; margin: 0 auto var(--wb-space-xs); }
    .drop__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-card-title); color: var(--wb-ink-900); }
    .drop__text { color: var(--wb-ink-600); font-size: 1rem; margin-top: 6px; }
    .drop__input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .drop__samples { margin-top: var(--wb-space-sm); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .drop__samples-label { font-size: 0.9rem; color: var(--wb-ink-muted); font-weight: 600; }
    .sample-chip { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--wb-line); background: var(--wb-white); border-radius: 999px; padding: 6px 12px 6px 6px; font-size: 0.9rem; font-weight: 600; color: var(--wb-ink-800); transition: border-color .2s ease, box-shadow .2s ease; }
    .sample-chip:hover { border-color: var(--wb-blue); box-shadow: 0 4px 12px rgba(8, 84, 92, 0.12); }
    .sample-chip img { width: 32px; height: 32px; border-radius: 999px; object-fit: cover; }

    /* Options */
    .opts__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-card-title); color: var(--wb-ink-900); margin-bottom: var(--wb-space-xs); }
    .opt { margin-bottom: var(--wb-space-sm); }
    .opt__label { display: block; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wb-ink-muted); margin-bottom: 10px; }
    .seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 6px; }
    .seg__item { border: 1px solid var(--wb-line); border-radius: 14px; padding: 12px 10px; text-align: left; background: var(--wb-white); transition: border-color .2s ease, background-color .2s ease; }
    .seg__item strong { display: block; font-family: var(--wb-font-display); font-size: 0.98rem; color: var(--wb-ink-900); }
    .seg__item span { display: block; font-size: 0.82rem; color: var(--wb-ink-muted); margin-top: 2px; }
    .seg__item--active { border-color: var(--wb-blue); background: var(--wb-blue-tint); }
    .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .run { margin-top: var(--wb-space-sm); display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .run__hint { font-size: 0.9rem; color: var(--wb-ink-muted); }
    .run__error { margin-top: var(--wb-space-xs); background: #fdf0f1; border: 1px solid #f3c2c8; color: #8f1d2c; border-radius: 14px; padding: 12px 16px; font-size: 0.95rem; }

    /* Progress */
    .prog { margin-top: var(--wb-space-sm); }
    .prog__bar { height: 10px; border-radius: 999px; background: var(--wb-blue-chip); overflow: hidden; }
    .prog__fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--wb-blue) 0%, var(--wb-yellow) 120%); transition: width .4s var(--wb-ease-out); }
    .prog__steps { display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.85rem; color: var(--wb-ink-muted); font-weight: 600; }
    .prog__step--active { color: var(--wb-blue-deep); }
    .prog__step--done { color: var(--wb-blue); }

    /* Result */
    .result { margin-top: var(--wb-space-lg); }
    .result__head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: var(--wb-space-xs); }
    .result__title { font-family: var(--wb-font-display); font-weight: 700; font-size: var(--wb-fs-h3); color: var(--wb-ink); }
    .result__stats { color: var(--wb-ink-muted); font-weight: 600; font-size: 0.95rem; }
    .compare { position: relative; border-radius: 20px; overflow: hidden; border: 1px solid var(--wb-line); background: repeating-conic-gradient(#f2f4f6 0% 25%, #fff 0% 50%) 50% / 24px 24px; touch-action: none; }
    .compare img { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
    .compare__after { position: absolute; inset: 0; clip-path: inset(0 0 0 var(--split, 50%)); }
    .compare img.before { filter: none; }
    .compare__handle { position: absolute; top: 0; bottom: 0; left: var(--split, 50%); width: 3px; background: var(--wb-white); transform: translateX(-1.5px); box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 0 14px rgba(0,0,0,0.28); pointer-events: none; }
    .compare__knob { position: absolute; top: 50%; left: var(--split, 50%); transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: var(--wb-white); border: 2px solid var(--wb-blue); display: grid; place-items: center; box-shadow: 0 6px 18px rgba(8, 84, 92, 0.3); pointer-events: none; }
    .compare__input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }
    .compare__tag { position: absolute; top: 12px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(12, 40, 44, 0.72); color: #fff; border-radius: 999px; padding: 5px 12px; pointer-events: none; }
    .compare__tag--before { left: 12px; }
    .compare__tag--after { right: 12px; background: var(--wb-blue); }
    .result__actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: var(--wb-space-sm); }
    .result__note { font-size: 0.9rem; color: var(--wb-ink-muted); }

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
  `,
  template: `
    <header class="tool-hero">
      <div class="wb-container tool-hero__inner">
        <div>
          <wb-pill-label wbReveal icon="services">Clarity Upscaler</wb-pill-label>
          <h1>Make any supplier image <span style="color: var(--wb-yellow)">catalog-ready</span></h1>
          <p>Upload a low-resolution product photo and the Real-ESRGAN engine upscales it 4×, restores edge detail and returns a crisp file that passes marketplace checks.</p>
        </div>
        <div class="tool-hero__meta">
          <span class="tool-hero__chip">Real-ESRGAN engine</span>
          <span class="tool-hero__chip">Up to 4× resolution</span>
          <span class="tool-hero__chip">PNG / JPG out</span>
        </div>
      </div>
    </header>

    <section class="tool wb-container" aria-label="Image upscaler tool">
      <div class="tool__card">
        <div class="tool__grid">
          <!-- Left: input -->
          <div>
            @if (!job()) {
              <label class="drop" [class.drop--over]="dragOver()" (dragover)="onDragOver($event)" (dragleave)="dragOver.set(false)" (drop)="onDrop($event)">
                <input class="drop__input" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" (change)="onFile($event)" />
                <div>
                  <span class="drop__icon" aria-hidden="true">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0 4.5 4.5M12 4 7.5 8.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
                  </span>
                  <p class="drop__title">Drop a supplier photo here</p>
                  <p class="drop__text">JPG, PNG, WebP, GIF or BMP — up to 12 MB and ~1.6 MP</p>
                </div>
              </label>
              <div class="drop__samples">
                <span class="drop__samples-label">No photo handy? Try a sample:</span>
                @for (s of samples; track s.name) {
                  <button type="button" class="sample-chip" (click)="useSample(s)">
                    <img [src]="s.thumb" alt="" width="32" height="32" />
                    {{ s.name }}
                  </button>
                }
              </div>
            } @else {
              <div class="drop" style="cursor: default; min-height: 0; padding: 18px;">
                <div style="display: flex; gap: 16px; align-items: center; width: 100%;">
                  <img [src]="job()!.files?.original || objectUrl()" alt="Original upload" style="width: 74px; height: 74px; border-radius: 14px; object-fit: cover;" />
                  <div style="text-align: left; min-width: 0;">
                    <p class="drop__title" style="font-size: 1.05rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ job()!.input.name }}</p>
                    <p class="drop__text">{{ job()!.input.width }}×{{ job()!.input.height }} px · {{ fmtBytes(job()!.input.bytes) }}</p>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Right: options -->
          <div class="opts">
            <h2 class="opts__title">Enhancement settings</h2>
            <div class="opt">
              <span class="opt__label">Engine</span>
              <div class="seg" role="group" aria-label="Engine">
                @for (m of models(); track m.id) {
                  <button type="button" class="seg__item" [class.seg__item--active]="model() === m.id" (click)="model.set(m.id)">
                    <strong>{{ m.label }}</strong>
                    <span>{{ estLabel(m) }}</span>
                  </button>
                }
              </div>
            </div>
            <div class="opt row2">
              <div>
                <span class="opt__label" for="outscale">Output size</span>
                <div class="seg" role="group" aria-label="Output size">
                  @for (o of [2, 3, 4]; track o) {
                    <button type="button" class="seg__item" [class.seg__item--active]="outscale() === o" (click)="outscale.set(o)">
                      <strong>{{ o }}×</strong>
                      <span>{{ 440 * o }}px+</span>
                    </button>
                  }
                </div>
              </div>
              <div>
                <span class="opt__label" id="fmt-label">Format</span>
                <div class="seg" role="group" aria-labelledby="fmt-label">
                  <button type="button" class="seg__item" [class.seg__item--active]="format() === 'png'" (click)="format.set('png')"><strong>PNG</strong><span>lossless</span></button>
                  <button type="button" class="seg__item" [class.seg__item--active]="format() === 'jpg'" (click)="format.set('jpg')"><strong>JPG</strong><span>smaller</span></button>
                </div>
              </div>
            </div>

            <div class="run">
              <wb-button (click)="run()">{{ phase() === 'idle' ? 'Enhance image' : 'Enhance again' }}</wb-button>
              <span class="run__hint">Runs on this server's CPU — usually 3–15 seconds.</span>
            </div>

            @if (errorMessage(); as err) {
              <p class="run__error" role="alert">{{ err }}</p>
            }

            @if (showProgress()) {
              <div class="prog" aria-live="polite">
                <div class="prog__bar"><div class="prog__fill" [style.width.%]="progressPct()"></div></div>
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
        @if (phase() === 'done' && job()?.files; as files) {
          <div class="result">
            <div class="result__head">
              <h2 class="result__title">Catalog-ready result</h2>
              <p class="result__stats">
                {{ job()!.input.width }}×{{ job()!.input.height }} → <strong>{{ job()!.output?.width }}×{{ job()!.output?.height }}</strong>
                · {{ fmtBytes(job()!.output?.bytes || 0) }} · {{ ((job()!.output?.ms || 0) / 1000).toFixed(1) }}s
              </p>
            </div>
            <div class="compare" [style.--split.%]="split()">
              <img class="before" [src]="files.preview" alt="Original supplier image" />
              <img class="compare__after" [src]="files.preview" [attr.aria-label]="'Enhanced image'" />
              <span class="compare__handle" aria-hidden="true"></span>
              <span class="compare__knob" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3 2 8l3 5M11 3l3 5-3 5" stroke="#0c7e88" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="compare__tag compare__tag--before">Supplier</span>
              <span class="compare__tag compare__tag--after">Clarity</span>
              <input class="compare__input" type="range" min="0" max="100" [value]="split()" (input)="onSplit($event)" [attr.aria-label]="'Compare before and after'" />
            </div>
            <div class="result__actions">
              <wb-button [href]="files.result" [download]="'clarity-' + job()!.id + '.' + (format() === 'jpg' ? 'jpg' : 'png')">Download {{ format() === 'jpg' ? 'JPG' : 'PNG' }}</wb-button>
              <wb-button variant="outline" (click)="reset()">Enhance another</wb-button>
              <span class="result__note">Zoom in — the drag handle reveals the restored detail.</span>
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
            <h3>Real-ESRGAN restores detail</h3>
            <p>The same family of models used in production image pipelines upcales 4× with tiled inference, rebuilding edges, text and fabric grain instead of stretching pixels.</p>
          </div>
          <div class="how__card" wbReveal [wbRevealDelay]="240">
            <span class="how__num">03</span>
            <h3>Download a catalog-ready file</h3>
            <p>Pick 2× to 4× output and PNG or JPG. What lands in your catalog meets marketplace resolution rules without a reshoot request to the vendor.</p>
          </div>
        </div>
        <p class="how__foot" wbReveal>
          This demo runs the open-source <a href="https://github.com/xinntao/Real-ESRGAN" target="_blank" rel="noopener">Real-ESRGAN</a>
          models (x4fast, animevideov3 and x4plus) on CPU via ncnn, inside the SupplierClarity reference pipeline.
          Batch processing, PIM sync and compliance checks are part of the full platform.
        </p>
      </div>
    </section>
  `,
})
export class EnhancePageComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private poller?: ReturnType<typeof setInterval>;

  protected readonly models = signal<ModelInfo[]>([
    { id: 'realesrgan-x4fast', label: 'Catalog Balanced', scale: 4, avgMsPerMp: 8000 },
    { id: 'realesr-animevideov3-x4', label: 'Fast Sketch', scale: 4, avgMsPerMp: 4200 },
    { id: 'realesrgan-x4plus', label: 'Photo Max Detail', scale: 4, avgMsPerMp: 148000 },
  ]);
  protected readonly steps = STEPS;

  protected readonly samples = [
    { name: 'Sneaker', url: 'assets/samples/sneaker-lowres.jpg', thumb: 'assets/samples/sneaker-lowres.jpg' },
    { name: 'Headphones', url: 'assets/samples/headphones-lowres.jpg', thumb: 'assets/samples/headphones-lowres.jpg' },
  ];

  protected readonly model = signal('realesrgan-x4fast');
  protected readonly outscale = signal(4);
  protected readonly format = signal<'png' | 'jpg'>('png');
  protected readonly phase = signal<Phase>('idle');
  protected readonly dragOver = signal(false);
  protected readonly split = signal(50);
  protected readonly job = signal<JobView | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly pending = signal<{ blobUrl?: string; sampleUrl?: string; name: string } | null>(null);
  private readonly finishedJob = signal<JobView | null>(null);

  protected readonly objectUrl = computed(() => this.pending()?.blobUrl ?? '');
  protected readonly showProgress = computed(() => ['uploading', 'queued', 'working'].includes(this.phase()));
  protected readonly progressPct = computed(() => {
    switch (this.phase()) {
      case 'uploading': return 6;
      case 'queued': return 12;
      case 'working': {
        const t = this.job()?.tiles;
        if (t?.total) return Math.min(96, 14 + 80 * (t.done / t.total));
        return 20;
      }
      default: return 100;
    }
  });
  protected readonly stepIndex = computed(() => {
    switch (this.phase()) {
      case 'uploading': return 0;
      case 'queued': return 1;
      case 'working': return this.job()?.stage === 'save' ? 3 : 2;
      case 'done': return 4;
      default: return 0;
    }
  });

  constructor() {
    this.http.get<ModelInfo[]>('/api/models').subscribe({
      next: (m) => { if (m?.length) this.models.set(m); },
      error: () => { /* defaults are fine */ },
    });
  }

  protected estLabel(m: ModelInfo): string {
    return m.id === 'realesrgan-x4plus' ? 'slowest, most detail' : m.id === 'realesr-animevideov3-x4' ? 'fastest' : 'balanced';
  }

  protected fmtBytes(n: number): string {
    if (!n) return '—';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  }

  protected onDragOver(ev: DragEvent): void {
    ev.preventDefault();
    this.dragOver.set(true);
  }

  protected onDrop(ev: DragEvent): void {
    ev.preventDefault();
    this.dragOver.set(false);
    const file = ev.dataTransfer?.files?.[0];
    if (file) this.stage(file);
  }

  protected onFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.stage(file);
    input.value = '';
  }

  protected useSample(s: { name: string; url: string }): void {
    this.errorMessage.set(null);
    this.phase.set('uploading');
    this.http.get(s.url, { responseType: 'blob' }).subscribe({
      next: (blob) => this.stage(new File([blob], `${s.name.toLowerCase()}-supplier.jpg`, { type: 'image/jpeg' })),
      error: () => { this.phase.set('idle'); this.errorMessage.set('Could not load the sample image.'); },
    });
  }

  private stage(file: File): void {
    if (file.size > 12 * 1024 * 1024) {
      this.errorMessage.set('That file is larger than 12 MB — try a smaller supplier photo.');
      return;
    }
    this.errorMessage.set(null);
    this.reset(false);
    const blobUrl = URL.createObjectURL(file);
    this.pending.set({ blobUrl, name: file.name, sampleUrl: undefined });
    this.fileToSubmit = file;
    this.phase.set('idle');
  }

  private fileToSubmit: File | null = null;

  protected onSplit(ev: Event): void {
    this.split.set(Number((ev.target as HTMLInputElement).value));
  }

  protected run(): void {
    const file = this.fileToSubmit;
    if (!file) return;
    this.errorMessage.set(null);
    this.phase.set('uploading');
    const body = new FormData();
    body.append('image', file);
    body.append('model', this.model());
    body.append('outscale', String(this.outscale()));
    body.append('format', this.format());
    this.http.post<{ id: string; estimatedMs: number }>('/api/jobs', body).subscribe({
      next: (res) => {
        this.phase.set('queued');
        this.poll(res.id);
      },
      error: (err) => {
        this.phase.set('error');
        this.errorMessage.set(err?.error?.error || 'Upload failed. Please try again.');
      },
    });
  }

  private poll(id: string): void {
    this.stopPolling();
    this.poller = setInterval(() => {
      this.http.get<JobView>(`/api/jobs/${id}`).subscribe({
        next: (job) => {
          this.job.set(job);
          if (job.status === 'processing') this.phase.set('working');
          if (job.status === 'done') {
            this.stopPolling();
            this.phase.set('done');
            this.finishedJob.set(job);
            this.split.set(50);
            // keep the staged file + object URL so "Enhance again" can re-run with new settings
          }
          if (job.status === 'error') {
            this.stopPolling();
            this.phase.set('error');
            this.errorMessage.set(job.error || 'Enhancement failed.');
          }
        },
        error: () => { /* transient; next tick retries */ },
      });
    }, 500);
  }

  protected reset(clearMessage = true): void {
    this.stopPolling();
    this.job.set(null);
    this.finishedJob.set(null);
    this.phase.set('idle');
    this.errorMessage.set(clearMessage ? null : this.errorMessage());
    this.pending.update((p) => {
      if (p?.blobUrl) URL.revokeObjectURL(p.blobUrl);
      return null;
    });
    this.fileToSubmit = null;
  }

  private stopPolling(): void {
    if (this.poller) clearInterval(this.poller);
    this.poller = undefined;
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.pending.update((p) => {
      if (p?.blobUrl) URL.revokeObjectURL(p.blobUrl);
      return null;
    });
  }
}
