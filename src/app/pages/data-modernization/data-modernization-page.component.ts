import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SectionThemeDirective } from '../../shared/section-theme.directive';
import { ImpactRowsComponent } from '../../shared/impact-rows.component';
import { CtaPanelComponent } from '../../shared/cta-panel.component';
import { AgenticHeroComponent } from '../agentic-ai/sections/agentic-hero.component';
import { AgenticHelpComponent } from '../agentic-ai/sections/agentic-help.component';
import { AgenticDeliveryComponent } from '../agentic-ai/sections/agentic-delivery.component';
import { DATA_CTA, DATA_HELP, DATA_HERO, DATA_IMPACT, DATA_LAYERS } from '../../content/data-modernization-content';

/**
 * /services/data-modernization, built from the "Data Modernization V1.1" design.
 * Same section templates as the Agentic AI page (hero with chips, how we help tabs, pinned three-step ring,
 * business impact rows, CTA), fed with this page's content.
 */
@Component({
  selector: 'wb-data-modernization-page',
  imports: [SectionThemeDirective, AgenticHeroComponent, AgenticHelpComponent, AgenticDeliveryComponent, ImpactRowsComponent, CtaPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wb-fit' }, // one-screen rule: every section fits one viewport height
  template: `
    <wb-agentic-hero wbSectionTheme="#ffffff" [content]="hero" />
    <main>
      <wb-agentic-help wbSectionTheme="#f4f7ff" [content]="help" layout="centered" />
      <wb-agentic-delivery wbSectionTheme="#ffffff" [content]="layers" />
      <wb-impact-rows wbSectionTheme="#f7f8ff" [content]="impact" />
      <wb-cta-panel wbSectionTheme="#ffffff" [title]="cta.titleLead" [accent]="cta.titleAccent" [lead]="cta.lead"
                    [image]="cta.image" [imageAlt]="cta.imageAlt" [secondaryLabel]="cta.secondaryLabel" [secondaryHref]="cta.secondaryHref" />
    </main>
  `,
})
export class DataModernizationPageComponent {
  protected readonly hero = DATA_HERO;
  protected readonly help = DATA_HELP;
  protected readonly layers = DATA_LAYERS;
  protected readonly impact = DATA_IMPACT;
  protected readonly cta = DATA_CTA;

  constructor() {
    inject(Meta).updateTag({ name: 'description', content: DATA_HERO.lead });
  }
}
