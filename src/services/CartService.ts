import type { Cart, CartDraft, ProductProjection } from '@commercetools/platform-sdk';

import clientService, { isFetchError } from './ClientService';

export class CartService {
  public async getActiveCart(): Promise<Cart | null> {
    try {
      const response = await clientService.apiRoot.me().activeCart().get().execute();
      if (response.statusCode === 200) {
        // Cart exists
        return response.body;
      }
    } catch (error) {
      if (isFetchError(error)) {
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

  public async checkIfProductIsInCart(product: ProductProjection): Promise<boolean> {
    const activeCart = await this.getActiveCart();
    const response = await clientService.apiRoot
      .carts()
      .get({ queryArgs: { where: `id="${activeCart?.id}" and lineItems(productId="${product.id}")` } })
      .execute();
    if (response.body.results.length > 0) {
      return true;
    }
    return false;
  }

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

  private async createCart(): Promise<Cart> {
    const cartDraft: CartDraft = {
      currency: 'EUR',
    };
    const newCart = (await clientService.apiRoot.me().carts().post({ body: cartDraft }).execute()).body;
    return newCart;
  }
}

const cartService = new CartService();
export default cartService;
