import type { Product } from '@commercetools/platform-sdk';
import { div, p } from '@control.ts/min';

import { ProductCard } from '@components/ProductCard/ProductCard';
import styles from '@components/ProductCard/ProductCard.module.scss';

export class ProductDetails extends ProductCard {
  public async createDetails(product: Product): Promise<HTMLDivElement> {
    const card = await super.createCard(product);
    card.classList.add(styles.details);

    const attributesContainer = div({ className: styles.attributesContainer });

    for (let i = 1; i <= 5; i++) {
      const attributeField = p({
        className: styles.attributes,
        txt: `${this.getAttributeName(product, i)}: ${this.getAttributeValue(product, i)}`,
      });
      attributesContainer.append(attributeField);
    }
    card.append(attributesContainer);
    return card;
  }

  private getAttributeValue(product: Product, index: number): string {
    const customFields = product.masterData.current.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.value.toString();
    }
    return 'No attributes';
  }

  private getAttributeName(product: Product, index: number): string {
    const customFields = product.masterData.current.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.name.toString();
    }
    return 'No attributes';
  }
}

const productDetails = new ProductDetails();
export default productDetails;
