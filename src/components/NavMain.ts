import { a, li, nav, ul } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';

import styles from './NavMain.module.scss';

export default class NavMain {
  private links = [
    { href: '/', txt: 'Home' },
    { href: '/catalog', txt: 'Catalog' },
    { href: '/profile', txt: 'My profile' },
    { href: '/about', txt: 'About us' },
    { href: '/login', txt: 'Login' },
    { href: '/registration', txt: 'Registration' },
    { href: '/basket', txt: 'Basket' },
  ];

  private menuElement: HTMLElement | null = null;

  private createMenu(): void {
    const menu = nav(
      { className: styles.navMenu },
      ul(
        { className: styles.menu },
        ...this.links.map((link) =>
          li(
            { className: styles.menuItem },
            setAttributes(a({ href: link.href, txt: link.txt }), {
              type: 'data-vanilla-route-link',
              text: 'spa',
            }),
          ),
        ),
      ),
    );
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
