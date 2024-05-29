import type { ClientResponse, Product } from '@commercetools/platform-sdk';
import { div, section } from '@control.ts/min';

import productDetails from '@components/DetailsCard/DetailsCard';
import productsService from '@services/ProductsService';

import styles from './ProductDetailsPage.module.scss';

export class ProductDetailsPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private detailsContainer: HTMLElement = div({ className: styles.cardsContainer });

  public createPage(productId: string): HTMLElement {
    this.pageWrapper.append(this.detailsContainer);
    this.createDetails(productId).catch((error) => console.error('Error creating product details:', error));
    return this.pageWrapper;
  }

  private async getProductById(productId: string): Promise<ClientResponse<Product>> {
    return productsService.getProductById(productId);
  }

  private async createDetails(productId: string): Promise<void> {
    try {
      const response = await this.getProductById(productId);
      const product = response.body;
      const card = await productDetails.createDetails(product);
      this.detailsContainer.append(card);
    } catch (error) {
      console.error(`Error creating details for product ID ${productId}:`, error);
    }
  }
}
