import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, h2, img, section } from '@control.ts/min';
import type { API } from 'nouislider';
import noUiSlider, { PipsMode } from 'nouislider';
import 'nouislider/dist/nouislider.css';

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
  private priceRange: (string | number)[] | null = null;

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
        this.currentSorting = 'price desc';
        this.sortByPrice();
        this.priceSortIcon.classList.remove(styles.hidden);
        this.priceSortIcon.classList.add(styles.reverse);
      } else {
        this.currentSorting = 'price asc';
        this.sortByPrice();
        this.priceSortIcon.classList.remove(styles.hidden, styles.reverse);
      }
      this.priceSortIcon.classList.add(styles.active);
      this.nameSortIcon.classList.add(styles.hidden);
      this.nameSortIcon.classList.remove(styles.active, styles.reverse);
    });

    return sortContainer;
  }

  private async sortByPrice(): Promise<void> {
    if (this.currentSorting === 'price asc') {
      const filtered = this.priceRange
        ? await productsService.getSortedByPrice('asc', this.priceRange)
        : await productsService.getSortedByPrice('asc');
      this.updateCards(filtered);
    } else if (this.currentSorting === 'price desc') {
      const filtered = this.priceRange
        ? await productsService.getSortedByPrice('desc', this.priceRange)
        : await productsService.getSortedByPrice('desc');
      this.updateCards(filtered);
    }
  }

  private async sortByName(): Promise<void> {
    if (this.currentSorting === 'name asc') {
      const filtered = this.priceRange
        ? await productsService.getSortedByName('asc', this.priceRange)
        : await productsService.getSortedByName('asc');
      this.updateCards(filtered);
    } else if (this.currentSorting === 'name desc') {
      const filtered = this.priceRange
        ? await productsService.getSortedByName('desc', this.priceRange)
        : await productsService.getSortedByName('desc');
      this.updateCards(filtered);
    }
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
        this.currentSorting = 'name desc';
        this.sortByName();
        this.nameSortIcon.classList.remove(styles.hidden);
        this.nameSortIcon.classList.add(styles.reverse);
      } else {
        this.currentSorting = 'name asc';
        this.sortByName();
        this.nameSortIcon.classList.remove(styles.hidden);
        this.nameSortIcon.classList.remove(styles.reverse);
      }
      this.priceSortIcon.classList.add(styles.hidden);
      this.nameSortIcon.classList.add(styles.active);
      this.priceSortIcon.classList.remove(styles.active, styles.reverse);
    });

    return sortContainer;
  }

  private createCancelSortingOption(): HTMLElement {
    const sortContainer = div({ className: styles.sortContainer });
    sortContainer.classList.add(styles.cancel);
    const sortTypeIcon = div({ className: styles.cancelIcon });
    sortContainer.append(sortTypeIcon);
    sortContainer.addEventListener('click', async () => {
      this.cancelSorting();
    });

    return sortContainer;
  }

  private async cancelSorting(): Promise<void> {
    if (this.currentSorting !== null) {
      if (this.priceRange) {
        this.filterByRange(this.priceRange);
      } else {
        const products = await productsService.getProducts();
        this.updateCards(products);
      }

      this.currentSorting = null;
      this.priceSortIcon.classList.add(styles.hidden);
      this.nameSortIcon.classList.add(styles.hidden);
      this.priceSortIcon.classList.remove(styles.active, styles.reverse);
      this.nameSortIcon.classList.remove(styles.active, styles.reverse);
    }
  }

  private createSidebar(): HTMLElement {
    const sidebar = div({ className: styles.sidebar });
    const filtersContainer = div({ className: styles.filtersContainer });
    const filtersTitle = div({ className: styles.filtersTitle, txt: 'FILTERS' });
    filtersContainer.append(filtersTitle, this.createPriceRange());
    sidebar.append(filtersContainer);
    return sidebar;
  }

  private createRangeSlider(container: HTMLElement): API {
    noUiSlider.cssClasses.tooltip += ` ${styles.noUiTooltip}`;
    noUiSlider.cssClasses.markerHorizontal += ` ${styles.noUiMarker}`;
    noUiSlider.cssClasses.pipsHorizontal += ` ${styles.noUiPips}`;
    noUiSlider.cssClasses.horizontal += ` ${styles.noUiHorizontal}`;
    noUiSlider.cssClasses.handle += ` ${styles.noUiHandle}`;
    noUiSlider.cssClasses.connect += ` ${styles.noUiConnect}`;
    noUiSlider.cssClasses.markerHorizontal += ` ${styles.noUiMarkerHorizontal}`;
    noUiSlider.cssClasses.markerLarge += ` ${styles.noUiMarkerLarge}`;
    noUiSlider.cssClasses.valueHorizontal += ` ${styles.noUiValueHorizontal}`;

    const slider = noUiSlider.create(container, {
      range: {
        min: [0],
        '20%': [10, 1],
        '40%': [20, 1],
        '60%': [30, 1],
        '80%': [40, 1],
        max: [50],
      },
      start: [0, 50],
      step: 1,
      connect: true,
      tooltips: {
        to(value) {
          return `${value} €`;
        },
      },
      pips: {
        mode: PipsMode.Range,
        density: 4,
      },
    });

    return slider;
  }

  private createPriceRange(): HTMLElement {
    const container = div({ className: styles.rangeContainer, id: 'range-container' });
    const range = div({ className: styles.range });

    const slider = this.createRangeSlider(range);

    slider.on('end', (rangeData) => {
      this.priceRange = rangeData;
      if (this.currentSorting === 'price asc' || this.currentSorting === 'price desc') {
        this.sortByPrice();
      } else if (this.currentSorting === 'name asc' || this.currentSorting === 'name desc') {
        this.sortByName();
      } else {
        this.filterByRange(rangeData);
      }
    });

    container.append(range);

    return container;
  }

  private async filterByRange(range: (string | number)[]): Promise<void> {
    const min = Math.floor(+range[0]) * 100; // Lower bound in cents
    const max = Math.floor(+range[1]) * 100; // Upper bound in cents
    const productsData = await productsService.getFilteredByPriceRange(min, max);
    const products = productsData.body.results;

    this.updateCards(products);
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
