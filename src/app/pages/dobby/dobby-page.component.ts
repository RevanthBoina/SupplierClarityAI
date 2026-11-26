import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { ProductHeroComponent } from '../products/sections/product-hero.component';
import { ProductVideoComponent } from '../products/sections/product-video.component';
import { InfraCapabilitiesComponent } from '../infra-automation/sections/infra-capabilities.component';
import { AgenticHelpComponent } from '../agentic-ai/sections/agentic-help.component';
import { DOBBY_CTA, DOBBY_CAPABILITIES, DOBBY_HERO, DOBBY_IMPACT, DOBBY_VIDEO, DOBBY_INDUSTRIES } from '../../content/dobby-content';

/**
 * /products/dobby, built from the "Dobby V1" design. Hero orbit is animated.
 * Shared product sections plus the industries tabs (centred layout) from the service pages.
 */
@Component({
  selector: 'wb-dobby-page',
  imports: [SectionThemeDirective, ProductHeroComponent, ProductVideoComponent, InfraCapabilitiesComponent, ImpactRowsComponent, CtaBandComponent, AgenticHelpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-product-hero wbSectionTheme="#ffffff" [content]="hero" [animated]="true" />
    <main>
      <wb-product-video wbSectionTheme="#ffffff" [content]="video" />
      <wb-infra-capabilities wbSectionTheme="#ffffff" [content]="caps" />
      <wb-agentic-help wbSectionTheme="#f4f7ff" [content]="industries" layout="centered" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-band wbSectionTheme="#ffffff" [content]="cta" />
    </main>
  `,
})
export class DobbyPageComponent {
  protected readonly hero = DOBBY_HERO;
  protected readonly video = DOBBY_VIDEO;
  protected readonly caps = DOBBY_CAPABILITIES;
  protected readonly industries = DOBBY_INDUSTRIES;
  protected readonly impact = DOBBY_IMPACT;
  protected readonly cta = DOBBY_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: DOBBY_HERO.lead });
  }
}
