import type { Cart } from '@commercetools/platform-sdk';
import { button, div, h2, input, section } from '@control.ts/min';

import emptyBasket from '@components/BasketEmpty/BasketEmpty';
import BasketItem from '@components/BasketItem/BasketItem';
import { ToastColors, showToastMessage } from '@components/Toast';
import cartService from '@services/CartService';
import { isFetchError } from '@services/ClientService';

import styles from './BasketPage.module.scss';

export class BasketPage {
  public pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private pageContainer: HTMLElement = div({ className: styles.pageContainer });
  private scrollbarElement: HTMLElement = div({});
  private baseTotalPriceElement: HTMLElement = div({});
  private discountedTotalPriceElement: HTMLElement = div({});
  private cart: Cart | null = null;
  private totalContainer: HTMLElement = div({});

  public createPage(): HTMLElement {
    this.handleBasketUpdates();

    this.pageWrapper.append(this.pageContainer);

    document.addEventListener('updateBasket', async () => {
      const updatedCart = await cartService.getActiveCart();
      this.cart = updatedCart;
      this.handleTotalPrice();
      this.handleEmptyBasket();
    });

    return this.pageWrapper;
  }

  private async handleBasketUpdates(): Promise<void> {
    const cart = await cartService.getActiveCart();
    this.cart = cart;

    this.createBasketList(this.pageContainer);
  }

  private async handleEmptyBasket(): Promise<void> {
    try {
      const cart = await cartService.getActiveCart();
      const items = cart?.lineItems;
      if (items && items?.length === 0) {
        this.pageContainer.innerHTML = '';
        this.pageContainer.appendChild(emptyBasket.createBasketEmpty());
      }
      // else {
      //   showToastMessage('Failed to load the cart. Please, try again.');
      // }
    } catch (e) {
      showToastMessage('Failed to load the cart. Please, try again.');
      console.error(`Failed to load the cart.`, e);
    }
  }

