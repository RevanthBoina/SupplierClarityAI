import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaBandComponent } from '../../shared/cta-band.component';
import { ProductHeroComponent } from '../products/sections/product-hero.component';
import { ProductVideoComponent } from '../products/sections/product-video.component';
import { InfraCapabilitiesComponent } from '../infra-automation/sections/infra-capabilities.component';
import { QQ_CTA, QQ_CAPABILITIES, QQ_HERO, QQ_IMPACT, QQ_VIDEO } from '../../content/quickqode-content';

/**
 * /products/quickqode, built from the "QuickQode V1.1" design (animated hero).
 */
@Component({
  selector: 'wb-quickqode-page',
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
export class QuickQodePageComponent {
  protected readonly hero = QQ_HERO;
  protected readonly video = QQ_VIDEO;
  protected readonly caps = QQ_CAPABILITIES;
  protected readonly impact = QQ_IMPACT;
  protected readonly cta = QQ_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: QQ_HERO.lead });
  }
}
