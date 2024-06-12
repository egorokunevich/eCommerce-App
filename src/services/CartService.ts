import type { Cart, CartDraft, ClientResponse } from '@commercetools/platform-sdk';

import clientService, { isFetchError } from './ClientService';

export const updateBasketEvent = new Event('updateBasket');
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

  public async deleteActiveCart(): Promise<void> {
    const cart = await this.getActiveCart();
    if (cart) {
      const ID = cart.id;
      const { version } = cart;
      await clientService.apiRoot.carts().withId({ ID }).delete({ queryArgs: { version } }).execute();
      document.dispatchEvent(updateBasketEvent);
    }
  }

  public async checkIfProductIsInCart(productId: string): Promise<boolean> {
    const activeCart = await this.getActiveCart();
    const response = await clientService.apiRoot
      .carts()
      .get({ queryArgs: { where: `id="${activeCart?.id}" and lineItems(productId="${productId}")` } })
      .execute();
    if (response.body.results.length > 0) {
      return true;
    }
    return false;
  }

  public async addProductToCart(productId: string): Promise<Cart | null> {
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
                productId,
                quantity: 1,
              },
            ],
            version,
          },
        })
        .execute();
      document.dispatchEvent(updateBasketEvent);
      return response.body;
    }
    return null;
  }

  public async updateItemQuantityInCart(lineItemId: string, quantity: number): Promise<Cart | null> {
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
                action: 'changeLineItemQuantity',
                lineItemId,
                quantity,
              },
            ],
            version,
          },
        })
        .execute();
      document.dispatchEvent(updateBasketEvent);
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

  public async getCartItemCount(): Promise<number> {
    const cart = await this.getActiveCart();
    if (cart) {
      return cart.lineItems.reduce((total, item) => total + item.quantity, 0);
    }
    return 0;
  }

  public async removeProductFromCart(lineItemId: string): Promise<ClientResponse<Cart> | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      const ID = cart.id;
      const { version } = cart;
      const response = await clientService.apiRoot
        .carts()
        .withId({ ID })
        .post({
          body: {
            actions: [
              {
                action: 'removeLineItem',
                lineItemId,
              },
            ],
            version,
          },
        })
        .execute();
      document.dispatchEvent(updateBasketEvent);

      return response;
    }
    return null;
  }
}

const cartService = new CartService();
export default cartService;
