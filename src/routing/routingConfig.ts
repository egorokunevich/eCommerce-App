import { Router, routeLocation } from 'vanilla-routing';
import type { Routes } from 'vanilla-routing';

import { LoginPage } from '@pages/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';

export const routeConfig: Routes[] = [
  {
    pathname: '/',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'Main page';
      return ele;
    },
  },
  {
    pathname: '/catalog',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'CATALOG';
      /* const btn = document.createElement('button');
      btn.innerText = 'Take me to the Product page with details';
      btn.onclick = () => {
        Router.go('/catalog/product');
      };
      ele.appendChild(btn);
      Router.dispose(() => {
        console.log('Bye Bye from About Page');
      }); */
      return ele;
    },
  },
  {
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
  },
  {
    pathname: '/profile',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'My profile';
      return ele;
    },
  },
  {
    pathname: '/about',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'About us page';
      return ele;
    },
  },
  {
    pathname: '/login',
    element: (): Element => {
      return new LoginPage().render();
    },
  },
  {
    pathname: '/registration',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'Registration';
      return ele;
    },
  },
  {
    pathname: '/basket',
    element: (): Element => {
      const ele = document.createElement('h2');
      ele.innerText = 'Basket';
      return ele;
    },
  },
  {
    pathname: '*',
    element: (): Element => {
      return new NotFoundPage().render();
    },
  },
];
