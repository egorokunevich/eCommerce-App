import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, h2, img, input, option, section, select } from '@control.ts/min';
import type { API } from 'nouislider';
import noUiSlider, { PipsMode } from 'nouislider';
import { Router } from 'vanilla-routing';
import 'nouislider/dist/nouislider.css';

import productCard from '@components/ProductCard/ProductCard';
import clientService from '@services/ClientService';
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
    try {
      if (this.currentSorting === 'price asc') {
        productsService.getSortingQuery('price', 'asc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        this.updateCards(this.sortWithDiscounted(filtered, 'asc'));
      } else if (this.currentSorting === 'price desc') {
        productsService.getSortingQuery('price', 'desc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        this.updateCards(this.sortWithDiscounted(filtered, 'desc'));
      }
    } catch (e) {
      clientService.handleAuthError(e);
    }
  }

  private sortWithDiscounted(products: ProductProjection[], order: 'asc' | 'desc'): ProductProjection[] {
    const sorted = [...products];
    return sorted.sort((a, b) => {
      let priceA = 0;
      if (a.masterVariant.prices) {
        if (a.masterVariant.prices[0].discounted) {
          priceA = a.masterVariant.prices[0].discounted.value.centAmount;
        } else {
          priceA = a.masterVariant.prices[0].value.centAmount;
        }
      }
      let priceB = 0;
      if (b.masterVariant.prices) {
        if (b.masterVariant.prices[0].discounted) {
          priceB = b.masterVariant.prices[0].discounted.value.centAmount;
        } else {
          priceB = b.masterVariant.prices[0].value.centAmount;
        }
      }

      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });
  }

  private async sortByName(): Promise<void> {
    try {
      if (this.currentSorting === 'name asc') {
        productsService.getSortingQuery('name.en-US', 'asc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        this.updateCards(filtered);
      } else if (this.currentSorting === 'name desc') {
        productsService.getSortingQuery('name.en-US', 'desc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        this.updateCards(filtered);
      }
    } catch (e) {
      clientService.handleAuthError(e);
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
      productsService.clearSortQuery();
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);

      this.currentSorting = null;
      this.priceSortIcon.classList.add(styles.hidden);
      this.nameSortIcon.classList.add(styles.hidden);
      this.priceSortIcon.classList.remove(styles.active, styles.reverse);
      this.nameSortIcon.classList.remove(styles.active, styles.reverse);
    }
  }

  private createSidebar(): HTMLElement {
    const sidebar = div({ className: styles.sidebar });
    const filters = this.createFilters();
    const search = this.createSearchBar();
    sidebar.append(search, filters);
    return sidebar;
  }

  private createSearchBar(): HTMLElement {
    const searchContainer = div({ className: styles.filtersContainer });
    const searchTitle = div({ className: styles.filtersTitle, txt: 'SEARCH' });
    const barContainer = div({ className: styles.searchContainer });
    const searchBar = input({ className: styles.searchBar, placeholder: 'Search...' });
    searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.searchProducts(searchBar.value);
      }
    });
    const searchBtn = div({ className: styles.searchBtn });
    const cancelBtn = div({ className: styles.selectCancel });
    searchBtn.addEventListener('click', () => {
      this.searchProducts(searchBar.value);
    });
    cancelBtn.addEventListener('click', async () => {
      searchBar.value = '';
      productsService.clearSearchQuery();
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);
    });
    barContainer.append(searchBar, searchBtn, cancelBtn);
    searchContainer.append(searchTitle, barContainer);

    return searchContainer;
  }

  private async searchProducts(searchText: string): Promise<void> {
    productsService.getSearchQuery(searchText);
    const products = await productsService.getFilteredAndSortedProducts();
    this.updateCards(products);
  }

  private createFilters(): HTMLElement {
    const filtersContainer = div({ className: styles.filtersContainer });
    const filtersTitle = div({ className: styles.filtersTitle, txt: 'FILTERS' });
    const temperatureFilter = this.createTemperatureAttributeFilter();
    // const timeFilter = this.createTimeAttributeFilter();
    const weightFilter = this.createWeightAttributeFilter();
    filtersContainer.append(filtersTitle, this.createPriceRange(), weightFilter, temperatureFilter);

    return filtersContainer;
  }

  private createRangeSlider(container: HTMLElement): API {
    // Applying custom styles for a range slider
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
    const filterWrapper = div({ className: styles.rangeWrapper, id: 'range-container' });
    const title = div({ className: styles.selectName, txt: `Price Range` });
    const container = div({ className: styles.rangeContainer, id: 'range-container' });
    const range = div({ className: styles.range });

    const slider = this.createRangeSlider(range);

    slider.on('end', (rangeData) => {
      // this.priceRange = rangeData;
      this.filterByRange(rangeData);
    });

    container.append(range);
    filterWrapper.append(title, container);

    return filterWrapper;
  }

  private async filterByRange(range: (string | number)[]): Promise<void> {
    const min = Math.floor(+range[0]) * 100; // Lower bound in cents
    const max = Math.floor(+range[1]) * 100; // Upper bound in cents
    productsService.getPriceRangeFilterQuery(min, max); // Create request query
    const products = await productsService.getFilteredAndSortedProducts(); // Get matching products

    if (this.currentSorting === 'price asc') {
      this.updateCards(this.sortWithDiscounted(products, 'asc'));
    } else if (this.currentSorting === 'price desc') {
      this.updateCards(this.sortWithDiscounted(products, 'desc'));
    } else {
      this.updateCards(products);
    }
  }

  private createTemperatureAttributeFilter(): HTMLElement {
    const container = div({ className: styles.attributeContainer });
    const title = div({ className: styles.selectName, txt: `Brewing temperature` });
    const selectContainer = div({ className: styles.selectContainer });
    const selection = select({ className: styles.select, value: undefined });
    const cancelBtn = div({ className: styles.selectCancel });
    selectContainer.append(selection, cancelBtn);
    const optionInit = option({
      className: styles.option,
      value: undefined,
      txt: `Select an option`,
      disabled: true,
      selected: true,
      hidden: true,
    });
    cancelBtn.addEventListener('click', async () => {
      optionInit.selected = true;
      productsService.clearTemperatureQuery();
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);
    });
    const option2 = option({ className: styles.option, value: `25-50`, txt: `25 to 50 deg` });
    const option3 = option({ className: styles.option, value: `50-75`, txt: `50 to 75 deg` });
    const option4 = option({ className: styles.option, value: `75-100`, txt: `75 to 100 deg` });
    selection.append(optionInit, option2, option3, option4);

    selection.addEventListener('change', async () => {
      const value = +selection.value ? +selection.value : selection.value.split('-').map((item) => +item);
      productsService.getTemperatureFilterQuery(value);
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);
    });

    container.append(title, selectContainer);
    return container;
  }

  // private createTimeAttributeFilter(): HTMLElement {
  //   const container = div({ className: styles.attributeContainer });
  //   const title = div({ className: styles.selectName, txt: `Brewing time` });
  //   const selectContainer = div({ className: styles.selectContainer });
  //   const selection = select({ className: styles.select, value: undefined });
  //   const cancelBtn = div({ className: styles.selectCancel });
  //   selectContainer.append(selection, cancelBtn);
  //   cancelBtn.addEventListener('click', async () => {
  //     optionInit.selected = true;
  //     productsService.clearTimeQuery();
  //     const productsData = await productsService.getFilteredByAttributes();
  //     const products = productsData.body.results;
  //     this.updateCards(products);
  //   });
  //   const optionInit = option({
  //     className: styles.option,
  //     value: undefined,
  //     txt: `Select an option`,
  //     disabled: true,
  //     selected: true,
  //     hidden: true,
  //   });
  //   const option1 = option({ className: styles.option, value: `0-5`, txt: `less than 5 min` });
  //   const option2 = option({ className: styles.option, value: `5-10`, txt: `5 to 10 min` });
  //   const option3 = option({ className: styles.option, value: `10-100`, txt: `more than 10 min` });
  //   selection.append(optionInit, option1, option2, option3);

  //   selection.addEventListener('change', async () => {
  //     const value = +selection.value ? +selection.value : selection.value.split('-').map((item) => +item);
  //     productsService.getTimeFilterQuery(value);
  //     const productsData = await productsService.getFilteredByAttributes();
  //     const products = productsData.body.results;
  //     this.updateCards(products);
  //   });

  //   container.append(title, selectContainer);
  //   return container;
  // }

  private createWeightAttributeFilter(): HTMLElement {
    const container = div({ className: styles.attributeContainer });
    const title = div({ className: styles.selectName, txt: `Weight` });
    const selectContainer = div({ className: styles.selectContainer });
    const selection = select({ className: styles.select, value: undefined });
    const cancelBtn = div({ className: styles.selectCancel });
    selectContainer.append(selection, cancelBtn);
    const optionInit = option({
      className: styles.option,
      value: undefined,
      txt: `Select an option`,
      disabled: true,
      selected: true,
      hidden: true,
    });
    cancelBtn.addEventListener('click', async () => {
      optionInit.selected = true;
      productsService.clearWeightQuery();
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);
    });
    const option50 = option({ className: styles.option, value: `50g`, txt: `50g` });
    const option100 = option({ className: styles.option, value: `100g`, txt: `100g` });
    const option500 = option({ className: styles.option, value: `500g`, txt: `500g` });
    const option1000 = option({ className: styles.option, value: `1000g`, txt: `1000g` });
    selection.append(optionInit, option50, option100, option500, option1000);

    selection.addEventListener('change', async () => {
      productsService.getWeightFilterQuery(selection.value);
      const products = await productsService.getFilteredAndSortedProducts();
      this.updateCards(products);
    });

    container.append(title, selectContainer);
    return container;
  }

  private async createCards(productsArray?: ProductProjection[]): Promise<void> {
    let products;
    if (productsArray) {
      products = productsArray;
    } else {
      products = await productsService.getProducts();
    }
    if (productsArray?.length === 0) {
      const message = div({
        className: styles.noMatchingMessage,
        txt: `Sorry! There are no matching products for this filter.`,
      });
      this.cardsContainer.append(message);
    }
    products.forEach(async (product) => {
      const card = await productCard.createCard(product);
      const productKey = product.key;
      card.addEventListener('click', () => {
        Router.go(`/catalog/${productKey}`, { addToHistory: true });
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
