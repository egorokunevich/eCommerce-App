import type {
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

import clientService from './ClientService';
import Attributes from '@enums/Attributes';

export class ProductsService {
  private productsRoot;
  private priceRangeFilterQuery: string = '';
  private temperatureFilterQuery: string = '';
  private timeFilterQuery: string = '';
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
          filter: `variants.price.centAmount:range (* to ${upperPrice * 100})`,
        },
      })
      .execute();

    return response.body.results;
  }

  public async getSortedByPrice(
    order: 'asc' | 'desc',
    range?: (string | number)[] | null,
  ): Promise<ProductProjection[]> {
    let filter = '';
    if (range) {
      const min = Math.floor(+range[0]) * 100; // Lower bound in cents
      const max = Math.floor(+range[1]) * 100; // Upper bound in cents
      filter = `variants.price.centAmount:range (${min} to ${max})`;
    }
    const response = range
      ? await this.productsRoot
          .search()
          .get({
            queryArgs: {
              filter,
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
              markMatchingVariants: true,
              sort: [`price ${order}`],
              // sort: [`price ${order}`],
            },
          })
          .execute();

    return response.body.results;
  }

  public async getSortedByName(
    order: 'asc' | 'desc',
    range?: (string | number)[] | null,
  ): Promise<ProductProjection[]> {
    let filter = '';
    if (range) {
      const min = Math.floor(+range[0]) * 100; // Lower bound in cents
      const max = Math.floor(+range[1]) * 100; // Upper bound in cents
      filter = `variants.price.centAmount:range (${min} to ${max})`;
    }
    const response = range
      ? await this.productsRoot
          .search()
          .get({
            queryArgs: {
              filter,
              sort: [`name.en-US ${order}`],
            },
          })
          .execute()
      : await this.productsRoot
          .search()
          .get({
            queryArgs: {
              sort: [`name.en-US ${order}`],
            },
          })
          .execute();

    return response.body.results;
  }

  public async getFilteredByPriceRange(
    min: string | number,
    max: string | number,
  ): Promise<ClientResponse<ProductProjectionPagedSearchResponse>> {
    const response = await this.productsRoot
      .search()
      .get({
        queryArgs: {
          filter: [`variants.prices.value.centAmount:range (${min} to ${max})`],
        },
      })
      .execute();

    return response;
  }

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
          filter: [this.priceRangeFilterQuery, this.temperatureFilterQuery, this.timeFilterQuery],
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

  public clearTemperatureQuery() {
    this.temperatureFilterQuery = '';
  }

  public clearTimeQuery() {
    this.timeFilterQuery = '';
  }
}

const productsService = new ProductsService();
export default productsService;
