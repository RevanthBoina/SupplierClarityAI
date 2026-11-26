import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './shared/site-header.component';
import { FooterComponent } from './sections/footer/footer.component';
import { AiChatbotComponent } from './shared/ai-chatbot.component';
import { SectionThemeDirective } from './shared/section-theme.directive';
import { SECTION_THEMES } from './content/site-content';

/** App shell: shared navigation, the current page (see app.routes.ts), the shared footer and the Clarity Assistant. */
@Component({
  selector: 'wb-root',
  imports: [RouterOutlet, SiteHeaderComponent, FooterComponent, AiChatbotComponent, SectionThemeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wb-site-header />
    <router-outlet />
    <wb-footer [wbSectionTheme]="themes.footer" />
    <wb-ai-chatbot />
  `,
})
export class AppComponent {
  protected readonly themes = SECTION_THEMES;
}
