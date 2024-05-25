import clientService from './ClientService';

export class ProductsService {
  private productsRoot;
  constructor() {
    this.productsRoot = clientService.apiRoot.products();
  }

  public getProducts(): void {
    this.productsRoot.get().execute();
  }
}

const productsService = new ProductsService();
export default productsService;

// You can call method getProducts in main.ts, for example, to see the response
