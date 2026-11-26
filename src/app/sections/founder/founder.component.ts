import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { FOUNDER_NOTE } from '../../content/site-content';

/** Figma "note-from-founder" (805:61401). */
@Component({
  selector: 'wb-founder',
  imports: [RevealDirective, PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="founder" id="founder" aria-labelledby="founder-title">
      <img class="founder__waves" src="assets/illustrations/founder-waves.svg" width="1920" height="629" alt="" />

      <div class="founder__inner">
        <div class="founder__eyebrow" wbReveal><wb-pill-label icon="leadership">Leadership</wb-pill-label></div>
        <h2 wbReveal class="wb-h2 founder__title" id="founder-title"><span class="wb-accent">Note from</span> Founder</h2>

        <figure class="note">
          <span class="note__portrait" wbReveal="zoom" [wbRevealDelay]="150">
            @if (note.photo) {
              <img [src]="note.photo" width="88" height="88" [alt]="note.name" />
            } @else {
              <span class="note__portrait-fallback" aria-hidden="true">{{ note.initials }}</span>
            }
          </span>
          <blockquote class="note__body">
            @for (paragraph of note.paragraphs; track $index) {
              <p wbReveal [wbRevealDelay]="120">{{ paragraph }}</p>
            }
          </blockquote>
          <figcaption class="note__signature" wbReveal="left">
            <span>
              <span class="note__name">{{ note.name }}</span>
              <span class="note__role">{{ note.role }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .founder { position: relative; overflow: hidden; padding: var(--wb-section-y) 0; background: transparent; }
    .founder__waves {
      position: absolute;
      top: 0;
      left: -4%;
      width: 108%;
      max-width: none;
      height: 629px;
      object-fit: fill;
      pointer-events: none;
      animation: waves 14s ease-in-out infinite alternate;
    }
    @keyframes waves { from { transform: translateX(-2%) scaleY(0.96); } to { transform: translateX(2%) scaleY(1.04); } }
    /* Signature underline draws in */
    .note__signature { border-top: 0; position: relative; }
    .note__signature::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 1px;
      background: #d9d9d9;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 1.2s var(--wb-ease-out) 0.3s;
    }
    .note__signature.is-visible::before { transform: scaleX(1); }
    .founder__inner { position: relative; width: min(1171px, 100% - 2 * var(--wb-gutter)); margin: 0 auto; }
    .founder__eyebrow { display: flex; justify-content: center; margin-bottom: var(--wb-space-xs); }
    .founder__title { text-align: center; }

    .note {
      margin: var(--wb-space-lg) 0 0;
      display: grid;
      grid-template-columns: 117px 1fr;
    }
    /* Jai's portrait opens the note, in the column the quote marks used */
    .note__portrait {
      position: relative;
      width: 88px;
      height: 88px;
      margin-top: var(--wb-space-md);
      border-radius: 50%;
      box-shadow: 0 0 0 4px #fff, 0 0 0 5px var(--wb-blue-border), 0 10px 24px rgba(14, 154, 165, 0.18);
    }
    .note__portrait img, .note__portrait-fallback { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; display: block; }
    .note__portrait-fallback {
      display: grid;
      place-items: center;
      background: var(--wb-blue-tint);
      font-family: var(--wb-font-display);
      font-weight: 700;
      font-size: 1.75rem;
      color: var(--wb-blue);
    }

    .note__body { margin: var(--wb-space-md) 0 0; display: flex; flex-direction: column; gap: var(--wb-space-sm); }
    .note__body p {
      font-family: var(--wb-font-hand);
      font-size: clamp(1.25rem, 1.56vw, 1.875rem); /* 30px max, was 43px */
      line-height: 1.32;
      color: #4b4a4a;
    }

    .note__signature {
      grid-column: 2;
      margin-top: var(--wb-space-md);
      padding-top: var(--wb-space-sm);
      border-top: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      gap: 22px;
      color: var(--wb-ink-600);
    }
    .note__name { display: block; font-family: var(--wb-font-display); font-weight: 700; font-size: clamp(1.5rem, 1.98vw, 2.375rem); line-height: 1.16; }
    .note__role { display: block; margin-top: 4px; font-family: var(--wb-font-body); font-size: clamp(1.0625rem, 1.2vw, 1.4375rem); line-height: 1.48; }

    @media (max-width: 720px) {
      .note { grid-template-columns: 1fr; }
      .note__portrait { margin: 0 0 var(--wb-space-xs); }
      .note__body { margin-top: 12px; }
      .note__signature { grid-column: 1; }
    }
  `,
})
export class FounderComponent {
  protected readonly note = FOUNDER_NOTE;
}
