import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { ProductVideoContent } from '../../../content/content-types';

/**
 * "What it is" block: heading and text left, video right. Until videoUrl is set the poster shows a play
 * button marked "Video coming soon". With a URL, the play button swaps the poster for the player
 * (YouTube/Vimeo embed or an .mp4).
 */
@Component({
  selector: 'wb-product-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pv" [id]="c.id" [attr.aria-labelledby]="c.id + '-title'">
      <div class="wb-container pv__inner">
        <div>
          <h2 class="wb-h2 pv__title" [id]="c.id + '-title'">
            @for (seg of c.title; track $index) {
              @if (seg.accent) {<span class="wb-accent">{{ seg.text }}</span>} @else {{{ seg.text }}}
              @if (seg.breakAfter) {<br />}
            }
          </h2>
          <p class="wb-lead pv__lead">{{ c.lead }}</p>
        </div>

        <div class="player">
          @if (playing() && c.videoUrl) {
            @if (isFile()) {
              <video class="player__media" [src]="c.videoUrl" controls autoplay playsinline></video>
            } @else {
              <iframe class="player__media" [src]="embedUrl()" title="{{ c.caption }}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
            }
          } @else {
            <img class="player__poster" [src]="c.poster" width="640" height="400" [alt]="c.posterAlt" />
            <button type="button" class="player__play" (click)="play()" [disabled]="!c.videoUrl"
                    [attr.aria-label]="c.videoUrl ? 'Play ' + c.caption : c.caption + ', video coming soon'"
                    [attr.title]="c.videoUrl ? null : 'Video coming soon'">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            </button>
            <p class="player__caption"><strong>{{ c.caption }}</strong><span>{{ c.duration }}</span></p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .pv { padding: var(--wb-section-y) 0; background: #fff; scroll-margin-top: 80px; }
    .pv__inner { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); gap: clamp(32px, 4vw, 72px); align-items: center; }
    .pv__title { font-family: var(--wb-font-body); font-size: min(clamp(2rem, 3.2vw, 3.75rem), 6.6svh); }
    .pv__lead { margin-top: var(--wb-space-sm); max-width: 620px; }
    .player { position: relative; overflow: hidden; aspect-ratio: 16 / 10; max-height: calc(100svh - 2 * var(--wb-section-y)); border-radius: 22px; background: #0f1630; box-shadow: 0 24px 50px rgba(11, 21, 51, 0.14); }
    .player__poster, .player__media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border: 0; }
    .player__poster { filter: brightness(0.86); }
    .player__play {
      position: absolute;
      left: 50%;
      top: 50%;
      width: clamp(56px, 5.6vw, 80px);
      aspect-ratio: 1;
      translate: -50% -50%;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      transition: transform 0.3s var(--wb-ease-out);
    }
    .player__play:not(:disabled):hover { transform: scale(1.08); }
    .player__play:disabled { cursor: default; }
    .player__play svg { width: 42%; height: 42%; margin-left: 6%; fill: var(--wb-blue); }
    .player__caption { position: absolute; left: clamp(16px, 2vw, 28px); bottom: clamp(14px, 2vw, 26px); display: flex; flex-direction: column; gap: 4px; color: #fff; font-family: var(--wb-font-body); }
    .player__caption strong { font-weight: 600; font-size: var(--wb-fs-body); }
    .player__caption span { font-size: 0.875rem; opacity: 0.85; }
    @media (max-width: 1000px) { .pv__inner { grid-template-columns: 1fr; } }
  `,
})
export class ProductVideoComponent {
  readonly content = input.required<ProductVideoContent>();
  protected get c(): ProductVideoContent { return this.content(); }
  protected readonly playing = signal(false);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly isFile = computed(() => /\.(mp4|webm)(\?|$)/i.test(this.content().videoUrl));
  /** Embed URL with autoplay, trusted only because it comes from our own content file */
  protected readonly embedUrl = computed(() => {
    const u = this.content().videoUrl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(u + (u.includes('?') ? '&' : '?') + 'autoplay=1');
  });
  protected play(): void { if (this.content().videoUrl) this.playing.set(true); }
}
