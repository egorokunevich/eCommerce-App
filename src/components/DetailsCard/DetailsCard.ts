import type { ProductProjection } from '@commercetools/platform-sdk';
import { button, div, p, span } from '@control.ts/min';

import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductCard } from '@components/ProductCard/ProductCard';
import styles from '@components/ProductCard/ProductCard.module.scss';
import { ToastColors, showToastMessage } from '@components/Toast';
import cartService, { productAddedToCartEvent, productRemovedFromCartEvent } from '@services/CartService';

const attributeLabels: { [key: string]: string } = {
  full_description: 'Full Description',
  region: 'Region of origin',
  origin: 'Region of origin',
  roastLevel: 'Level of roast',
  beanType: 'Type of bean',
  intensity: 'Intensity',
  weight: 'Weight',
  expirationDate: 'Expiry date',
  flavorProfile: 'Flavor profile',
  brewingTemperature: 'Brewing temperature',
  certifications: 'Certifications',
};

export class ProductDetails extends ProductCard {
  public async createDetails(product: ProductProjection): Promise<HTMLDivElement> {
    const card = await super.createCard(product);
    card.classList.add(styles.details);

    await this.addRemoveButton(card, product.id);

    const sliderContainer = this.createSlider(product);
    card.appendChild(sliderContainer);

    const modalContainer = this.createModal(product);
    card.appendChild(modalContainer);

    const attributesContainer = this.createAttributesContainer(product);
    card.append(attributesContainer);

    return card;
  }

  private async addRemoveButton(card: HTMLDivElement, productId: string): Promise<HTMLButtonElement> {
    const btnFromCatalogPage = card.querySelector(`.${styles.addToCartBtn}`);
    btnFromCatalogPage?.remove();
    const btnRemove = button({ className: styles.addToCartBtn });
    btnRemove.classList.add(styles.removeBtn);
    btnRemove.disabled = true;
    const btnAdd = button({ className: styles.addToCartBtn });
    btnAdd.disabled = false;

    const btnContainer = card.querySelector(`.${styles.price}`);
    if (btnContainer) {
      btnContainer.append(btnAdd, btnRemove);

      try {
        const isProductInCart = await cartService.checkIfProductIsInCart(productId);
        btnRemove.disabled = !isProductInCart;
        btnAdd.disabled = isProductInCart;
      } catch (error) {
        console.error('Failed to check if product is in cart:', error);
      }

      btnAdd.addEventListener('click', async () => this.addToCart(productId, btnAdd, btnRemove));
      btnRemove.addEventListener('click', async () => this.removeFromCart(productId, btnAdd, btnRemove));

      document.addEventListener('productAddedToCart', () => {
        this.updateButtonState(productId, btnAdd, btnRemove);
      });

      document.addEventListener('productRemovedFromCart', () => {
        this.updateButtonState(productId, btnAdd, btnRemove);
      });
    } else {
      console.warn('Button container not found!');
    }

    return btnRemove;
  }

