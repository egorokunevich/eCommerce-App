import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, h2, section } from '@control.ts/min';

import productCard from '@components/ProductCard/ProductCard';
import productsService from '@services/ProductsService';

import styles from './CatalogPage.module.scss';

export class CatalogPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private cardsContainer: HTMLElement = div({ className: styles.cardsContainer });
  private currentSorting: 'price asc' | 'price desc' | null = null;

  public createPage(): HTMLElement {
    const productsContent = div({ className: styles.productsContent });

    productsContent.append(this.createSortingControls(), this.cardsContainer);

    this.pageWrapper.append(productsContent);

    const sidebar = this.createSidebar();
    productsContent.before(sidebar);

    this.createCards();

    return this.pageWrapper;
  }

  private createSortingControls(): HTMLElement {
    const barContainer = div({ className: styles.barContainer });
    const categoryTitle = h2({ className: styles.categoryTitle, txt: 'Category title' });

    const filterControls = div({ className: styles.filterControls });

    filterControls.append(this.createPriceSortingOption());

    barContainer.append(categoryTitle, filterControls);
    return barContainer;
  }

  private createPriceSortingOption(): HTMLElement {
    const sortContainer = div({ className: styles.sortContainer });
    const sortTypeIcon = div({ className: styles.priceIcon });
    const sortIcon = div({ className: styles.sortIcon });
    sortContainer.append(sortTypeIcon, sortIcon);
    sortContainer.addEventListener('click', async () => {
      if (this.currentSorting === 'price asc') {
        const filtered = await productsService.getFilteredByPrice('desc');
        this.updateCards(filtered);
        this.currentSorting = 'price desc';
      } else {
        const filtered = await productsService.getFilteredByPrice('asc');
        this.updateCards(filtered);
        this.currentSorting = 'price asc';
      }
    });

    return sortContainer;
  }

  private createSidebar(): HTMLElement {
    const sidebar = div({ className: styles.sidebar, txt: 'add categories' });

    return sidebar;
  }

  private async createCards(productsArray?: ProductProjection[]): Promise<void> {
    let products;
    if (productsArray) {
      products = productsArray;
    } else {
      products = await productsService.getProducts();
    }
    products.forEach((product) => {
      const card = productCard.createCard(product);
      this.cardsContainer.append(card);
    });
  }

  private updateCards(productsArray?: ProductProjection[]): void {
    // Delete rendered cards
    this.cardsContainer.innerHTML = '';

    // Render new cards
    if (this.cardsContainer.childNodes.length === 0) {
      this.createCards(productsArray);
    }
  }
}
