import { Router, routeLocation } from 'vanilla-routing';
import type { Routes } from 'vanilla-routing';

import { AboutUsPage } from '@pages/AboutUsPage/AboutUsPage';
import { BasketPage } from '@pages/BasketPage/BasketPage';
import { CatalogPage } from '@pages/CatalogPage/CatalogPage';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage/ProductDetailsPage';
import { ProfilePage } from '@pages/ProfilePage/ProfilePage';
import { UserProfile } from '@pages/ProfilePage/UserProfile';
import RegistrationPage from '@pages/RegistrationPage';

export class PageRouting {
  /* private createRoute(pathname: string, name: string): Routes {
    return {
      pathname,
      element: (): Element => {
        const ele = document.createElement('h2');
        ele.innerText = name;
        return ele;
      },
    };
  } */

  private createItemRoute(): Routes {
    return {
      pathname: '/catalog/:productKey',
      element: (): Element => {
        const { params } = routeLocation();
        const { productKey } = params;
        if (!productKey) {
          const ele = document.createElement('h2');
          ele.innerText = 'Product is not found';
          return ele;
        }
        const productDetailsPage = new ProductDetailsPage().createPage(productKey);
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
          Router.go('/login');
          return new HomePage().createPage();
        }
        return new UserProfile().createUserPage();
      },
    };
    return route;
  }

  private createNewProfileRoute(): Routes {
    const route = {
      pathname: '/profile-new',
      element: (): Element => {
        const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
        if (!isLoggedIn) {
          Router.go('/login');
          return new HomePage().createPage();
        }
        return new ProfilePage().createPage();
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

  private createLoginRoute(): Routes {
    const route = {
      pathname: '/login',
      element: (): Element => {
        const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
        if (isLoggedIn) {
          Router.go('/');
          return new HomePage().createPage();
        }
        return new LoginPage().createPage();
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

  private createBasketRoute(): Routes {
    const route = {
      pathname: '/basket',
      element: (): Element => {
        return new BasketPage().createPage();
      },
    };
    return route;
  }

  private createAboutUsRoute(): Routes {
    const route = {
      pathname: '/about',
      element: (): Element => {
        return new AboutUsPage().createPage();
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
      this.createAboutUsRoute(),
      this.createBasketRoute(),
      this.createItemRoute(),
      this.createProfileRoute(),
      this.createNewProfileRoute(),
      this.createRegistrationRoute(),
      this.createLoginRoute(),

      {
        pathname: '*',
        element: (): Element => {
          return new NotFoundPage().render();
        },
      },
    ];
  }
}
