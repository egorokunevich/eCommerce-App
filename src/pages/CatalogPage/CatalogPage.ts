import type { Product, ProductProjection } from '@commercetools/platform-sdk';
import { div, h2, img, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import productCard from '@components/ProductCard/ProductCard';
import productsService from '@services/ProductsService';

import styles from './CatalogPage.module.scss';

type SortingOptions = 'price asc' | 'price desc' | 'name asc' | 'name desc' | null;

export class CatalogPage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });
  private cardsContainer: HTMLElement = div({ className: styles.cardsContainer });
  private currentSorting: SortingOptions = null;
  private priceSortIcon: HTMLElement = div({});
  private nameSortIcon: HTMLElement = div({});

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

    const sortingWrapper = div({ className: styles.sortingWrapper });
    const sortingControls = div({ className: styles.sortingControls });
    sortingWrapper.append(sortingControls);

    sortingControls.append(
      this.createPriceSortingOption(),
      this.createNameSortingOption(),
      this.createCancelSortingOption(),
    );

    barContainer.append(categoryTitle, sortingWrapper);
    return barContainer;
  }

  private createPriceSortingOption(): HTMLElement {
    const sortContainer = div({ className: styles.sortContainer });
    const sortTypeIcon = div({ className: styles.priceIcon });
    // const sortIcon = div({ className: styles.sortIcon });
    const sortIcon = img({ className: styles.sortIcon, src: '/assets/icons/up-arrow.png' });
    this.priceSortIcon = sortIcon;
    sortIcon.classList.add(styles.hidden);
    sortContainer.append(sortTypeIcon, sortIcon);
    sortContainer.addEventListener('click', async () => {
      if (this.currentSorting === 'price asc') {
        const filtered = await productsService.getSortedByPrice('desc');
        this.updateCards(filtered);
        this.currentSorting = 'price desc';
        sortIcon.classList.remove(styles.hidden);
        sortIcon.classList.add(styles.reverse);
      } else {
        const filtered = await productsService.getSortedByPrice('asc');
        this.updateCards(filtered);
        this.currentSorting = 'price asc';
        sortIcon.classList.remove(styles.hidden);
        sortIcon.classList.remove(styles.reverse);
      }
      this.nameSortIcon.classList.add(styles.hidden);
      sortIcon.classList.add(styles.active);
      this.nameSortIcon.classList.remove(styles.active);
    });

    return sortContainer;
  }

  private createNameSortingOption(): HTMLElement {
    const sortContainer = div({ className: styles.sortContainer });
    const sortTypeIcon = div({ className: styles.nameIcon });
    const sortIcon = img({ className: styles.sortIcon, src: '/assets/icons/up-arrow.png' });
    this.nameSortIcon = sortIcon;
    sortIcon.classList.add(styles.hidden);
    sortContainer.append(sortTypeIcon, sortIcon);
    sortContainer.addEventListener('click', async () => {
      if (this.currentSorting === 'name asc') {
        const filtered = await productsService.getSortedByName('desc');
        this.updateCards(filtered);
        this.currentSorting = 'name desc';
        sortIcon.classList.remove(styles.hidden);
        sortIcon.classList.add(styles.reverse);
      } else {
        const filtered = await productsService.getSortedByName('asc');
        this.updateCards(filtered);
        this.currentSorting = 'name asc';
        sortIcon.classList.remove(styles.hidden);
        sortIcon.classList.remove(styles.reverse);
      }
      this.priceSortIcon.classList.add(styles.hidden);
      sortIcon.classList.add(styles.active);
      this.priceSortIcon.classList.remove(styles.active);
    });

    return sortContainer;
  }

  private createCancelSortingOption(): HTMLElement {
    const sortContainer = div({ className: styles.sortContainer });
    sortContainer.classList.add(styles.cancel);
    const sortTypeIcon = div({ className: styles.cancelIcon });
    sortContainer.append(sortTypeIcon);
    sortContainer.addEventListener('click', async () => {
      if (this.currentSorting !== null) {
        const filtered = await productsService.getProducts();
        this.updateCards(filtered);
        this.currentSorting = null;
        this.priceSortIcon.classList.add(styles.hidden);
        this.nameSortIcon.classList.add(styles.hidden);
        this.priceSortIcon.classList.remove(styles.active);
        this.nameSortIcon.classList.remove(styles.active);
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
    products.forEach(async (product) => {
      const card = await productCard.createCard(product);
      const productId = product.id;
       card.addEventListener('click', () => {
        Router.go(`/catalog/${productId}`, { addToHistory: true });
      });
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
