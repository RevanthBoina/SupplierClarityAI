import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EyebrowIcon, PillLabelComponent } from './pill-label.component';

/**
 * Standard section intro used on every page: eyebrow pill, H2 with an optional blue phrase, lead.
 *   <wb-section-head icon="services" eyebrow="Services" title="Scale like a capability center."
 *                    accent="Invest in results." lead="…" headingId="why-title" />
 * align="center" (default) or "start". Sizes and spacing come from the global tokens in styles.scss.
 */
@Component({
  selector: 'wb-section-head',
  imports: [PillLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-start]': "align() === 'start'" },
  template: `
    @if (eyebrow()) { <wb-pill-label [icon]="icon()">{{ eyebrow() }}</wb-pill-label> }
    <h2 class="wb-h2" [id]="headingId()">{{ title() }}@if (accent()) {{{ ' ' }}<span class="wb-accent">{{ accent() }}</span>}</h2>
    @if (lead()) { <p class="wb-lead head__lead">{{ lead() }}</p> }
  `,
  styles: `
    :host { display: flex; flex-direction: column; align-items: center; gap: var(--wb-space-xs); text-align: center; }
    :host(.is-start) { align-items: flex-start; text-align: left; }
    .head__lead { max-width: 1080px; }
  `,
})
export class SectionHeadComponent {
  readonly icon = input<EyebrowIcon>('resources');
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly accent = input('');
  readonly lead = input('');
  readonly headingId = input<string | null>(null);
  readonly align = input<'center' | 'start'>('center');
}
