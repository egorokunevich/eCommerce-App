import { button, div, span } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import NavMain from '@components/NavMain';

import styles from './Layout.module.scss';

export class Layout {
  private layoutElement: HTMLElement | null = null;
  // private header = new Header();
  public navMain = new NavMain();

  private createLayout(): void {
    const layout = div({ className: styles.headerWrapper });
    const title = div({ className: styles.title, txt: 'COFFEE LOOP' });
    title.addEventListener('click', () => {
      Router.go('/', { addToHistory: true });
    });
    const burgerBtn = button(
      { className: styles.burgerBtn },
      span({ className: styles.burgerBtnStripe }),
      span({ className: styles.burgerBtnStripe }),
      span({ className: styles.burgerBtnStripe }),
    );

    burgerBtn.addEventListener('click', () => {
      if (burgerBtn.classList.contains(styles.active)) {
        this.hideBurgerMenu(burgerBtn);
      } else {
        this.showBurgerMenu(burgerBtn);
      }
    });
    layout.append(title, burgerBtn);

    // const headerElement = this.header.getHeaderElement();
    // if (headerElement) {
    //   layout.appendChild(headerElement);
    // }

    const menuElement = this.navMain.getMenuElement();
    if (menuElement) {
      layout.appendChild(menuElement);

      menuElement.addEventListener('click', (e) => {
        if (e.target !== e.currentTarget) {
          this.hideBurgerMenu(burgerBtn);
        }
      });
    }
    this.layoutElement = layout;
  }

  private showBurgerMenu(burgerButton: HTMLButtonElement): void {
    burgerButton.classList.add(styles.active);
    this.navMain.showBurgerMenu();
    document.body.classList.add(styles.scrollLocked);
  }

  private hideBurgerMenu(burgerButton: HTMLButtonElement): void {
    burgerButton.classList.remove(styles.active);
    this.navMain.hideBurgerMenu();
    document.body.classList.remove(styles.scrollLocked);
  }

  public getLayoutElement(): HTMLElement | null {
    if (!this.layoutElement) {
      this.createLayout();
    }
    return this.layoutElement;
  }

  public renderLayout(): void {
    const layout = this.getLayoutElement();
    if (layout) {
      document.body.appendChild(layout);
    }
  }
}

// export const renderLayout = (): void => {
//   const layout = new Layout();
//   layout.renderLayout();
// };

const layoutInstance = new Layout();
export default layoutInstance;