  private async addToCart(productId: string, btnAdd: HTMLButtonElement, btnRemove: HTMLButtonElement): Promise<void> {
    try {
      const addToCartStart = new CustomEvent('addToCartStart');
      const loader = div({ className: styles.loader });
      btnAdd.addEventListener('addToCartStart', () => {
        btnAdd.classList.add(styles.loading);
        btnAdd.append(loader);
      });
      btnAdd.addEventListener('addToCartEnd', () => {
        btnAdd.classList.remove(styles.loading);
        btnAdd.removeChild(loader);
      });
      btnAdd.dispatchEvent(addToCartStart);
      const response = await cartService.addProductToCart(productId);
      if (response?.statusCode === 200) {
        showToastMessage('Good choice! Product added to cart.', ToastColors.Green);
        btnRemove.disabled = false;
        btnAdd.disabled = true;
        document.dispatchEvent(productAddedToCartEvent);
      } else {
        showToastMessage('Failed to add this product to cart', ToastColors.Red);
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
    const addToCartEnd = new CustomEvent('addToCartEnd');
    btnAdd.dispatchEvent(addToCartEnd);
  }

  private async removeFromCart(
    productId: string,
    btnAdd: HTMLButtonElement,
    btnRemove: HTMLButtonElement,
  ): Promise<void> {
    try {
      const addToCartStart = new CustomEvent('addToCartStart');
      const loader = div({ className: styles.loader });
      btnRemove.addEventListener('addToCartStart', () => {
        btnRemove.classList.add(styles.loading);
        btnRemove.append(loader);
      });
      btnRemove.addEventListener('addToCartEnd', () => {
        btnRemove.classList.remove(styles.loading);
        btnRemove.removeChild(loader);
      });
      btnRemove.dispatchEvent(addToCartStart);
      const response = await cartService.removeProductFromCartByProductId(productId);
      if (response && response.statusCode === 200) {
        showToastMessage('Product removed from cart');
        btnRemove.disabled = true;
        btnAdd.disabled = false;
      } else {
        showToastMessage('Failed to remove this product from cart', ToastColors.Red);
      }
      document.dispatchEvent(productRemovedFromCartEvent);
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
      showToastMessage('Failed to add product to cart', ToastColors.Red);
    }
    const addToCartEnd = new CustomEvent('addToCartEnd');
    btnRemove.dispatchEvent(addToCartEnd);
  }

  private async updateButtonState(
    productId: string,
    btnAdd: HTMLButtonElement,
    btnRemove: HTMLButtonElement,
  ): Promise<void> {
    try {
      const isProductInCart = await cartService.checkIfProductIsInCart(productId);
      btnRemove.disabled = !isProductInCart;
      btnAdd.disabled = isProductInCart;
    } catch (error) {
      console.error('Failed to update button state:', error);
    }
  }

  private createSlider(product: ProductProjection): HTMLDivElement {
    const sliderContainer = div({ className: 'swiper' });
    sliderContainer.classList.add('swiper-style');
    const sliderWrapper = div({ className: 'swiper-wrapper' });
    sliderWrapper.classList.add('swiper-wrapper-style');
    const btnNext = div({ className: 'swiper-button-next' });
    btnNext.classList.add('btn-next-style');
    const btnPrev = div({ className: 'swiper-button-prev' });
    btnPrev.classList.add('btn-prev-style');
    const pagination = div({ className: 'swiper-pagination' });
    pagination.classList.add('pagination-style');

    const images = product.masterVariant.images || [];
    images.forEach((image) => {
      const slide = div({ className: 'swiper-slide' });
      const img = document.createElement('img');
      if (img && image) {
        img.src = image.url;
        img.alt = image.label || 'Image';
        img.onclick = (): void => this.displayModal(img);
        slide.appendChild(img);
      }
      sliderWrapper.appendChild(slide);
    });

    sliderContainer.appendChild(sliderWrapper);
    sliderContainer.appendChild(btnNext);
    sliderContainer.appendChild(btnPrev);
    sliderContainer.appendChild(pagination);

    return sliderContainer;
  }

  private createModal(product: ProductProjection): HTMLDivElement {
    const modal = div({ id: 'modal', className: styles.modal });

    const closeButton = span({ className: styles.close, txt: '×' });
    closeButton.onclick = (): void => this.hideModal();
    const modalContent = div({ className: styles.modalContent });
    modalContent.classList.add('swiper-zoom');
    const sliderWrapper = div({ className: 'swiper-wrapper' });
    sliderWrapper.classList.add(styles.swiperWrapperStyle);
    const btnNext = div({ className: 'swiper-button-next' });
    btnNext.classList.add(styles.btnNextStyle);
    const btnPrev = div({ className: 'swiper-button-prev' });
    btnPrev.classList.add(styles.btnPrevStyle);
    const pagination = div({ className: 'swiper-pagination' });
    pagination.classList.add(styles.paginationStyle);

    const images = product.masterVariant.images || [];
    images.forEach((image) => {
      const slide = div({ className: 'swiper-slide' });
      slide.classList.add(styles.swiperSlideStyle);
      const img = document.createElement('img');
      if (img && image) {
        img.src = image.url;
        img.alt = image.label || 'Image';
        img.id = 'modal-image';
        slide.appendChild(img);
      }
      sliderWrapper.appendChild(slide);
    });

    modalContent.appendChild(sliderWrapper);
    modalContent.appendChild(btnNext);
    modalContent.appendChild(btnPrev);
    modalContent.appendChild(pagination);
    modal.appendChild(closeButton);
    modal.appendChild(modalContent);
    return modal;
  }

  private displayModal(imgElement: HTMLImageElement): void {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    if (modal && modalImage && modalImage instanceof HTMLImageElement) {
      modal.style.display = 'block';
      modalImage.src = imgElement.src;
      const salePercentage = document.querySelector(`.${styles.salePercentage}`);
      const price = document.querySelector(`.${styles.price}`);
      if (salePercentage && salePercentage instanceof HTMLElement) {
        salePercentage.style.display = 'none';
      }
      if (price && price instanceof HTMLElement) {
        price.style.display = 'none';
      }
    }
  }

  private hideModal(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
      const salePercentage = document.querySelector(`.${styles.salePercentage}`);
      const price = document.querySelector(`.${styles.price}`);
      if (salePercentage && salePercentage instanceof HTMLElement) {
        salePercentage.style.display = '';
      }
      if (price && price instanceof HTMLElement) {
        price.style.display = '';
      }
    }
  }

  private createAttributesContainer(product: ProductProjection): HTMLDivElement {
    const attributesContainer = div({ className: styles.attributesContainer });
    const { attributes } = product.masterVariant;
    if (attributes && attributes.length > 0) {
      for (let i = 0; i < attributes.length; i++) {
        let attributeField;
        if (attributes[i].name === 'full_description') {
          attributeField = p({
            className: styles.attributes,
            txt: `${this.getAttributeValue(product, i + 1)}`,
          });
          attributesContainer.insertBefore(attributeField, attributesContainer.firstChild);
        } else {
          attributeField = p({
            className: styles.attributes,
            txt: `${this.getAttributeLabel(attributes[i].name)}: ${this.getAttributeValue(product, i + 1)}`,
          });
          attributesContainer.append(attributeField);
        }
      }
    }
    return attributesContainer;
  }

  private getAttributeValue(product: ProductProjection, index: number): string {
    const customFields = product.masterVariant.attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.value.toString();
    }
    return 'No attributes';
  }

  private getAttributeLabel(attributeName: string): string {
    return attributeLabels[attributeName] || attributeName;
  }
}

const productDetails = new ProductDetails();
export default productDetails;
