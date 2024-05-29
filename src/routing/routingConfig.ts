import { Router, routeLocation } from 'vanilla-routing';
import type { Routes } from 'vanilla-routing';

import { CatalogPage } from '@pages/CatalogPage/CatalogPage';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage/ProductDetailsPage';
import RegistrationPage from '@pages/RegistrationPage';
import { UserProfile } from '@pages/UserProfile/create-user-pages';

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
      pathname: '/catalog/:productId',
      element: (): Element => {
        const { params } = routeLocation();
        const { productId } = params;
        if (!productId) {
          const ele = document.createElement('h2');
          ele.innerText = 'Product ID not found';
          return ele;
        }
        const productDetailsPage = new ProductDetailsPage().createPage(productId);
        const btnBack = document.createElement('button');
        btnBack.innerText = 'Go back';
        btnBack.onclick = (): void => {
          Router.back();
        };
        const btnForward = document.createElement('button');
        btnForward.innerText = 'Buy';
        btnForward.onclick = (): void => {
          Router.forward();
        };

        productDetailsPage.appendChild(btnBack);
        productDetailsPage.appendChild(btnForward);

        return productDetailsPage;
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
        return new UserProfile().createUserPage();
      },
    };
    return route;
  }
  private createCatalogRoute(): Routes {
    const route = {
      pathname: '/catalog',
      element: (): Element => {
        return new CatalogPage().createPage();
      },
    };
    return route;
  }

  /* private createDetailsRoute(): Routes {
    const route = {
      pathname: '/card/:productId',
      element: (): Element => {
        const params = routeLocation().params;
        const productId = params.productId;
        if (!productId) {
          const ele = document.createElement('h2');
          ele.innerText = 'Product ID not found';
          return ele;
        }
        return new ProductDetailsPage().createPage();
      },
    };
    return route;
  } */

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
      this.createCatalogRoute(),
      // this.createRoute('/catalog', 'Catalog'),
      // this.createDetailsRoute(),
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
