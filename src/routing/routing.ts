// import { BrowserRoute } from 'vanilla-routing';

/* interface Route<T extends HTMLElement> {
  pathname: string;
  element: () => T;
}

const routes: Route<HTMLElement>[] = [
  {
    pathname: '/',
    element: () => document.createElement('div'),
  },
  {
    pathname: '/post',
    element: () => document.createElement('span'),
  },
];

/*BrowserRoute(routes);

routes.push({
  pathname: '/login',
  element: () => {
    const loginForm = document.createElement('form');
    loginForm.innerHTML = `
      <h2>Login</h2>
      <input type="text" placeholder="Username">
      <input type="password" placeholder="Password">
      <button type="submit">Login</button>
    `;
    return loginForm;
  },
});

BrowserRoute(routes); // Initialize browser-based routing

*/

/*
const routerWrapSection = document.createElement('section');
routerWrapSection.setAttribute('data-vanilla-route-ele', 'router-wrap');

// Добавляем секцию на страницу
document.body.appendChild(routerWrapSection);

const createHomePageElement = () => document.createElement('div');
// Функция для создания элемента <div> для страницы "About"
const createAboutPageElement = () => document.createElement('div');

const homeLink = document.createElement('a');
homeLink.setAttribute('data-vanilla-route-link', 'spa');
homeLink.setAttribute('href', '/');
homeLink.textContent = 'Home';

// Создаем ссылку для страницы "About"
const aboutLink = document.createElement('a');
aboutLink.setAttribute('data-vanilla-route-link', 'spa');
aboutLink.setAttribute('href', '/about');
aboutLink.textContent = 'About';

// Добавляем ссылки на страницу
document.body.appendChild(homeLink);
document.body.appendChild(aboutLink);

const routes = [
  {
    pathname: '/',
    element: createHomePageElement
  },
  {
    pathname: '/about',
    element: createAboutPageElement
  },
  // Добавьте другие маршруты здесь
];

BrowserRoute(routes); */
