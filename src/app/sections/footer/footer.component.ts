import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RevealDirective } from '../../shared/reveal.directive';
import { FOOTER_COLUMNS, LEGAL_LINKS, OFFICE_PINS, SOCIAL_LINKS } from '../../content/site-content';

type SubscribeState = 'idle' | 'invalid' | 'done';

/** Figma "footer" (805:61173): newsletter, offices globe, sitemap, socials and the cricket "SIX!" flourish. */
@Component({
  selector: 'wb-footer',
  imports: [FormsModule, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly columns = FOOTER_COLUMNS;
  protected readonly socials = SOCIAL_LINKS;
  protected readonly legal = LEGAL_LINKS;
  protected readonly pins = OFFICE_PINS;
  protected readonly year = new Date().getFullYear();

  protected email = '';
  protected readonly state = signal<SubscribeState>('idle');

  private static readonly EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  protected subscribe(): void {
    if (!FooterComponent.EMAIL.test(this.email.trim())) {
      this.state.set('invalid');
      return;
    }
    // TODO: send this.email to the newsletter provider (Mailchimp, HubSpot, etc.).
    this.state.set('done');
    this.email = '';
  }
}
