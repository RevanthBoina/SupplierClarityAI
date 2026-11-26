import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { ProductHeroComponent } from '../products/sections/product-hero.component';
import { ProductVideoComponent } from '../products/sections/product-video.component';
import { InfraCapabilitiesComponent } from '../infra-automation/sections/infra-capabilities.component';
import { FZ_CTA, FZ_CAPABILITIES, FZ_HERO, FZ_IMPACT, FZ_VIDEO } from '../../content/fieldzapp-content';

/**
 * /products/fieldzapp, built from the "FieldZapp V1" design (animated hero).
 */
@Component({
  selector: 'wb-fieldzapp-page',
  imports: [SectionThemeDirective, ProductHeroComponent, ProductVideoComponent, InfraCapabilitiesComponent, ImpactRowsComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-product-hero wbSectionTheme="#ffffff" [content]="hero" [animated]="true" />
    <main>
      <wb-product-video wbSectionTheme="#ffffff" [content]="video" />
      <wb-infra-capabilities wbSectionTheme="#ffffff" [content]="caps" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-band wbSectionTheme="#ffffff" [content]="cta" />
    </main>
  `,
})
export class FieldZappPageComponent {
  protected readonly hero = FZ_HERO;
  protected readonly video = FZ_VIDEO;
  protected readonly caps = FZ_CAPABILITIES;
  protected readonly impact = FZ_IMPACT;
  protected readonly cta = FZ_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: FZ_HERO.lead });
  }
}
