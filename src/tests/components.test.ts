import Header from '@components/Header';
import NavMain from '@components/NavMain';
import { HomePage } from '@pages/HomePage';
import { Layout } from '@pages/Layout';
import { LoginPage } from '@pages/LoginPage';
import RegistrationPage from '@pages/RegistrationPage';
import { ClientService } from '@services/ClientService';

const service = new ClientService();
const header = new Header();
const navMain = new NavMain(service);
const homePage = new HomePage();
const layout = new Layout(service);
const loginPage = new LoginPage(service);
const registrationPage = new RegistrationPage();

test('getHeaderElement method in Header class should return HTMLElement', () => {
  expect(header.getHeaderElement()).toBeInstanceOf(HTMLElement);
});

test('getMenuElement method in NavMain class should return HTMLElement', () => {
  expect(navMain.getMenuElement()).toBeInstanceOf(HTMLElement);
});

test('createPage method in HomePage class should return HTMLElement', () => {
  expect(homePage.createPage()).toBeInstanceOf(HTMLElement);
});

test('getLayoutElement method in Layout class should return HTMLElement', () => {
  expect(layout.getLayoutElement()).toBeInstanceOf(HTMLElement);
});

test('createPage method in LoginPage class should return HTMLElement', () => {
  expect(loginPage.createPage()).toBeInstanceOf(HTMLElement);
});

test('createRegistration method in RegistrationPage class should return HTMLElement', () => {
  expect(registrationPage.createRegistration()).toBeInstanceOf(HTMLElement);
});
