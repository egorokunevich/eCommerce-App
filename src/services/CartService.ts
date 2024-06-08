import type { Cart, CartDraft, ProductProjection } from '@commercetools/platform-sdk';

import type { FetchError } from './ClientService';
import clientService from './ClientService';

export class CartService {
  public async getActiveCart(): Promise<Cart | null> {
    try {
      const response = await clientService.apiRoot.me().activeCart().get().execute();
      if (response.statusCode === 200) {
        // Cart exists
        return response.body;
      }
    } catch (error) {
      if (this.isFetchError(error)) {
        if (error.statusCode === 404) {
          // If there is no cart, create one
          return await this.createCart();
        }
      }
    }
    return null;
  }

  // private async deleteAllCarts(): Promise<void> {
  //   const carts = (await clientService.apiRoot.me().carts().get().execute()).body.results;
  //   carts.forEach(async (item) => {
  //     const ID = item.id;
  //     const version = item.version;
  //     await clientService.apiRoot.carts().withId({ ID }).delete({ queryArgs: { version } }).execute();
  //   });
  // }

  public async addProductToCart(product: ProductProjection): Promise<Cart | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      const ID = cart.id;
      const { version } = cart;
      const cartEndpoint = clientService.apiRoot.carts().withId({ ID });
      const response = await cartEndpoint
        .post({
          body: {
            actions: [
              {
                action: 'addLineItem',
                productId: product.id,
                quantity: 1,
              },
            ],
            version,
          },
        })
        .execute();
      return response.body;
    }
    return null;
  }

  public async createCart(): Promise<Cart> {
    const cartDraft: CartDraft = {
      currency: 'EUR',
    };
    const newCart = (await clientService.apiRoot.me().carts().post({ body: cartDraft }).execute()).body;

    return newCart;
  }

  private isFetchError(error: unknown): error is FetchError {
    return typeof error === 'object' && error !== null && 'statusCode' in error;
  }
}

const cartService = new CartService();
export default cartService;
