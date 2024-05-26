import type { ProductProjection, TypedMoney } from '@commercetools/platform-sdk';
import { div, img, span } from '@control.ts/min';

import styles from './ProductCard.module.scss';

export class ProductCard {
  public createCard(product: ProductProjection): HTMLDivElement {
    const picData = product.masterVariant.images ? product.masterVariant.images[0] : null;

    const card = div({ className: styles.card });
    // If a product is on sale, add sale class to a card
    if (this.checkForDiscount(product)) {
      card.classList.add(styles.sale);

      const salePercentage = div({
        className: styles.salePercentage,
        txt: this.countDiscountPercentage(product),
      });
      card.append(salePercentage);
    }

    const picContainer = div({ className: styles.picContainer });

    const pic = img({ className: styles.pic, src: picData?.url, alt: picData?.label });
    const infoContainer = div({ className: styles.infoContainer });
    const name = div({ className: styles.name, txt: product.name['en-US'] });

    const description = div({ className: styles.description });

    if (product.description) {
      description.innerText = product.description['en-US'];
    }

    const price = this.getProductPriceElement(product) ?? div({ txt: 'null' });

    card.append(picContainer, infoContainer);
    picContainer.append(pic);
    infoContainer.append(name, description, price);

    return card;
  }

  private getProductPriceElement(product: ProductProjection): HTMLElement | null {
    if (product.masterVariant.prices) {
      const priceData = product.masterVariant.prices[0];

      const baseData = priceData.value;

      const basePrice = span({ className: styles.priceValue, txt: this.countPrice(baseData).toString() });

      const currency = span({ className: styles.priceValue, txt: priceData.value.currencyCode });

      const finalPrice = div({ className: styles.price });

      finalPrice.append(basePrice);
      if (this.checkForDiscount(product) && priceData.discounted) {
        const discountedPrice = span({ className: styles.priceValue });
        const discountedData = priceData.discounted?.value;
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

  private checkForDiscount(product: ProductProjection): boolean {
    if (product.masterVariant.prices) {
      return !!product.masterVariant.prices[0].discounted;
    }
    return false;
  }

  private countDiscountPercentage(product: ProductProjection): string {
    let sale = '0% SALE';
    if (product.masterVariant.prices && product.masterVariant.prices[0].discounted) {
      const newPrice = product.masterVariant.prices[0].discounted.value.centAmount;
      const oldPrice = product.masterVariant.prices[0].value.centAmount;
      const percentage = Math.round(100 - (newPrice * 100) / oldPrice);
      sale = `${percentage}% SALE`;
    }
    return sale;
  }
}

const productCard = new ProductCard();
export default productCard;