import { a, div, li, nav, ul } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import cartService from '@services/CartService';
import clientService from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';

import styles from './NavMain.module.scss';

export default class NavMain {
  private navBtnsContainer: HTMLElement = div({});
  private navLinks = [
    { href: '/', txt: 'Home' },
    { href: '/catalog', txt: 'Catalog' },
    { href: '/about', txt: 'About us' },
  ];

  public logoutBtn: HTMLElement = div({});
  private menuElement: HTMLElement | null = null;
  public nav: HTMLElement = div({});
  private basketCountElement: HTMLElement | null = null;

  constructor() {
    document.addEventListener('updateBasket', () => {
      this.updateBasketCount();
    });
  }

  private createMenu(): void {
    const menu = nav({ className: styles.navMenu });
    this.nav = menu;
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

    const navBtnsContainer = div({ className: styles.navBtnsContainer });
    document.addEventListener('loggedStatusChange', () => {
      this.renderNavButtons();
    });
    this.navBtnsContainer = navBtnsContainer;
    this.renderNavButtons();
    this.renderBasket();

    menu.append(list, navBtnsContainer);
    this.menuElement = menu;
  }

  public getMenuElement(): HTMLElement | null {
    if (!this.menuElement) {
      this.createMenu();
    }
    return this.menuElement;
  }

  /* public renderNav(): void {
    const menu = this.getMenuElement();
    if (menu) {
      document.body.appendChild(menu);
    }
  } */

  private createNavBtn(buttonName: string, iconClassName: string): HTMLElement {
    const btn = div({ className: styles.authBtn });

    btn.classList.add(styles.logout);

    const link = div({ className: styles.link });

    const icon = div({ className: styles.icon });
    icon.classList.add(iconClassName);

    const name = div({ className: styles.name, txt: buttonName });

    btn.append(link);
    link.append(icon, name);

    return btn;
  }

  private async updateBasketCount(): Promise<void> {
    const count = await cartService.getCartItemCount();
    if (this.basketCountElement) {
      this.basketCountElement.textContent = `${count}`;
      this.basketCountElement.style.display = count > 0 ? 'block' : 'none';
    }
  }

  private renderBasket(): void {
    const basketBtn = this.createNavBtn('Basket', styles.basketIcon);

    this.basketCountElement = div({ className: styles.basketCount });
    basketBtn.appendChild(this.basketCountElement);

    basketBtn.addEventListener('click', () => {
      Router.go('/basket', { addToHistory: true });
    });

    this.navBtnsContainer.append(basketBtn);
    this.updateBasketCount();
  }

  public renderNavButtons(): void {
    this.navBtnsContainer.innerHTML = '';

    const loggedData = localStorage.getItem('isLoggedIn') ?? 'null';
    const loggedIn = JSON.parse(loggedData);

    if (loggedIn) {
      this.renderLoggedInInterface();
    } else {
      this.renderLoggedOutInterface();
    }
  }

  private renderLoggedInInterface(): void {
    const profileBtn = this.createNavBtn('My Profile', styles.userIcon);
    const logoutBtn = this.createNavBtn('Log Out', styles.logoutIcon);

    profileBtn.addEventListener('click', () => {
      Router.go('/profile', { addToHistory: true });
    });

    logoutBtn.addEventListener('click', () => {
      const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
      if (isLoggedIn) {
        clientService.logout();
      }
    });

    this.navBtnsContainer.append(profileBtn, logoutBtn);
  }

  private renderLoggedOutInterface(): void {
    const loginBtn = this.createNavBtn('Log In', styles.userIcon);
    const signUpBtn = this.createNavBtn('Sign Up', styles.signUpIcon);

    loginBtn.addEventListener('click', () => {
      Router.go('/login', { addToHistory: true });
    });

    signUpBtn.addEventListener('click', () => {
      Router.go('/registration', { addToHistory: true });
    });

    this.navBtnsContainer.append(loginBtn, signUpBtn);
  }
}
