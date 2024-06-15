import './styles.scss';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { DiscountCode } from '@commercetools/platform-sdk';
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

  private async getAllDiscountCodes(): Promise<DiscountCode[]> {
    const response = await clientService.apiRoot.discountCodes().get().execute();
    return response.body.results;
  }

  private createSwiper(data: DiscountCode[]): HTMLElement {
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

  private createContentSwiperContainer(discount: DiscountCode, swiperWrapper: HTMLElement): void {
    const node = div({ className: 'swiper-slide' });

    // node.setAttribute('data-swiper-autoplay', '2000');
    const codePromo = button({ className: 'DiscountCodeBtn', id: discount.code });
    codePromo.addEventListener('click', () => {
      const textCopy = codePromo.id;
      if (textCopy) {
        navigator.clipboard.writeText(textCopy);
      }
      showToastMessage('Promocode is copied!', ToastColors.Green);
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
