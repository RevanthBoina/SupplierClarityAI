import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Scroll-reveal: the host fades and slides into place the first time it enters the viewport.
 *
 *   <h2 wbReveal>…</h2>                       fade up
 *   <li wbReveal="left" [wbRevealDelay]="i * 90">  slide in from the left, staggered
 *
 * Variants: 'up' (default), 'down', 'left', 'right', 'zoom', 'fade'.
 * Styling lives in styles.scss (.wb-reveal). Users with reduced-motion enabled see content immediately.
 */
@Directive({
  selector: '[wbReveal]',
  host: {
    class: 'wb-reveal',
    '[attr.data-reveal]': 'variant() || "up"',
    '[style.--wb-reveal-delay]': 'wbRevealDelay() + "ms"',
  },
})
export class RevealDirective implements OnDestroy {
  readonly variant = input<'' | 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'>('', { alias: 'wbReveal' });
  readonly wbRevealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !('IntersectionObserver' in window)) {
        node.classList.add('is-visible');
        return;
      }
      this.observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('is-visible');
              this.observer?.disconnect();
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
