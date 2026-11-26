import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../../shared/button.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Figma "every-pitch" (805:60595): problem statement with the animated cricket pitch.
 *
 * - The pitch is a still image; the pain-point markers and labels are drawn on top of it so they
 *   can be placed exactly. They rise in one after another when the section scrolls into view.
 * - The cricket ground (boundary rope, dashed 30-yard circle, mowing stripes, faint grid and creases) is drawn
 *   in the same perspective as the pitch. They extend out of the picture into the space towards the
 *   copy, so the illustration feels like part of the page. They draw in as the section plays.
 */
@Component({
  selector: 'wb-every-pitch',
  imports: [ButtonComponent, RevealDirective, PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './every-pitch.component.html',
  styleUrl: './every-pitch.component.scss',
  host: { '[class.is-playing]': 'playing()', '[class.is-static]': 'staticMode()' },
})
export class EveryPitchComponent implements OnDestroy {
  /** Outfield, in ground-plane units (image pixels). The pitch runs along x, stumps at about x = -351 and +423. */
  protected readonly boundary = 960;
  protected readonly innerCircle = 440; // 30-yard circle, roughly 0.45 of the boundary
  /** Mowing stripes parallel to the pitch: every other 110-unit band is tinted. */
  protected readonly stripeWidth = 110;
  protected readonly stripes = Array.from({ length: 9 }, (_, i) => -this.boundary + 55 + i * 220);
  /** Faint ground grid, 160 units apart. */
  protected readonly grid = Array.from({ length: 11 }, (_, i) => (i - 5) * 160);

  /**
   * The five pain points, evenly spaced along the pitch between the two popping creases.
   * u = distance along the pitch in ground units (stumps at about -351 and +423, creases at -278 and +349);
   * each point is projected into the picture with the same ground-plane transform as the field.
   */
  protected readonly stemHeight = 110;
  protected readonly painPoints = ['Legacy core', 'Siloed data', 'Manual work', 'Regulation', 'Scale'].map((label, i) => {
    const u = -210 + i * 126;
    const v = -22; // pitch centre line
    return { label, x: 0.586 * u + 0.939 * v + 869, y: 0.81 * u - 0.343 * v + 612 };
  });

  protected readonly playing = signal(false);
  protected readonly staticMode = signal(false);

  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !('IntersectionObserver' in window)) {
        this.staticMode.set(true);
        this.playing.set(true);
        return;
      }
      this.observer = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            this.observer?.disconnect();
            this.playing.set(true);
          }
        },
        { threshold: 0.4 },
      );
      this.observer.observe(this.frame().nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
