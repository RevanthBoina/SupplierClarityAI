import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button.component';
import { CLIENT_LOGOS, CONSULTATION_HREF } from '../../content/site-content';

/** Figma "header" (805:60723): hero statement and client logos (the nav is in shared/site-header). */
@Component({
  selector: 'wb-hero',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly clientLogos = CLIENT_LOGOS;
  protected readonly consultationHref = CONSULTATION_HREF;
}
