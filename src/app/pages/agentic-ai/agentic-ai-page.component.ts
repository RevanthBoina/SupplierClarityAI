import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { AgenticHeroComponent } from './sections/agentic-hero.component';
import { AgenticWhyComponent } from './sections/agentic-why.component';
import { AgenticHelpComponent } from './sections/agentic-help.component';
import { AgenticDeliveryComponent } from './sections/agentic-delivery.component';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaPanelComponent } from '../../shared/cta-panel.component';
import { AGENTIC_CTA, AGENTIC_HERO, AGENTIC_IMPACT } from '../../content/agentic-ai-content';

/** /services/agentic-ai, built from the "Agentic AI V1.2" design. Sections keep the page white. */
@Component({
  selector: 'wb-agentic-ai-page',
  imports: [
    SectionThemeDirective,
    AgenticHeroComponent,
    AgenticWhyComponent,
    AgenticHelpComponent,
    AgenticDeliveryComponent,
    ImpactRowsComponent,
    CtaPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-agentic-hero wbSectionTheme="#ffffff" />
    <main>
      <wb-agentic-why wbSectionTheme="#ffffff" />
      <wb-agentic-help wbSectionTheme="#f4f7ff" />
      <wb-agentic-delivery wbSectionTheme="#ffffff" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-panel wbSectionTheme="#ffffff" [title]="cta.titleLead" [accent]="cta.titleAccent" [lead]="cta.lead"
                    [image]="cta.image" [imageAlt]="cta.imageAlt" [secondaryLabel]="cta.secondaryLabel" [secondaryHref]="cta.secondaryHref" />
    </main>
  `,
})
export class AgenticAiPageComponent {
  protected readonly cta = AGENTIC_CTA;
  protected readonly impact = AGENTIC_IMPACT;
  constructor() {
    inject(Meta).updateTag({ name: 'description', content: AGENTIC_HERO.lead });
  }
}
