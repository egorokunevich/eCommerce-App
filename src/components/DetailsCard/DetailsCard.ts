import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, p } from '@control.ts/min';

import { ProductCard } from '@components/ProductCard/ProductCard';
import styles from '@components/ProductCard/ProductCard.module.scss';

export class ProductDetails extends ProductCard {
  public async createDetails(product: ProductProjection): Promise<HTMLDivElement> {
    const card = await super.createCard(product);
    card.classList.add(styles.details);

    const attributesContainer = div({ className: styles.attributesContainer });

    for (let i = 1; i <= 7; i++) {
      let attributeField;
      if (i === 1) {
        attributeField = p({
          className: styles.attributes,
          txt: `${this.getAttributeValue(product, i)}`,
        });
      } else {
        attributeField = p({
          className: styles.attributes,
          txt: `${this.getAttributeName(product, i)}: ${this.getAttributeValue(product, i)}`,
        });
      }
      attributesContainer.append(attributeField);
    }
    card.append(attributesContainer);
    return card;
  }

  private getAttributeValue(product: ProductProjection, index: number): string {
    const customFields = product.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.value.toString();
    }
    return 'No attributes';
  }

  private getAttributeName(product: ProductProjection, index: number): string {
    const customFields = product.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.name.toString();
    }
    return 'No attributes';
  }
}

const productDetails = new ProductDetails();
export default productDetails;
