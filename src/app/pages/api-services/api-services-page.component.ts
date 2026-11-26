import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaPanelComponent } from '../../shared/cta-panel.component';
import { AgenticHeroComponent } from '../agentic-ai/sections/agentic-hero.component';
import { AgenticHelpComponent } from '../agentic-ai/sections/agentic-help.component';
import { AgenticDeliveryComponent } from '../agentic-ai/sections/agentic-delivery.component';
import { ApiCloudComponent } from './sections/api-cloud.component';
import { ApiWhyComponent } from './sections/api-why.component';
import { API_CTA, API_HERO, API_IMPACT, API_INDUSTRIES, API_SERVICES_RING } from '../../content/api-services-content';

/**
 * /services/api-services, built from the "API Services V4.1" design.
 * Shared service-page sections (hero, tabs, pinned ring, business impact, CTA) fed with this page's content,
 * plus two page-specific sections: "Cloud ready from day one" and "Why WhiteBlue?".
 */
@Component({
  selector: 'wb-api-services-page',
  imports: [
    SectionThemeDirective, AgenticHeroComponent, AgenticHelpComponent, AgenticDeliveryComponent,
    ApiCloudComponent, ApiWhyComponent, ImpactRowsComponent, CtaPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-agentic-hero wbSectionTheme="#ffffff" [content]="hero" />
    <main>
      <wb-agentic-help wbSectionTheme="#f0f9fa" [content]="industries" layout="centered" />
      <wb-agentic-delivery wbSectionTheme="#ffffff" [content]="services" />
      <wb-api-cloud wbSectionTheme="#2f5bf0" />
      <wb-api-why wbSectionTheme="#ffffff" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-panel wbSectionTheme="#ffffff" [title]="cta.titleLead" [accent]="cta.titleAccent" [lead]="cta.lead"
                    [image]="cta.image" [imageAlt]="cta.imageAlt" [secondaryLabel]="cta.secondaryLabel" [secondaryHref]="cta.secondaryHref" />
    </main>
  `,
})
export class ApiServicesPageComponent {
  protected readonly hero = API_HERO;
  protected readonly industries = API_INDUSTRIES;
  protected readonly services = API_SERVICES_RING;
  protected readonly impact = API_IMPACT;
  protected readonly cta = API_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: API_HERO.lead });
  }
}
