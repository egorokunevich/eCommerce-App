import { button, div, input, section } from '@control.ts/min';

import BasketItem from '@components/BasketItem/BasketItem';
import cartService from '@services/CartService';

import styles from './BasketPage.module.scss';

export class BasketPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private scrollbarElement: HTMLElement = div({});

  public createPage(): HTMLElement {
    const pageContainer = div({ className: styles.pageContainer });

    this.createBasketList(pageContainer);

    this.pageWrapper.append(pageContainer);
    return this.pageWrapper;
  }

  private async createBasketList(container: HTMLElement): Promise<void> {
    const cartHasItems = await this.doesCartHasItems();

    if (cartHasItems) {
      const header = this.createItemsHeader();

      const itemsWrapper = div({ className: styles.itemsWrapper });

      const itemsContainer = div({ className: styles.itemsContainer });

      // Implement custom scrollbar indication
      const scrollbar = div({ className: styles.scrollbar });
      scrollbar.classList.add(styles.hidden);
      this.scrollbarElement = scrollbar;
      itemsContainer.addEventListener('scroll', () => {
        const max = itemsContainer.scrollHeight - itemsContainer.clientHeight;
        const scrolledValue = Math.abs(
          itemsContainer.scrollHeight - itemsContainer.clientHeight - itemsContainer.scrollTop,
        );
        const step =
          itemsContainer.clientHeight -
          scrollbar.clientHeight -
          Math.round(((itemsContainer.clientHeight - scrollbar.clientHeight) * scrolledValue) / max);
        scrollbar.style.top = `${step}px`;
      });
      this.handleScrollbarOpacity();

      itemsWrapper.append(scrollbar, itemsContainer);
      container.append(header, itemsWrapper);

      this.renderItems(itemsContainer);
    }
  }

  private async doesCartHasItems(): Promise<boolean> {
    const cart = await cartService.getActiveCart();

    if (cart?.lineItems.length && cart.lineItems.length > 0) {
      return true;
    }
    return false;
  }

  private createItemsHeader(): HTMLElement {
    const header = div({ className: styles.itemsHeader });
    const pic = div({ className: styles.headerPic });
    const name = div({ className: styles.headerName, txt: `Name` });
    const price = div({ className: styles.headerPrice, txt: `Price` });
    const amount = div({ className: styles.headerAmount, txt: `Amount` });
    const total = div({ className: styles.headerTotal, txt: `Total` });

    const clearCartBtn = div({ className: styles.clearCartBtn });
    clearCartBtn.addEventListener('click', () => {
      // Implement functionality to clear the cart
    });

    header.append(pic, name, price, amount, total, clearCartBtn);
    return header;
  }

  private createItemsFooter(): HTMLElement {
    const footer = div({ className: styles.itemsFooter });

    const promoCodeContainer = div({ className: styles.promoCodeContainer });
    const promoCodeInput = input({ className: styles.promoCodeInput, placeholder: `Promocode...` });
    const promoCodeBtn = button({ className: styles.promoCodeBtn, txt: `Apply` });
    promoCodeContainer.append(promoCodeInput, promoCodeBtn);

    const checkoutContainer = div({ className: styles.checkoutContainer });

    const totalPriceContainer = div({ className: styles.totalPriceContainer });
    const baseTotalPrice = div({ className: styles.baseTotalPrice, txt: `999.99 EUR` });
    const discountedTotalPrice = div({ className: styles.discountedTotalPrice, txt: `999.99 EUR` });
    totalPriceContainer.append(baseTotalPrice, discountedTotalPrice);

    const checkoutBtn = button({ className: styles.checkoutBtn, txt: `Checkout` });

    promoCodeBtn.addEventListener('click', () => {
      // Implement promo code applying. And display a Toast message for success/fail
      // To display discounted price:  totalPriceContainer.classList.add(styles.discounted);
      totalPriceContainer.classList.add(styles.discounted);
    });

    checkoutContainer.append(totalPriceContainer, checkoutBtn);
    footer.append(promoCodeContainer, checkoutContainer);

    return footer;
  }

  private async handleScrollbarOpacity(): Promise<void> {
    const cart = await cartService.getActiveCart();
    if (cart?.lineItems.length && cart?.lineItems.length > 5) {
      this.scrollbarElement.classList.remove(styles.hidden);
    }
  }

  private async renderItems(container: HTMLElement): Promise<void> {
    const cart = await cartService.getActiveCart();
    const items = cart?.lineItems;

    if (items) {
      await Promise.all(
        items.map(async (item) => {
          const basketItemEntity = new BasketItem(item);
          const basketItem = await basketItemEntity.createBasketItem();
          container.append(basketItem);

          return item;
        }),
      );

      const footer = this.createItemsFooter();
      const itemsWrapper = container.parentNode;
      if (itemsWrapper) {
        itemsWrapper.parentNode?.append(footer);
      }
    }
  }
}
