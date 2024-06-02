import type {
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
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

  public async getSortedByPrice(order: 'asc' | 'desc'): Promise<ProductProjection[]> {
    const filter = [
      this.priceRangeFilterQuery,
      this.temperatureFilterQuery,
      this.timeFilterQuery,
      this.weightFilterQuery,
    ];

    this.sortQuery = `price ${order}`;

    const response = this.isFilterQueryEmpty(filter)
      ? await this.productsRoot
          .search()
          .get({
            queryArgs: {
              markMatchingVariants: true,
              sort: [`price ${order}`],
              // sort: [`price ${order}`],
            },
          })
          .execute()
      : await this.productsRoot
          .search()
          .get({
            queryArgs: {
              filter,
              markMatchingVariants: true,
              sort: [`price ${order}`],
              // sort: [`price ${order}`],
            },
          })
          .execute();

    return response.body.results;
  }

  private isFilterQueryEmpty(filter: string[]): boolean {
    return filter.every((item) => item === '');
  }

  public async getSortedByName(order: 'asc' | 'desc'): Promise<ProductProjection[]> {
    const filter = [
      this.priceRangeFilterQuery,
      this.temperatureFilterQuery,
      this.timeFilterQuery,
      this.weightFilterQuery,
    ];

    this.sortQuery = `name.en-US ${order}`;

    const response = this.isFilterQueryEmpty(filter)
      ? await this.productsRoot
          .search()
          .get({
            queryArgs: {
              markMatchingVariants: true,
              sort: [`name.en-US ${order}`],
            },
          })
          .execute()
      : await this.productsRoot
          .search()
          .get({
            queryArgs: {
              markMatchingVariants: true,
              filter,
              sort: [`name.en-US ${order}`],
            },
          })
          .execute();

    return response.body.results;
  }

  // public async getFilteredByPriceRange(
  //   min: string | number,
  //   max: string | number,
  // ): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
  //   const response = await this.productsRoot
  //     .search()
  //     .get({
  //       queryArgs: {
  //         filter: [`variants.prices.value.centAmount:range (${min} to ${max})`],
  //       },
  //     })
  //     .execute();

  //   return response;
  // }

  // public async getFilteredByAttribute(
  //   attribute: string,
  //   value: number | number[],
  // ): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
  //   const filterValue = Array.isArray(value) ? `range (${value[0]} to ${value[1]})` : `"${value}"`;
  //   const response = await this.productsRoot
  //     .search()
  //     .get({
  //       queryArgs: {
  //         filter: [`variants.attributes.${attribute}:${filterValue}`],
  //       },
  //     })
  //     .execute();

  //   return response;
  // }
  public async getFilteredByAttributes(): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const response = await this.productsRoot
      .search()
      .get({
        queryArgs: {
          markMatchingVariants: true,
          filter: [
            this.priceRangeFilterQuery,
            this.temperatureFilterQuery,
            this.timeFilterQuery,
            this.weightFilterQuery,
          ],
          sort: [this.sortQuery],
        },
      })
      .execute();

    return response;
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
