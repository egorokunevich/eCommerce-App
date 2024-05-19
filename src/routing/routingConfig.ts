import { Router, routeLocation } from 'vanilla-routing';
import type { Routes } from 'vanilla-routing';

import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { pageRegistration } from '@pages/RegistrationPage';

export class PageRouting {
  private homePage: Element;
  constructor(private readonly loginPage: Element) {
    this.homePage = new HomePage().createPage();
  }

  private createRoute(pathname: string, name: string): Routes {
    return {
      pathname,
      element: (): Element => {
        const ele = document.createElement('h2');
        ele.innerText = name;
        return ele;
      },
    };
  }

  private createItemRoute(): Routes {
    return {
      pathname: '/catalog/:id',
      element: (): Element => {
        const ele = document.createElement('h2');
        ele.innerText = `CATALOG with details about ${routeLocation().params.id}`;
        const btnBack = document.createElement('button');
        btnBack.innerText = 'Go back';
        btnBack.onclick = (): void => {
          Router.back();
        };
        const btnForward = document.createElement('button');
        btnForward.innerText = 'Go Forward';
        btnForward.onclick = (): void => {
          Router.forward();
        };

        ele.appendChild(btnBack);
        ele.appendChild(btnForward);
        return ele;
      },
    };
  }

  private createProfileRoute(): Routes {
    const route = {
      pathname: '/profile',
      element: (): Element => {
        const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
        if (!isLoggedIn) {
          Router.go('/');
          return this.homePage;
        }
        const ele = document.createElement('h2');
        ele.innerText = 'Profile';
        return ele;
      },
    };
    return route;
  }
  private createRegistrationRoute(): Routes {
    const route = {
      pathname: '/registration',
      element: (): Element => {
        const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
        if (isLoggedIn) {
          Router.go('/');
          return this.homePage;
        }
        return pageRegistration.createRegistration();
      },
    };
    return route;
  }

  public createRouting(): Routes[] {
    return [
      {
        pathname: '/',
        element: (): Element => {
          return this.homePage;
        },
      },
      this.createRoute('/catalog', 'Catalog'),
      this.createRoute('/about', 'About'),
      // this.createRoute('/registration', 'Registration'),
      this.createRoute('/basket', 'Basket'),
      // this.createRoute('/profile', 'Profile'),
      this.createItemRoute(),
      this.createProfileRoute(),
      this.createRegistrationRoute(),
      {
        pathname: '/login',
        element: (): Element => {
          const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
          if (isLoggedIn) {
            Router.go('/');
            return this.homePage;
          }
          return this.loginPage;
        },
      },
      {
        pathname: '*',
        element: (): Element => {
          return new NotFoundPage().render();
        },
      },
    ];
  }
}
