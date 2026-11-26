import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaPanelComponent } from '../../shared/cta-panel.component';
import { InfraHeroComponent } from './sections/infra-hero.component';
import { InfraSpendComponent } from './sections/infra-spend.component';
import { InfraCapabilitiesComponent } from './sections/infra-capabilities.component';
import { InfraBenefitsComponent } from './sections/infra-benefits.component';
import { INFRA_CTA, INFRA_HERO, INFRA_IMPACT } from '../../content/infra-automation-content';

/** /services/infra-automation, built from the "Infra Automation V1.1" design. */
@Component({
  selector: 'wb-infra-automation-page',
  imports: [
    SectionThemeDirective,
    ImpactRowsComponent,
    CtaPanelComponent,
    InfraHeroComponent,
    InfraSpendComponent,
    InfraCapabilitiesComponent,
    InfraBenefitsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-infra-hero wbSectionTheme="#ffffff" />
    <main>
      <wb-infra-spend wbSectionTheme="#eaf0fe" />
      <wb-infra-capabilities wbSectionTheme="#ffffff" />
      <wb-infra-benefits wbSectionTheme="#ffdb57" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-panel wbSectionTheme="#ffffff" tone="blue" [title]="cta.titleLead" [accent]="cta.titleAccent" [lead]="cta.lead"
                    [image]="cta.image" [imageAlt]="cta.imageAlt" [secondaryLabel]="cta.secondaryLabel" [secondaryHref]="cta.secondaryHref" />
    </main>
  `,
})
export class InfraAutomationPageComponent {
  protected readonly impact = INFRA_IMPACT;
  protected readonly cta = INFRA_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: INFRA_HERO.lead });
  }
}
