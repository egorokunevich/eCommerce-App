import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import { setAttributes } from '@/utils/BaseComponentProps';
import styles from '@components/NavMain.module.scss';
import { Layout } from '@pages/Layout';

import { routeConfig } from './routing/routingConfig';
// import type { MyCustomerSignin } from '@commercetools/platform-sdk';

// import { LoginPage } from '@pages/LoginPage';
import './components/css/normalise.css';
// import {
//   CustomerService,
//   // CustomerSignUp, concatDateOfBirth
// } from '@services/CustomerAPIService';

// const login = new LoginPage();
// login.render();

// const customerService = new CustomerService();

// SignUp data
// const customerSignUp: CustomerSignUp = {
//   email: 'test2@test.test',
//   password: 'aA123456',
//   firstName: 'Yahor',
//   lastName: 'Akunevich',
//   dateOfBirth: concatDateOfBirth(1998, 9, 22),
//   addresses: [
//     {
//       streetName: 'Alexandrova',
//       streetNumber: '1',
//       city: 'Minsk',
//       postalCode: '000000',
//       country: 'US',
//     },
//   ],
// };

// LogIn data
// const customerLogIn: MyCustomerSignin = {
//   email: 'test2@test.test',
//   password: 'aA123456',
// };

// LogIn
// console.log(
//   'New Customer: ',
//   await customerService
//     .logInCustomer(customerLogIn)
//     .then((data) => data.body.customer)
//     .catch((error: Error) => console.error('Error !!!!: ', error.message)),
// );

// SignUp
// console.log(
//   'New Customer: ',
//   await customerService
//     .createCustomer(customerSignUp)
//     .then((data) => data.body.customer)
//     .catch((error: Error) => console.error('Error !!!!: ', error.message)),
// );

// Unable after authorization
// console.log('All Customers: ', await customerService.getAllCustomers());

const layout = new Layout();
layout.renderLayout();

const routerWrapper = setAttributes(main({ className: styles.main }), {
  type: 'data-vanilla-route-ele',
  text: 'router-wrap',
});
document.body.appendChild(routerWrapper);

document.addEventListener('DOMContentLoaded', () => {
  BrowserRoute(routeConfig);
});
