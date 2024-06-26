import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, img, input, option, section, select, ul } from '@control.ts/min';
import type { API } from 'nouislider';
import noUiSlider, { PipsMode } from 'nouislider';
import { Router } from 'vanilla-routing';
import 'nouislider/dist/nouislider.css';

import CategoryItem from '@components/Category/Category';
import savedFilters from '@components/Category/SavedFilters';
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
  private breadcrumbs: HTMLElement = div({});
  private limit: number = productsService.Limit;
  private offset: number = productsService.Offset;

  public createPage(): HTMLElement {
    productsService.clearSearchQuery();
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
    const breadcrumbs = div({ className: styles.breadcrumbs });
    this.breadcrumbs = breadcrumbs;

    const sortingWrapper = div({ className: styles.sortingWrapper });
    const sortingControls = div({ className: styles.sortingControls });
    sortingWrapper.append(sortingControls);

    sortingControls.append(
      this.createPriceSortingOption(),
      this.createNameSortingOption(),
      this.createCancelSortingOption(),
    );

    barContainer.append(breadcrumbs, sortingWrapper);
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
        if (filtered) {
          this.updateCards(this.sortWithDiscounted(filtered, 'asc'));
        }
      } else if (this.currentSorting === 'price desc') {
        productsService.getSortingQuery('price', 'desc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        if (filtered) {
          this.updateCards(this.sortWithDiscounted(filtered, 'desc'));
        }
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
        if (filtered) {
          this.updateCards(filtered);
        }
      } else if (this.currentSorting === 'name desc') {
        productsService.getSortingQuery('name.en-US', 'desc');
        const filtered = await productsService.getFilteredAndSortedProducts();
        if (filtered) {
          this.updateCards(filtered);
        }
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
      if (products) {
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
    const filters = this.createFilters();
    const search = this.createSearchBar();
    const categoriesList = this.createCategoriesList();
    sidebar.append(search, filters, categoriesList);
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
      if (products) {
        this.updateCards(products);
      }
    });
    barContainer.append(searchBar, searchBtn, cancelBtn);
    searchContainer.append(searchTitle, barContainer);

    return searchContainer;
  }

  private async searchProducts(searchText: string): Promise<void> {
    productsService.getSearchQuery(searchText);
    const products = await productsService.getFilteredAndSortedProducts();
    if (products) {
      this.updateCards(products);
    }
  }

  private createCategoriesList(): HTMLElement {
    const container = div({ className: styles.categoriesContainer });
    const title = div({ className: styles.filtersTitle, txt: 'CATEGORIES' });

    this.createCategories(container);

    container.append(title);

    return container;
  }

  private async createCategories(container: HTMLElement): Promise<void> {
    const mainList = ul({ className: styles.mainList });
    const data = await productsService.getRootCategories();
    data.forEach(async (item) => {
      const category = new CategoryItem(item, this.breadcrumbs, (productsArray?: ProductProjection[]) => {
        this.updateCards(productsArray);
      });
      await category.create(mainList);
    });

    container.append(mainList);
  }

  private createFilters(): HTMLElement {
    const filtersContainer = div({ className: styles.filtersContainer });
    const filtersTitle = div({ className: styles.filtersTitle, txt: 'FILTERS' });
    const temperatureFilter = this.createTemperatureAttributeFilter();
    const weightFilter = this.createWeightAttributeFilter();
    filtersContainer.append(filtersTitle, this.createPriceRange(), weightFilter, temperatureFilter);

    return filtersContainer;
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
    if (savedFilters.priceRange) {
      const min = Math.floor(+savedFilters.priceRange[0]); // Lower bound in cents
      const max = Math.floor(+savedFilters.priceRange[1]); // Upper bound in cents
      slider.updateOptions({ start: [min, max] }, false);
    }
    return slider;
  }

  private createPriceRange(): HTMLElement {
    const filterWrapper = div({ className: styles.rangeWrapper, id: 'range-container' });
    const title = div({ className: styles.selectName, txt: `Price Range` });
    const container = div({ className: styles.rangeContainer, id: 'range-container' });
    const range = div({ className: styles.range });

    const slider = this.createRangeSlider(range);

    slider.on('set', (rangeData) => {
      savedFilters.priceRange = rangeData;
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
    if (products) {
      if (this.currentSorting === 'price asc') {
        this.updateCards(this.sortWithDiscounted(products, 'asc'));
      } else if (this.currentSorting === 'price desc') {
        this.updateCards(this.sortWithDiscounted(products, 'desc'));
      } else {
        this.updateCards(products);
      }
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
    cancelBtn.addEventListener('click', () => {
      this.cancelTemperatureFilter(optionInit);
    });
    const option2 = option({ className: styles.option, value: `25-50`, txt: `25 to 50 deg` });
    const option3 = option({ className: styles.option, value: `50-75`, txt: `50 to 75 deg` });
    const option4 = option({ className: styles.option, value: `75-100`, txt: `75 to 100 deg` });
    selection.append(optionInit, option2, option3, option4);
    if (savedFilters.brewingTemperature) {
      selection.value = savedFilters.brewingTemperature;
    }
    selection.addEventListener('change', async () => {
      savedFilters.brewingTemperature = selection.value;
      const value = +selection.value ? +selection.value : selection.value.split('-').map((item) => +item);
      productsService.getTemperatureFilterQuery(value);
      const products = await productsService.getFilteredAndSortedProducts();
      if (products) {
        this.updateCards(products);
      }
    });
    container.append(title, selectContainer);
    return container;
  }

  private async cancelTemperatureFilter(optionInit: HTMLOptionElement): Promise<void> {
    optionInit.selected = true;
    savedFilters.brewingTemperature = '';
    productsService.clearTemperatureQuery();
    const products = await productsService.getFilteredAndSortedProducts();
    if (products) {
      this.updateCards(products);
    }
  }

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
    cancelBtn.addEventListener('click', () => {
      this.cancelWeightFilter(optionInit);
    });
    const option50 = option({ className: styles.option, value: `50g`, txt: `50g` });
    const option100 = option({ className: styles.option, value: `100g`, txt: `100g` });
    const option500 = option({ className: styles.option, value: `500g`, txt: `500g` });
    const option1000 = option({ className: styles.option, value: `1000g`, txt: `1000g` });
    selection.append(optionInit, option50, option100, option500, option1000);
    if (savedFilters.weight) {
      selection.value = savedFilters.weight;
    }
    selection.addEventListener('change', async () => {
      productsService.getWeightFilterQuery(selection.value);
      savedFilters.weight = selection.value;
      const products = await productsService.getFilteredAndSortedProducts();
      if (products) {
        this.updateCards(products);
      }
    });
    container.append(title, selectContainer);
    return container;
  }

  private async cancelWeightFilter(optionInit: HTMLOptionElement): Promise<void> {
    optionInit.selected = true;
    savedFilters.weight = '';
    productsService.clearWeightQuery();
    const products = await productsService.getFilteredAndSortedProducts();
    if (products) {
      this.updateCards(products);
    }
  }

  private async createCards(productsArray?: ProductProjection[]): Promise<void> {
    let products;
    if (productsArray) {
      products = productsArray;
    } else {
      products = await productsService.getFilteredAndSortedProducts();
    }
    // Checking offset to be equal to 0 means that was filtering, not loading due to infinite scroll. Show a corresponding message if there are no matching results
    if (productsArray?.length === 0 && this.offset === 0) {
      const message = div({
        className: styles.noMatchingMessage,
        txt: `Sorry! There are no matching products for this filter.`,
      });
      this.cardsContainer.append(message);
    }

    if (products) {
      // Wait for all products to render and only after that run the observer
      const loaded = await Promise.all(
        products.map(async (product) => {
          const card = await productCard.createCard(product);
          const productKey = product.key;
          card.addEventListener('click', () => {
            Router.go(`/catalog/${productKey}`, { addToHistory: true });
          });
          this.cardsContainer.append(card);
          return card;
        }),
      );

      // If there are new rendered products, run the observer
      if (loaded.length > 0) {
        this.infiniteLoad();
      }
    }
  }

  private updateCards(productsArray?: ProductProjection[]): void {
    // Delete rendered cards
    this.cardsContainer.innerHTML = '';

    // Reset offset when filtering products
    this.offset = 0;

    // Render new cards
    if (this.cardsContainer.childNodes.length === 0) {
      this.createCards(productsArray);
    }
  }

  private loadCards(productsArray?: ProductProjection[]): void {
    // Render new cards
    this.createCards(productsArray);
  }

  private infiniteLoad(): void {
    const cardToObserve = this.cardsContainer.lastElementChild;

    const observer = new IntersectionObserver(async (entries) => {
      // Check for intersection
      if (entries[0].isIntersecting) {
        // Get next items in product list
        this.offset += this.limit;

        // Render new products
        const loadedProducts = await productsService.getFilteredAndSortedProducts(this.limit, this.offset);
        if (loadedProducts) {
          this.loadCards(loadedProducts);
        }

        // Unsubscribe the observer
        if (cardToObserve) {
          observer.unobserve(cardToObserve);
        }
      }
    });

    // Subscribe the observer
    if (cardToObserve) {
      observer.observe(cardToObserve);
    }
  }
}
