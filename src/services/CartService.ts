import type { Cart, CartDraft, ClientResponse } from '@commercetools/platform-sdk';

import clientService, { isFetchError } from './ClientService';

export const updateBasketEvent = new Event('updateBasket');
export const productAddedToCartEvent = new Event('productAddedToCart');
export const productRemovedFromCartEvent = new Event('productRemovedFromCart');
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

  public async deleteActiveCart(): Promise<ClientResponse<Cart> | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      const ID = cart.id;
      const { version } = cart;
      const response = await clientService.apiRoot.carts().withId({ ID }).delete({ queryArgs: { version } }).execute();
      if (response.statusCode === 200) {
        document.dispatchEvent(updateBasketEvent);
      }
      return response;
    }
    return null;
  }

  public async checkIfProductIsInCart(productId: string): Promise<boolean> {
    const activeCart = await this.getActiveCart();
    const response = await clientService.apiRoot
      .carts()
      .get({ queryArgs: { where: `id="${activeCart?.id}" and lineItems(productId="${productId}")` } })
      .execute();
    return response.body.results.length > 0;
  }

  public async addProductToCart(productId: string): Promise<ClientResponse<Cart> | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      try {
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
        document.dispatchEvent(productAddedToCartEvent);
        return response;
      } catch (e) {
        console.error('Failed to add product: ', e);
      }
    }
    return null;
  }

  public async applyPromoCodeToCart(code: string): Promise<ClientResponse<Cart> | null> {
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
                action: 'addDiscountCode',
                code,
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

  public async updateItemQuantityInCart(lineItemId: string, quantity: number): Promise<ClientResponse<Cart> | null> {
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
      return response;
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

  private async getLineItemIdByProductId(productId: string): Promise<string | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      const lineItem = cart.lineItems.find((item) => item.productId === productId);
      return lineItem ? lineItem.id : null;
    }
    return null;
  }

  public async removeProductFromCartByProductId(productId: string): Promise<ClientResponse<Cart> | null> {
    const cart = await this.getActiveCart();
    if (cart) {
      const lineItemId = await this.getLineItemIdByProductId(productId);
      if (!lineItemId) {
        console.warn('LineItem not found for productId:', productId);
        return null;
      }
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
      if (response.statusCode === 200) {
        document.dispatchEvent(updateBasketEvent);
        return response;
      }
      return null;
    }
    return null;
  }

  public async removeProductFromCartByLineItemId(lineItemId: string): Promise<ClientResponse<Cart> | null> {
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
