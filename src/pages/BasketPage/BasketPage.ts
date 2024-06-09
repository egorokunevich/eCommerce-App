import { div, section } from '@control.ts/min';

import BasketItem from '@components/BasketItem/BasketItem';
import cartService from '@services/CartService';

import styles from './BasketPage.module.scss';

export class BasketPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private scrollbarElement: HTMLElement = div({});

  public createPage(): HTMLElement {
    const pageContainer = div({ className: styles.pageContainer });

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
    pageContainer.append(header, itemsWrapper);
    this.pageWrapper.append(pageContainer);
    this.renderItems(itemsContainer);
    return this.pageWrapper;
  }

  private createItemsHeader(): HTMLElement {
    const header = div({ className: styles.itemsHeader });
    const pic = div({ className: styles.headerPic });
    const name = div({ className: styles.headerName, txt: `Name` });
    const price = div({ className: styles.headerPrice, txt: `Price` });
    const amount = div({ className: styles.headerAmount, txt: `Amount` });
    const total = div({ className: styles.headerTotal, txt: `Total` });

    header.append(pic, name, price, amount, total);
    return header;
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

    items?.forEach(async (item) => {
      const basketItemEntity = new BasketItem(item);
      const basketItem = await basketItemEntity.createBasketItem();
      container.append(basketItem);
    });

    document.addEventListener('updateBasket', () => {
      // const cart =
    });
  }
}
