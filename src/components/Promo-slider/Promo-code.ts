import './styles.scss';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { CartDiscount } from '@commercetools/platform-sdk';
import { article, div } from '@control.ts/min';

// import { createSwiperDiscountCode } from '@components/Swiper';
// import { ToastColors, showToastMessage } from '@components/Toast';
import clientService from '@services/ClientService';

export class PromoCode {
  public async createSwiperNode(): Promise<HTMLElement> {
    const nodeArticle = article({ className: 'promoArticle' });

    const data = await this.getAllDiscountCodes();

    const swiper = this.createSwiper(data);
    nodeArticle.append(swiper);
    return nodeArticle;
  }

  private async getAllDiscountCodes(): Promise<CartDiscount[]> {
    const response = await clientService.apiRoot.cartDiscounts().get().execute();
    return response.body.results;
  }

  private createSwiper(data: CartDiscount[]): HTMLElement {
    const swiperWrapper = div({ className: 'swiper-wrapper' });
    data.forEach((discount) => {
      const nodeDiscount = div({ className: 'swiper-slide', txt: `${discount.key}` });
      swiperWrapper.append(nodeDiscount);
    });
    const node = div(
      { className: ['swiperPromoCode', 'swiper'].join(' ') },
      // { className: Styles.swiperPromoCode },
      swiperWrapper,
      div({ className: 'swiper-pagination' }),
      div({ className: 'swiper-button-prev' }),
      div({ className: 'swiper-button-next' }),
    );

    return node;
  }
}

export const promoCode = new PromoCode();
