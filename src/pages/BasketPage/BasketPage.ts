import type { LineItem } from '@commercetools/platform-sdk';
import { button, div, img, input, section, style } from '@control.ts/min';

import productCard from '@components/ProductCard/ProductCard';
import cartService from '@services/CartService';

import styles from './BasketPage.module.scss';

export class BasketPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });

  public createPage(): HTMLElement {
    const container = div({ className: styles.pageContainer });

    const itemsContainer = div({ className: styles.itemsContainer });

    // Implement custom scrollbar indication
    const scrollbar = div({ className: styles.scrollbar });
    itemsContainer.addEventListener('scroll', () => {
      const max = itemsContainer.scrollHeight - itemsContainer.clientHeight;
      const scrolledValue = Math.abs(
        itemsContainer.scrollHeight - itemsContainer.clientHeight - itemsContainer.scrollTop,
      );
      const step =
        itemsContainer.clientHeight -
        scrollbar.clientHeight -
        Math.round(((itemsContainer.clientHeight - scrollbar.clientHeight) * scrolledValue) / max);
      console.log(step);
      scrollbar.style.top = `${step}px`;
    });
    container.append(scrollbar);

    container.append(itemsContainer);
    this.pageWrapper.append(container);
    this.renderItems(itemsContainer);
    return this.pageWrapper;
  }

  private async renderItems(container: HTMLElement): Promise<void> {
    const cart = await cartService.getActiveCart();
    const items = cart?.lineItems;

    items?.forEach(async (item) => {
      const basketItem = await this.createBasketItem(item);
      container.append(basketItem);
    });
    console.log(cart);
  }

  private async createBasketItem(lineItem: LineItem): Promise<HTMLElement> {
    const picData = lineItem.variant.images ? lineItem.variant.images[0] : null;
    const container = div({ className: styles.basketItem });

    const picContainer = div({ className: styles.picContainer });
    const pic = img({
      className: styles.pic,
      src: picData?.url,
      alt: picData?.label,
    });
    const name = div({ className: styles.name, txt: lineItem.name['en-US'] });
    const price = this.getPriceElement(lineItem);
    if (productCard.checkForDiscount(lineItem.variant)) {
      price.classList.add(styles.sale);
    }

    const controls = this.createQuantityControls(lineItem);

    container.append(picContainer, name, price, controls);
    picContainer.append(pic);

    return container;
  }

  private createQuantityControls(lineItem: LineItem) {
    const container = div({ className: styles.quantityContainer });
    const quantity = input({ className: styles.quantityInput, value: lineItem.quantity.toString() });
    const decreaseBtn = button({ className: styles.quantityBtn, txt: '-' });
    const increaseBtn = button({ className: styles.quantityBtn, txt: '+' });
    container.append(decreaseBtn, quantity, increaseBtn);

    return container;
  }

  private getPriceElement(lineItem: LineItem): HTMLElement {
    const priceContainer = div({ className: styles.priceContainer });
    const basePrice = div({ className: styles.basePrice, txt: productCard.formatPrice(lineItem.price.value) });
    priceContainer.append(basePrice);
    if (lineItem.price.discounted) {
      const discountedPrice = div({
        className: styles.discountedPrice,
        txt: productCard.formatPrice(lineItem.price.discounted.value),
      });
      priceContainer.append(discountedPrice);
    }

    return priceContainer;
  }
}
