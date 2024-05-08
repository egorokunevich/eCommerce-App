import { a, li, nav, ul } from '@control.ts/min';

class NavMain {
  links = [
    { href: '/', text: 'Home' },
    { href: '/catalog', text: 'Catalog' },
    { href: '/profile', text: 'My profile' },
    { href: '/about', text: 'About us' },
    { href: '/login', text: 'Login' },
    { href: '/registration', text: 'Registration' },
    { href: '/basket', text: 'Basket' },
  ];

  constructor() {
    const menu = nav(
      {
        className: 'nav-menu',
      },
      ul(
        { className: 'menu' },
        ...this.links.map((link) => li({ className: 'menu-item' }, a({ href: link.href, text: link.text }))),
      ),
    );
    document.body.appendChild(menu);
  }

}

export const createNavMain = (): void => {
  new NavMain();
};
