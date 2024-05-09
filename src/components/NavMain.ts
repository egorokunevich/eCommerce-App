import { a, li, nav, ul } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';

class NavMain {
  links = [
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
        className: 'nav-menu',
      },
      ul(
        { className: 'menu' },
        ...this.links.map((link) =>
          li(
            { className: 'menu-item' },
            setAttributes(a({ href: link.href, txt: link.txt }), { type: 'data-vanilla-route-link', text: 'spa' }),
          ),
        ),
      ),
    );
    document.body.appendChild(menu);
  }
}

export const createNavMain = (): void => {
  new NavMain();
};
