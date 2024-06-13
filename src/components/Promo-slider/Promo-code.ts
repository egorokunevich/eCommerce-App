import './styles.scss';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { CartDiscount } from '@commercetools/platform-sdk';
import { article, button, div, h3 } from '@control.ts/min';

// import { createSwiperDiscountCode } from '@components/Swiper';
import { ToastColors, showToastMessage } from '@components/Toast';
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
      this.createContentSwiperContainer(discount, swiperWrapper);
    });
    const node = div(
      { className: ['swiperPromoCode', 'swiper'].join(' ') },
      swiperWrapper,
      div({ className: 'swiper-pagination' }),
      div({ className: 'swiper-button-prev' }),
      div({ className: 'swiper-button-next' }),
    );

    return node;
  }

  private createContentSwiperContainer(discount: CartDiscount, swiperWrapper: HTMLElement): void {
    const node = div({ className: 'swiper-slide' });

    // node.setAttribute('data-swiper-autoplay', '2000');
    const codePromo = button({ className: 'DiscountCodeBtn', txt: `${discount.key}` });
    codePromo.addEventListener('click', () => {
      const textCopy = codePromo.textContent;
      if (textCopy) {
        navigator.clipboard.writeText(textCopy);
      }
      showToastMessage('Promo Code is Copy', ToastColors.Green);
      codePromo.disabled = true;

      setTimeout(() => {
        codePromo.disabled = false;
      }, 3000);
    });

    const descriptionObj = discount.description;
    if (descriptionObj) {
      const description = Object.values(descriptionObj)[0];
      const nodeDiscount = div(
        { className: ['swiperSlideCustom'].join(' ') },
        h3({ className: 'textSwiper', txt: `${description}` }),
        codePromo,
      );
      node.append(nodeDiscount);

      swiperWrapper.append(node);
    }
  }
}

export const promoCode = new PromoCode();
