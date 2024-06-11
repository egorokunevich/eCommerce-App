import { div, h2, p, section } from '@control.ts/min';

import { promoCode } from '@components/Promo-slider/Promo-code';
import { createSwiperDiscountCode } from '@components/Swiper';

import styles from './HomePage.module.scss';

export class HomePage {
  public pageWrapper: HTMLElement;

  constructor() {
    this.pageWrapper = section({ className: `${styles.homePageWrapper}` });
  }
  public createPage(): Element {
    const description = p({
      className: `${styles.pageDescription}`,
      txt: `Coffee Loop is your one-stop destination for all things coffee, tea, and everything in between! Whether you're a coffee connoisseur, tea enthusiast, or simply looking for quality brewing accessories, Coffee Loop has got you covered.`,
    });
    const articleContainer = div({ className: `${styles.articleContainer}` });
    const articleTitle = h2({ className: `${styles.articleTitle}`, txt: 'SPECIAL OFFER' });
    const articleInfo = p({
      className: `${styles.articleInfo}`,
      txt: `Attention coffee lovers! This month, we have an exciting offer just for you. Purchase 5 kg of our premium coffee and receive exclusive RS School merch absolutely free! Whether you're a seasoned programmer or just starting out, our coffee will fuel your passion and keep you energized throughout the day. Hurry, stock is limited and the clock is ticking! Make your purchase today and elevate both your coffee experience and your style game. Visit our online store now to take advantage of this fantastic deal!`,
    });

    articleContainer.append(articleTitle, articleInfo);
    this.pageWrapper.append(description, articleContainer);

    this.aaa();
    return this.pageWrapper;
  }
  private async aaa(): Promise<void> {
    this.pageWrapper.append(await promoCode.createSwiperNode());
    createSwiperDiscountCode();
  }
}
