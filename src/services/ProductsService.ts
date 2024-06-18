import type {
  Category,
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';

import { ToastColors, showToastMessage } from '@components/Toast';
import Attributes from '@enums/Attributes';

import clientService, { isFetchError } from './ClientService';

export class ProductsService {
  private sortQuery = '';
  private priceRangeFilterQuery = '';
  private temperatureFilterQuery = '';
  private timeFilterQuery = '';
  private weightFilterQuery = '';
  private searchQuery = '';
  private categoryQuery = '';
  private currentCategory: Category = {
    id: '',
    version: 0,
    createdAt: '',
    lastModifiedAt: '',
    name: {},
    slug: {},
    ancestors: [],
    orderHint: '',
  };
  private limit = 10; // Show 5 products by default
  private offset = 0; // Products offset

  public async getProducts(): Promise<ProductProjection[]> {
    const response = await clientService.apiRoot.productProjections().get().execute();
    return response.body.results;
  }

  public async getProductsProjections(): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
    return clientService.apiRoot.productProjections().get().execute();
  }

  public async getProductByKey(key: string): Promise<ClientResponse<ProductProjection>> {
    return clientService.apiRoot
      .productProjections()
      .withKey({
        key,
      })
      .get()
      .execute();
  }

  public async addTaxForProducts(): Promise<void> {
    const response = await clientService.apiRoot
      .productProjections()
      .get({
        queryArgs: {
          limit: 50,
        },
      })
      .execute();
    const products = response.body.results;
    products.forEach(async (item) => {
      const ID = item.id;
      const { version } = item;
      await clientService.apiRoot
        .products()
        .withId({ ID })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'setTaxCategory',
                taxCategory: {
                  typeId: 'tax-category',
                  key: 'basic-tax',
                },
              },
            ],
          },
        })
        .execute();
    });
  }

  public async getDiscountById(ID: string): Promise<ClientResponse<ProductDiscount>> {
    return clientService.apiRoot.productDiscounts().withId({ ID }).get().execute();
  }

  public async getProductById(productId: string): Promise<ClientResponse<ProductProjection>> {
    return clientService.apiRoot
      .productProjections()
      .withId({
        ID: productId,
      })
      .get()
      .execute();
  }

  public async getRootCategories(): Promise<Category[]> {
    const categories = await clientService.apiRoot
      .categories()
      .get({
        queryArgs: {
          where: 'parent is not defined',
        },
      })
      .execute();

    return categories.body.results;
  }

  public async getCategories(): Promise<Category[]> {
    const categories = await clientService.apiRoot.categories().get().execute();

    return categories.body.results;
  }

  public async getCategoryById(ID: string): Promise<Category> {
    const category = await clientService.apiRoot.categories().withId({ ID }).get().execute();

    return category.body;
  }

  public async filterDiscounted(upperPrice: number): Promise<ProductProjection[]> {
    const response = await clientService.apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          filter: `variants.price.centAmount:range (* to ${upperPrice * 100})`,
        },
      })
      .execute();

    return response.body.results;
  }

  public async getFilteredAndSortedProducts(
    requestLimit?: number,
    requestOffset?: number,
  ): Promise<ProductProjection[] | null> {
    try {
      const fuzzyLevel = this.getFuzzyLevel();
      const fuzzy = !!this.searchQuery; // true if there is a query, otherwise — false
      const response = await clientService.apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            limit: requestLimit || this.limit,
            offset: requestOffset || this.offset,
            markMatchingVariants: true,
            'text.en-US': this.searchQuery,
            fuzzy,
            fuzzyLevel,
            filter: [
              this.categoryQuery,
              this.priceRangeFilterQuery,
              this.temperatureFilterQuery,
              this.timeFilterQuery,
              this.weightFilterQuery,
            ],
            sort: [this.sortQuery],
            expand: ['categories[*]'],
          },
        })
        .execute();
      return response.body.results;
    } catch (e) {
      if (isFetchError(e)) {
        showToastMessage('Failed to load products. Please, try again.', ToastColors.Red);
        console.error('Failed to load products.', e);
      }
    }
    return null;
  }

  public getCategoryQuery(category: Category): void {
    this.categoryQuery = `categories.id:subtree("${category.id}")`;
    this.currentCategory = category;
  }

  public getCurrentCategory(): Category {
    return this.currentCategory;
  }

  public getSearchQuery(searchText: string): void {
    this.searchQuery = searchText;
  }

  public getSortingQuery(sortBy: 'price' | 'name.en-US', order: 'asc' | 'desc'): void {
    this.sortQuery = `${sortBy} ${order}`;
  }

  public getPriceRangeFilterQuery(min: string | number, max: string | number): string {
    const filterQuery = `variants.prices.value.centAmount:range (${min} to ${max})`;

    this.priceRangeFilterQuery = filterQuery;

    return filterQuery;
  }

  public getTemperatureFilterQuery(value: number | number[]): string {
    const filterValue = Array.isArray(value) ? `range (${value[0]} to ${value[1]})` : `"${value}"`;
    const filterQuery = `variants.attributes.${Attributes.brewingTemperature}:${filterValue}`;

    this.temperatureFilterQuery = filterQuery;

    return filterQuery;
  }

  public getTimeFilterQuery(value: number | number[]): string {
    const filterValue = Array.isArray(value) ? `range (${value[0]} to ${value[1]})` : `"${value}"`;
    const filterQuery = `variants.attributes.${Attributes.brewingTime}:${filterValue}`;

    this.timeFilterQuery = filterQuery;

    return filterQuery;
  }

  public getWeightFilterQuery(value: string): string {
    const filterValue = `"${value}"`;
    const filterQuery = `variants.attributes.${Attributes.weight}:${filterValue}`;

    this.weightFilterQuery = filterQuery;

    return filterQuery;
  }

  public set Limit(value: number) {
    this.limit = value;
  }

  public get Limit(): number {
    return this.limit;
  }

  public set Offset(value: number) {
    this.offset = value;
  }

  public get Offset(): number {
    return this.offset;
  }

  public clearCategoryQuery(): void {
    this.categoryQuery = '';
  }

  public clearSearchQuery(): void {
    this.searchQuery = '';
  }

  public clearTemperatureQuery(): void {
    this.temperatureFilterQuery = '';
  }

  public clearTimeQuery(): void {
    this.timeFilterQuery = '';
  }

  public clearWeightQuery(): void {
    this.weightFilterQuery = '';
  }

  public clearSortQuery(): void {
    this.sortQuery = '';
  }

  private getFuzzyLevel(): number {
    // When the search string consists of 1 or 2 characters, the only allowed value is: 0
    // When the search string consists of 3 to 5 characters, the only allowed values are: 0, 1
    // When the search string consists of more than 5 characters, the only allowed values are: 0, 1, 2"
    const { length } = this.searchQuery;
    let fuzzyLevel = 0;
    switch (true) {
      case length <= 2:
        fuzzyLevel = 0;
        break;

      case length >= 3:
        fuzzyLevel = 1;
        break;

      default:
        fuzzyLevel = 0;
        break;
    }
    return fuzzyLevel;
  }
}

const productsService = new ProductsService();
export default productsService;
