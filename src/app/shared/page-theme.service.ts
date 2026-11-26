import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Scroll-driven page colour, in the style of hoverthink.com/our-work.
 *
 * Every section registers a background colour. One IntersectionObserver watches a
 * thin line across the middle of the viewport; whichever section crosses it sets
 * --wb-page-bg on <html>. <body> transitions to that colour, and because the sections
 * themselves are transparent the whole page appears to change colour at once.
 */
@Injectable({ providedIn: 'root' })
export class PageThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly colours = new Map<Element, string>();
  private observer?: IntersectionObserver;

  register(element: Element, colour: string): void {
    this.colours.set(element, colour);
    this.ensureObserver()?.observe(element);
  }

  unregister(element: Element): void {
    this.colours.delete(element);
    this.observer?.unobserve(element);
  }

  private ensureObserver(): IntersectionObserver | undefined {
    if (this.observer || typeof IntersectionObserver === 'undefined') return this.observer;
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const colour = this.colours.get(entry.target);
            if (colour) this.apply(colour);
          }
        }
      },
      // A 0px-tall band through the centre of the viewport: a section "owns" the page
      // while it covers the middle of the screen.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    return this.observer;
  }

  private apply(colour: string): void {
    this.doc.documentElement.style.setProperty('--wb-page-bg', colour);
  }
}
