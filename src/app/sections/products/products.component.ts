import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/button.component';
import { PillLabelComponent } from '../../shared/pill-label.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { CONSULTATION_HREF, PRODUCTS, Product } from '../../content/site-content';

/**
 * Figma "products" (805:60906) plus the Dobby / QuickQode / FieldZapp cards (805:61447–61449).
 * One product is expanded at a time; the rest sit as overlapping cards ("Click to expand →").
 */
@Component({
  selector: 'wb-products',
  imports: [ButtonComponent, PillLabelComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  protected readonly products = PRODUCTS;
  protected readonly consultationHref = CONSULTATION_HREF;
  protected readonly activeIndex = signal(0);

  protected select(index: number): void {
    this.activeIndex.set(index);
  }

  protected initials(product: Product): string {
    return product.name.slice(0, 2).toUpperCase();
  }
}
