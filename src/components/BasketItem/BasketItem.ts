import type { LineItem, TypedMoney } from '@commercetools/platform-sdk';
import { button, div, img, input } from '@control.ts/min';

import productCard from '@components/ProductCard/ProductCard';
import { ToastColors, showToastMessage } from '@components/Toast';
import cartService, { updateBasketEvent } from '@services/CartService';

import styles from './BasketItem.module.scss';

export default class BasketItem {
  private pricePerItem: TypedMoney;
  private totalPriceElement: HTMLElement = div({});
  private element: HTMLElement = div({});

  constructor(private readonly lineItem: LineItem) {
    this.pricePerItem = this.getActualPrice();
  }
  public async createBasketItem(): Promise<HTMLElement> {
    const picData = this.lineItem.variant.images ? this.lineItem.variant.images[0] : null;
    const container = div({ className: styles.basketItem });
    this.element = container;

    const picContainer = div({ className: styles.picContainer });
    const pic = img({
      className: styles.pic,
      src: picData?.url,
      alt: picData?.label,
    });
    const detailsContainer = div({ className: styles.detailsContainer });
    const moneyContainer = div({ className: styles.moneyContainer });
    const name = div({ className: styles.itemName, txt: this.lineItem.name['en-US'] });
    const price = this.getPriceElement();
    if (productCard.checkForDiscount(this.lineItem.variant)) {
      price.classList.add(styles.sale);
    }
    const controls = this.createQuantityControls();
    const total = this.createTotalPrice();
    const deleteBtn = button({ className: styles.deleteBtn });

    deleteBtn.addEventListener('click', async () => {
      // Implement functionality to remove the item from cart
      const response = await cartService.removeProductFromCart(this.lineItem.id);
      if (response?.statusCode === 200) {
        this.destroy();
      } else if (response?.statusCode === 404) {
        showToastMessage('No product found :(', ToastColors.Red);
      }
    });

    detailsContainer.append(name, moneyContainer);
    moneyContainer.append(price, controls, total);

    container.append(picContainer, detailsContainer, deleteBtn);
    picContainer.append(pic);

    return container;
  }

  private createTotalPrice(): HTMLElement {
    const totalMoney = {
      centAmount: this.pricePerItem.centAmount,
      currencyCode: this.pricePerItem.currencyCode,
      fractionDigits: this.pricePerItem.fractionDigits,
      type: this.pricePerItem.type,
      preciseAmount: this.pricePerItem.centAmount,
    };
    totalMoney.centAmount *= this.lineItem.quantity;
    const price = div({
      className: styles.totalPrice,
      txt: productCard.formatPrice(totalMoney),
    });

    this.totalPriceElement = price;

    return price;
  }

  private createQuantityControls(): HTMLElement {
    const container = div({ className: styles.quantityContainer });
    const counter = input({ className: styles.quantityInput, value: this.lineItem.quantity.toString() });
    const decreaseBtn = button({ className: styles.quantityBtn, txt: '-' });
    const increaseBtn = button({ className: styles.quantityBtn, txt: '+' });
    container.append(decreaseBtn, counter, increaseBtn);

    decreaseBtn.addEventListener('click', () => {
      if (+counter.value > 1) {
        counter.value = (+counter.value - 1).toString();
      }
      this.updateTotalPrice(+counter.value);
      document.dispatchEvent(updateBasketEvent);
    });

    increaseBtn.addEventListener('click', async () => {
      if (+counter.value < 99) {
        counter.value = (+counter.value + 1).toString();
      }
      this.updateTotalPrice(+counter.value);
      document.dispatchEvent(updateBasketEvent);
    });

    counter.addEventListener('input', () => {
      counter.value = this.correctCounterValue(counter.value);
      if (!+counter.value) {
        counter.value = '1';
      }
      if (+counter.value < 1) {
        counter.value = '1';
      }
      if (+counter.value > 99) {
        counter.value = '99';
      }
      this.updateTotalPrice(+counter.value);
      document.dispatchEvent(updateBasketEvent);
    });

    return container;
  }

  private updateTotalPrice(value: number): void {
    cartService.updateItemQuantityInCart(this.lineItem.id, value);
    const totalMoney = {
      centAmount: this.pricePerItem.centAmount,
      currencyCode: this.pricePerItem.currencyCode,
      fractionDigits: this.pricePerItem.fractionDigits,
      type: this.pricePerItem.type,
      preciseAmount: this.pricePerItem.centAmount,
    };
    totalMoney.centAmount *= value;
    this.totalPriceElement.innerText = productCard.formatPrice(totalMoney);
  }

  private correctCounterValue(value: string): string {
    return value.replace(/[\s~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g, '');
  }

  private getActualPrice(): TypedMoney {
    if (this.lineItem.price.discounted) {
      return this.lineItem.price.discounted.value;
    }
    return this.lineItem.price.value;
  }

  private getPriceElement(): HTMLElement {
    const priceContainer = div({ className: styles.priceContainer });
    const basePrice = div({ className: styles.basePrice, txt: productCard.formatPrice(this.lineItem.price.value) });
    priceContainer.append(basePrice);
    if (this.lineItem.price.discounted) {
      const discountedPrice = div({
        className: styles.discountedPrice,
        txt: productCard.formatPrice(this.lineItem.price.discounted.value),
      });
      priceContainer.append(discountedPrice);
    }

    return priceContainer;
  }

  private destroy(): void {
    this.element.remove();
  }
}
