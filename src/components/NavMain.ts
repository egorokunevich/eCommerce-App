import { a, li, nav, ul } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';

import styles from './NavMain.module.scss';

export default class NavMain {
  public links = [
    { href: '/', txt: 'Home' },
    { href: '/catalog', txt: 'Catalog' },
    { href: '/profile', txt: 'My profile' },
    { href: '/about', txt: 'About us' },
    { href: '/login', txt: 'Login' },
    { href: '/registration', txt: 'Registration' },
    { href: '/basket', txt: 'Basket' },
  ];

  constructor() {
    const menu = nav(
      {
        className: `${styles.navMenu}`,
      },
      ul(
        { className: `${styles.menu}` },
        ...this.links.map((link) =>
          li(
            { className: `${styles.menuItem}` },
            setAttributes(a({ href: link.href, txt: link.txt }), { type: 'data-vanilla-route-link', text: 'spa' }),
          ),
        ),
      ),
    );
    document.body.appendChild(menu);
  }
}

export const createNavMain = (): NavMain => {
  const navMain = new NavMain();
  return navMain;
};
