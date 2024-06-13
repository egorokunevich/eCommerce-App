import { button, div, img, p } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import styles from './BasketEmpty.module.scss';

export class BasketEmpty {
  public createBasketEmpty(): HTMLDivElement {
    const basketEmptyContainer = div({ className: styles.basketEmptyContainer });
    const description = p({
      className: styles.description,
      txt: 'Ohh! It looks like your shopping cart is empty right now.',
    });
    const emptyIcon = img({ className: styles.emptyIcon, src: './assets/icons/empty-basket.jpg', alt: 'empty basket' });
    const suggestion = p({
      className: styles.description,
      txt: 'But don`t worry, it`s the perfect time to add some delicious coffee or soothing tea to your cart!',
    });
    const catalogBtn = button({ className: styles.catalogBtn, txt: 'Let`s go to our catalog!' });
    catalogBtn.addEventListener('click', () => {
      Router.go('/catalog');
    });
    basketEmptyContainer.append(description, emptyIcon, suggestion, catalogBtn);
    return basketEmptyContainer;
  }
}
