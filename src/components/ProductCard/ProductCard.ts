import type { Product, TypedMoney } from '@commercetools/platform-sdk';
import { div, img, span } from '@control.ts/min';

import styles from './ProductCard.module.scss';

export class ProductCard {
  public async createCard(product: Product): Promise<HTMLDivElement> {
    const picData = product.masterData.current.masterVariant.images
      ? product.masterData.current.masterVariant.images[0]
      : null;

    const card = div({ className: styles.card });
    if (this.checkForDiscount(product)) {
      card.classList.add(styles.sale);
    }

    const picContainer = div({ className: styles.picContainer });

    const pic = img({ className: styles.pic, src: picData?.url, alt: picData?.label });
    const infoContainer = div({ className: styles.infoContainer });
    const name = div({ className: styles.name, txt: product.masterData.current.name['en-US'] });

    const description = div({ className: styles.description });

    if (product.masterData.current.description) {
      description.innerText = product.masterData.current.description['en-US'];
    }

    const price = this.getProductPriceElement(product) ?? div({ txt: 'null' });

    card.append(picContainer, infoContainer);
    picContainer.append(pic);
    infoContainer.append(name, description, price);

    return card;
  }

  private getProductPriceElement(product: Product): HTMLElement | null {
    if (product.masterData.current.masterVariant.prices) {
      const priceData = product.masterData.current.masterVariant.prices[0];

      const baseData = priceData.value;

      const basePrice = span({ className: styles.priceValue, txt: this.countPrice(baseData).toString() });

      const currency = span({ className: styles.priceValue, txt: priceData.value.currencyCode });

      const finalPrice = div({ className: styles.price });
      const discountedPrice = span({ className: styles.priceValue });
      const discountedData = priceData.discounted?.value;
      finalPrice.append(basePrice);
      if (discountedData) {
        discountedPrice.innerText = this.countPrice(discountedData).toString();
        discountedPrice.classList.add(styles.discount);
        basePrice.classList.add(styles.crossed);
        finalPrice.classList.add(styles.withDiscount);
        finalPrice.append(discountedPrice);
      }
      finalPrice.append(currency);
      return finalPrice;
    }
    return null;
  }

  private countPrice(price: TypedMoney): number {
    return price.centAmount / 10 ** price.fractionDigits; // Divide by 100 cents
  }

  private checkForDiscount(product: Product): boolean {
    if (product.masterData.current.masterVariant.prices) {
      return !!product.masterData.current.masterVariant.prices[0].discounted;
    }
    return false;
  }
}

const productCard = new ProductCard();
export default productCard;
