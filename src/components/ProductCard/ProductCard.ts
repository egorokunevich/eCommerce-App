import type { ProductProjection, ProductVariant, TypedMoney } from '@commercetools/platform-sdk';
import { button, div, img, span } from '@control.ts/min';

import { showToastMessage } from '@components/Toast';
import cartService from '@services/CartService';

import styles from './ProductCard.module.scss';

export class ProductCard {
  public async createCard(product: ProductProjection): Promise<HTMLDivElement> {
    const picData = product.masterVariant.images ? product.masterVariant.images[0] : null;
    const card = div({ className: styles.card });
    // If a product is on sale, add sale class to a card
    if (this.checkForDiscount(product.masterVariant)) {
      card.classList.add(styles.sale);

      const salePercentage = div({
        className: styles.salePercentage,
        txt: this.countDiscountPercentage(product.masterVariant),
      });
      card.append(salePercentage);
    }
    const picContainer = div({ className: styles.picContainer });
    const pic = img({
      className: styles.pic,
      src: picData?.url,
      alt: picData?.label,
    });
    const infoContainer = div({ className: styles.infoContainer });
    const detailsContainer = div({ className: styles.detailsContainer });
    const name = div({ className: styles.name, txt: product.name['en-US'] });
    const description = div({ className: styles.description });
    detailsContainer.append(name, description);

    if (product.description) {
      description.innerText = product.description['en-US'];
    }
    const price = (await this.getProductPriceElement(product)) ?? div({ txt: 'null' });
    card.append(picContainer, infoContainer);
    picContainer.append(pic);
    infoContainer.append(detailsContainer, price);

    return card;
  }

  public async getProductPriceElement(product: ProductProjection): Promise<HTMLElement | null> {
    if (product.masterVariant.prices) {
      const priceData = product.masterVariant.prices[0];
      const baseData = priceData.value;

      const basePrice = span({ className: styles.priceValue, txt: this.formatPrice(baseData) });

      const finalPrice = div({ className: styles.price });

      finalPrice.append(basePrice);

      if (this.checkForDiscount(product.masterVariant) && priceData.discounted) {
        const discountedPrice = span({ className: styles.priceValue });
        const discountedData = priceData.discounted?.value;
        discountedPrice.innerText = this.formatPrice(discountedData);
        discountedPrice.classList.add(styles.discount);
        basePrice.classList.add(styles.crossed);
        finalPrice.classList.add(styles.withDiscount);
        finalPrice.append(discountedPrice);
      }
      const addToCartBtn = await this.createAddToCartBtn(product);
      finalPrice.append(addToCartBtn);
      return finalPrice;
    }
    return null;
  }

  private async createAddToCartBtn(product: ProductProjection): Promise<HTMLButtonElement> {
    const addToCartBtn = button({ className: styles.addToCartBtn });

    const isProductInCart = await cartService.checkIfProductIsInCart(product.id);

    if (isProductInCart) {
      addToCartBtn.disabled = true;
    }
    const addToCartStart = new CustomEvent('addToCartStart');
    const loader = div({ className: styles.loader });
    addToCartBtn.addEventListener('addToCartStart', () => {
      addToCartBtn.classList.add(styles.loading);
      addToCartBtn.append(loader);
    });
    addToCartBtn.addEventListener('addToCartEnd', () => {
      addToCartBtn.classList.remove(styles.loading);
      addToCartBtn.removeChild(loader);
    });
    addToCartBtn.addEventListener('click', async (e) => {
      addToCartBtn.dispatchEvent(addToCartStart);
      e.stopPropagation();
      const response = await cartService.addProductToCart(product.id);
      if (response?.statusCode === 200) {
        addToCartBtn.disabled = true;
      } else {
        showToastMessage('Failed to add a product. Please, try again.');
      }
      const addToCartEnd = new CustomEvent('addToCartEnd');
      addToCartBtn.dispatchEvent(addToCartEnd);
    });

    return addToCartBtn;
  }

  public formatPrice(price: TypedMoney): string {
    const value = price.centAmount / 10 ** price.fractionDigits;
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: price.currencyCode,
      minimumFractionDigits: 2,
    });
  }

  public checkForDiscount(variant: ProductVariant): boolean {
    if (variant.prices) {
      return !!variant.prices[0].discounted;
    }
    return false;
  }

  public countDiscountPercentage(variant: ProductVariant): string {
    let sale = '0% SALE';
    if (variant.prices && variant.prices[0].discounted) {
      const newPrice = variant.prices[0].discounted.value.centAmount;
      const oldPrice = variant.prices[0].value.centAmount;
      const percentage = Math.round(100 - (newPrice * 100) / oldPrice);
      sale = `${percentage}% SALE`;
    }
    return sale;
  }
}

const productCard = new ProductCard();
export default productCard;
