import type { ClientResponse, Product, ProductPagedQueryResponse } from '@commercetools/platform-sdk';

import clientService from './ClientService';

export class ProductsService {
  private productsRoot;
  constructor() {
    this.productsRoot = clientService.apiRoot.products();
  }

  public async getProducts(): Promise<ClientResponse<ProductPagedQueryResponse>> {
    return this.productsRoot.get().execute();
  }

  public async getProductByKey(key: string): Promise<ClientResponse<Product>> {
    return this.productsRoot
      .withKey({
        key,
      })
      .get()
      .execute();
  }
}

const productsService = new ProductsService();
export default productsService;
