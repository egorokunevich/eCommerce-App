import { a, div, li, link, nav, ul } from '@control.ts/min';

import styles from './NavMain.module.scss';
import { setAttributes } from '@utils/BaseComponentProps';

export default class NavMain {
  private navLinks = [
    { href: '/', txt: 'Home' },
    { href: '/catalog', txt: 'Catalog' },
    { href: '/profile', txt: 'My profile' },
    { href: '/about', txt: 'About us' },
    { href: '/basket', txt: 'Basket' },
  ];

  private authLinks = [
    { href: '/login', txt: 'Log In' },
    { href: '/registration', txt: 'Sign Up' },
  ];

  private menuElement: HTMLElement | null = null;

  private createMenu(): void {
    const menu = nav({ className: styles.navMenu });
    const list = ul({ className: styles.menu });

    this.navLinks.forEach((item) => {
      const listItem = li(
        { className: styles.menuItem },
        setAttributes(a({ className: styles.link, href: item.href, txt: item.txt }), {
          type: 'data-vanilla-route-link',
          text: 'spa',
        }),
      );
      list.append(listItem);
    });

    const authContainer = div({ className: styles.authContainer });
    this.authLinks.forEach((item) => {
      const listItem = div({ className: styles.authBtn });
      const link = setAttributes(a({ className: styles.link, href: item.href }), {
        type: 'data-vanilla-route-link',
        text: 'spa',
      });

      const icon = setAttributes(a({ className: styles.icon, href: item.href }), {
        type: 'data-vanilla-route-link',
        text: 'spa',
      });
      const name = setAttributes(a({ className: styles.name, href: item.href, txt: item.txt }), {
        type: 'data-vanilla-route-link',
        text: 'spa',
      });
      listItem.append(link);
      link.append(icon, name);
      authContainer.append(listItem);
    });

    menu.append(list, authContainer);
    this.menuElement = menu;
  }

  public getMenuElement(): HTMLElement | null {
    if (!this.menuElement) {
      this.createMenu();
    }
    return this.menuElement;
  }

  public renderNav(): void {
    const menu = this.getMenuElement();
    if (menu) {
      document.body.appendChild(menu);
    }
  }
}

export const renderNavMain = (): NavMain => {
  return new NavMain();
};
