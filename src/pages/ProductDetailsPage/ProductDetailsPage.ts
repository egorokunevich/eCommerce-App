import type { ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import { div, section } from '@control.ts/min';

import productDetails from '@components/DetailsCard/DetailsCard';
import { createSwiper, createSwiperZoom } from '@components/Swiper';
import { ToastColors, showToastMessage } from '@components/Toast';
import productsService from '@services/ProductsService';

import styles from './ProductDetailsPage.module.scss';

export class ProductDetailsPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private detailsContainer: HTMLElement = div({ className: styles.cardsContainer });

  public createPage(productKey: string): HTMLElement {
    this.pageWrapper.append(this.detailsContainer);
    this.createDetails(productKey).catch((error) => console.error('Error creating product details:', error));
    return this.pageWrapper;
  }

  private async createDetails(key: string): Promise<void> {
    try {
      const response = await this.getProductByKey(key);
      const product = response.body;
      const card = await productDetails.createDetails(product);
      this.detailsContainer.append(card);
      createSwiper();
      createSwiperZoom();
    } catch (error) {
      showToastMessage(`Failed to load product's page. Please, try again.`, ToastColors.Red);
      console.error(`Error creating details for product ${key}:`, error);
    }
  }

  private async getProductByKey(key: string): Promise<ClientResponse<ProductProjection>> {
    return productsService.getProductByKey(key);
  }
}
