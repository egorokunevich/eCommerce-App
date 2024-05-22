import { Router, routeLocation } from 'vanilla-routing';
import type { Routes } from 'vanilla-routing';

import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import RegistrationPage from '@pages/RegistrationPage';

export class PageRouting {
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
          return new HomePage().createPage();
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
          return new HomePage().createPage();
        }
        return new RegistrationPage().createRegistration();
      },
    };
    return route;
  }

  public createRouting(): Routes[] {
    return [
      {
        pathname: '/',
        element: (): Element => {
          return new HomePage().createPage();
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
            return new HomePage().createPage();
          }
          return new LoginPage().createPage();
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
