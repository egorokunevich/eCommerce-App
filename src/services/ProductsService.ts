import type {
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
} from '@commercetools/platform-sdk';

import Attributes from '@enums/Attributes';

import clientService from './ClientService';

export class ProductsService {
  private productsRoot;
  private sortQuery = '';
  private priceRangeFilterQuery = '';
  private temperatureFilterQuery = '';
  private timeFilterQuery = '';
  private weightFilterQuery = '';
  private searchQuery = '';
  constructor() {
    this.productsRoot = clientService.apiRoot.productProjections();
  }

  public async getProducts(): Promise<ProductProjection[]> {
    const response = await this.productsRoot.get().execute();
    return response.body.results;
  }

  public async getProductsProjections(): Promise<ClientResponse<ProductProjectionPagedQueryResponse>> {
    return clientService.apiRoot.productProjections().get().execute();
  }

  public async getProductByKey(key: string): Promise<ClientResponse<ProductProjection>> {
    return this.productsRoot
      .withKey({
        key,
      })
      .get()
      .execute();
  }

  public async getDiscountById(ID: string): Promise<ClientResponse<ProductDiscount>> {
    return clientService.apiRoot.productDiscounts().withId({ ID }).get().execute();
  }

  public async getProductById(productId: string): Promise<ClientResponse<ProductProjection>> {
    return this.productsRoot
      .withId({
        ID: productId,
      })
      .get()
      .execute();
  }

  public async filterDiscounted(upperPrice: number): Promise<ProductProjection[]> {
    const response = await this.productsRoot
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

  public async getFilteredAndSortedProducts(): Promise<ProductProjection[]> {
    const fuzzyLevel = this.getFuzzyLevel();
    const fuzzy = this.searchQuery ? true : false;
    const response = await this.productsRoot
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          'text.en-US': this.searchQuery,
          fuzzy,
          fuzzyLevel,
          filter: [
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
}

const productsService = new ProductsService();
export default productsService;
