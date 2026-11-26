import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Counts a number up from 0 when it scrolls into view, e.g. <span [wbCountUp]="2500"></span>.
 * The final value is rendered immediately for SEO, screen readers and reduced-motion users.
 */
@Directive({ selector: '[wbCountUp]' })
export class CountUpDirective implements OnDestroy {
  readonly target = input.required<number>({ alias: 'wbCountUp' });
  readonly duration = input(1600);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private frame = 0;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      node.textContent = this.format(this.target());
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

      node.textContent = '0';
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          this.observer?.disconnect();
          this.run(node);
        }
      }, { threshold: 0.5 });
      this.observer.observe(node);
    });
  }

  private run(node: HTMLElement): void {
    const end = this.target();
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / this.duration());
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      node.textContent = this.format(Math.round(end * eased));
      if (t < 1) this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  private format(n: number): string {
    return String(n);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }
}