  private createBasketList(container: HTMLElement): void {
    const cartHasItems = this.doesCartHasItems();

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
    } else {
      this.handleEmptyBasket();
    }
  }

  private doesCartHasItems(): boolean {
    return Boolean(this.cart?.lineItems.length && this.cart.lineItems.length > 0);
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
      this.clearCart();
    });

    header.append(pic, name, price, amount, total, clearCartBtn);
    return header;
  }

  private async confirmCartClean(wrapper: HTMLElement): Promise<void> {
    const response = await cartService.deleteActiveCart();
    if (response?.statusCode === 200) {
      wrapper.remove();
    } else {
      showToastMessage('Failed to clear the cart. Please, try again.');
    }
  }

  private createModalContainer(): HTMLElement {
    const modalContainer = div({ className: styles.modalContainer });

    const promptContainer = div({ className: styles.promptContainer });

    const promptTitle = h2({
      className: styles.promptTitle,
      txt: `Are you sure?`,
    });
    const promptText = div({
      className: styles.promptText,
      txt: `The following action will delete all the items from your cart.`,
    });

    promptContainer.append(promptTitle, promptText);
    modalContainer.append(promptContainer);

    return modalContainer;
  }

  private clearCart(): void {
    const modalWrapper = div({ className: styles.modalWrapper });
    const modalContainer = this.createModalContainer();
    const buttonsContainer = div({ className: styles.buttonsContainer });
    const confirmBtn = button({ className: styles.modalBtn, txt: `Confirm` });
    const denyBtn = button({ className: styles.modalBtn, txt: `Cancel` });
    denyBtn.classList.add(styles.denyBtn);
    modalWrapper.append(modalContainer);
    modalContainer.append(buttonsContainer);
    buttonsContainer.append(confirmBtn, denyBtn);
    const clearEventStart = new CustomEvent('clearStart');
    const clearEventEnd = new CustomEvent('clearEnd');
    const loader = div({ className: styles.loader });
    confirmBtn.addEventListener('clearStart', () => {
      confirmBtn.classList.add(styles.loading);
      confirmBtn.append(loader);
    });
    confirmBtn.addEventListener('clearEnd', () => {
      confirmBtn.classList.remove(styles.loading);
      confirmBtn.removeChild(loader);
    });
    confirmBtn.addEventListener('click', async () => {
      confirmBtn.dispatchEvent(clearEventStart);
      await this.confirmCartClean(modalWrapper);
      confirmBtn.dispatchEvent(clearEventEnd);
    });
    denyBtn.addEventListener('click', () => {
      modalWrapper.remove();
    });
    modalWrapper.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        modalWrapper.remove();
      }
    });
    document.body.append(modalWrapper);
  }

  private createItemsFooter(): HTMLElement {
    const footer = div({ className: styles.itemsFooter });
    const promoCodeContainer = div({ className: styles.promoCodeContainer });
    const promoCodeInput = input({ className: styles.promoCodeInput, placeholder: `Promocode...` });
    const promoCodeBtn = button({ className: styles.promoCodeBtn, txt: `Apply` });
    promoCodeContainer.append(promoCodeInput, promoCodeBtn);
    const checkoutContainer = div({ className: styles.checkoutContainer });
    const totalPriceContainer = div({ className: styles.totalPriceContainer });
    this.totalContainer = totalPriceContainer;
    const baseTotalPrice = div({ className: styles.baseTotalPrice, txt: `999.99 EUR` });
    const discountedTotalPrice = div({ className: styles.discountedTotalPrice, txt: `999.99 EUR` });
    this.baseTotalPriceElement = baseTotalPrice;
    this.discountedTotalPriceElement = discountedTotalPrice;
    totalPriceContainer.append(baseTotalPrice, discountedTotalPrice);
    const checkoutBtn = button({ className: styles.checkoutBtn, txt: `Checkout` });
    this.handleTotalPrice();
    promoCodeBtn.addEventListener('click', async () => {
      if (promoCodeInput.value.trim()) {
        try {
          const response = await cartService.applyPromoCodeToCart(promoCodeInput.value);
          if (response?.statusCode === 200) {
            showToastMessage('Promocode applied!', ToastColors.Green);
          } else {
            showToastMessage('Failed to apply promocode. Please, try again.');
          }
        } catch (e) {
          if (isFetchError(e) && e.statusCode === 400) {
            showToastMessage('Incorrect promocode', ToastColors.Blue);
          }
        }
      }
      this.handleTotalPrice();
    });
    checkoutContainer.append(totalPriceContainer, checkoutBtn);
    footer.append(promoCodeContainer, checkoutContainer);
    if (this.cart) {
      this.handleTotalPrice();
    }
    return footer;
  }

  private handleTotalPrice(): void {
    if (this.cart) {
      const { totalPrice } = this.cart;
      const currency = this.getCurrency(totalPrice.currencyCode);
      if (this.cart.discountOnTotalPrice) {
        this.totalContainer.classList.add(styles.discounted);
        const price =
          (totalPrice.centAmount + this.cart.discountOnTotalPrice.discountedAmount.centAmount) /
          10 ** totalPrice.fractionDigits;
        const discountedPrice = totalPrice.centAmount / 10 ** totalPrice.fractionDigits;
        this.baseTotalPriceElement.innerText = `${price.toFixed(2)} ${currency}`;
        this.discountedTotalPriceElement.innerText = `${discountedPrice.toFixed(2)} ${currency}`;
      } else {
        const price = totalPrice.centAmount / 10 ** totalPrice.fractionDigits;
        this.baseTotalPriceElement.innerText = `${price.toFixed(2)} ${currency}`;
        this.discountedTotalPriceElement.innerText = `${price.toFixed(2)} ${currency}`;
      }
    }
  }

  private getCurrency(currencyCode: string): string {
    let currency: string;
    switch (currencyCode) {
      case 'EUR':
        currency = '€';
        break;
      case 'USD':
        currency = '$';
        break;
      default:
        currency = '€';
        break;
    }

    return currency;
  }

  private handleScrollbarOpacity(): void {
    if (this.cart?.lineItems.length && this.cart.lineItems.length > 5) {
      this.scrollbarElement.classList.remove(styles.hidden);
    }
  }

  private async renderItems(container: HTMLElement): Promise<void> {
    const items = this.cart?.lineItems;

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
