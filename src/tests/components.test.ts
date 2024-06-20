import { div } from '@control.ts/min';

import Header from '@components/Header';
// import NavMain from '@components/NavMain';
// import { HomePage } from '@pages/HomePage';
// import { Layout } from '@pages/Layout';
// import { LoginPage } from '@pages/LoginPage';
// import RegistrationPage from '@pages/RegistrationPage';
import { setAttributes } from '@utils/BaseComponentProps';

const header = new Header();
// const navMain = new NavMain();
// const homePage = new HomePage();
// const layout = new Layout();
// const loginPage = new LoginPage();
// const registrationPage = new RegistrationPage();

test('setAttributes should return HTMLElement', () => {
  expect(setAttributes(div({}), { text: 'text', type: 'type' })).toBeInstanceOf(HTMLElement);
});

test('getHeaderElement method in Header class should return HTMLElement', () => {
  expect(header.getHeaderElement()).toBeInstanceOf(HTMLElement);
});

// test('getMenuElement method in NavMain class should return HTMLElement', () => {
//   expect(navMain.getMenuElement()).toBeInstanceOf(HTMLElement);
// });

// test('createPage method in HomePage class should return HTMLElement', () => {
//   expect(homePage.createPage()).toBeInstanceOf(HTMLElement);
// });

// test('getLayoutElement method in Layout class should return HTMLElement', () => {
//   expect(layout.getLayoutElement()).toBeInstanceOf(HTMLElement);
// });

// test('createPage method in LoginPage class should return HTMLElement', () => {
//   expect(loginPage.createPage()).toBeInstanceOf(HTMLElement);
// });

// test('createRegistration method in RegistrationPage class should return HTMLElement', () => {
//   expect(registrationPage.createRegistration()).toBeInstanceOf(HTMLElement);
// });
