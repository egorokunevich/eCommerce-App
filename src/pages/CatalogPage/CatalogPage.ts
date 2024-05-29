import type { Product } from '@commercetools/platform-sdk';
import { div, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import productCard from '@components/ProductCard/ProductCard';
import productsService from '@services/ProductsService';

import styles from './CatalogPage.module.scss';

export class CatalogPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private cardsContainer: HTMLElement = div({ className: styles.cardsContainer });

  public createPage(): HTMLElement {
    this.pageWrapper.append(this.cardsContainer);

    this.createCards();

    return this.pageWrapper;
  }

  private async getProducts(): Promise<Product[]> {
    return (await productsService.getProducts()).body.results;
  }

  private async createCards(): Promise<void> {
    const products = await this.getProducts();

    products.forEach(async (product) => {
      const card = await productCard.createCard(product);
      const productId = product.id;
      card.addEventListener('click', () => {
        Router.go(`/catalog/${productId}`, { addToHistory: true });
      });
      this.cardsContainer.append(card);
    });
  }
}
