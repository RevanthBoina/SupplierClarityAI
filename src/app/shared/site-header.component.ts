import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { ButtonComponent } from './button.component';
import { CONSULTATION_HREF, NAV_LINKS } from '../content/site-content';

/**
 * Site navigation shared by every page: a floating bar pinned near the top that condenses
 * while scrolling. Over the blue home hero it is see-through glass; on other pages it is solid.
 */
@Component({
  selector: 'wb-site-header',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  protected readonly navLinks = NAV_LINKS;
  protected readonly consultationHref = CONSULTATION_HREF;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  private readonly router = inject(Router);
  /** Current path, e.g. '/services/agentic-ai' (marks the current page in the drop-downs) */
  protected readonly path = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: '/' },
  );
  /** Solid bar on every page except the home page */
  protected readonly solid = computed(() => this.path() !== '/');

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  protected toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }
}
