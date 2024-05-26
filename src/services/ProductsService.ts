import type {
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';

import clientService from './ClientService';

export class ProductsService {
  private productsRoot;
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
              sort: [`price ${order}`],
            },
          })
          .execute()
      : await this.productsRoot
          .search()
          .get({
            queryArgs: {
              sort: [`price ${order}`],
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
}

const productsService = new ProductsService();
export default productsService;
