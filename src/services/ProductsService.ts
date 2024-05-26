import type {
  ClientResponse,
  ProductDiscount,
  ProductProjection,
  ProductProjectionPagedQueryResponse,
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

  public async getFilteredByPrice(order: 'asc' | 'desc'): Promise<ProductProjection[]> {
    const response = await this.productsRoot
      .search()
      .get({
        queryArgs: {
          sort: [`price ${order}`],
        },
      })
      .execute();

    return response.body.results;
  }
}

const productsService = new ProductsService();
export default productsService;
