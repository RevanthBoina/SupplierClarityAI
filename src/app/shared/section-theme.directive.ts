import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';
import { PageThemeService } from './page-theme.service';

/**
 * Gives a section a page colour: <wb-services wbSectionTheme="#ffc45c" />.
 * While the section is in the middle of the screen, the whole page fades to that colour.
 */
@Directive({ selector: '[wbSectionTheme]' })
export class SectionThemeDirective implements OnDestroy {
  readonly colour = input.required<string>({ alias: 'wbSectionTheme' });

  private readonly el = inject<ElementRef<Element>>(ElementRef);
  private readonly theme = inject(PageThemeService);

  constructor() {
    afterNextRender(() => this.theme.register(this.el.nativeElement, this.colour()));
  }

  ngOnDestroy(): void {
    this.theme.unregister(this.el.nativeElement);
  }
}
