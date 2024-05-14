import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import styles from '@components/NavMain.module.scss';
import { Layout } from '@pages/Layout';
import { LoginPage } from '@pages/LoginPage';
import { anonymousClient } from '@services/BuildAnonymousFlowClient';
import { ClientService } from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';
import './components/css/normalise.css';
import { PageRouting } from './routing/routingConfig';

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

class App {
  private service: ClientService = new ClientService(anonymousClient);
  private login = new LoginPage(this.service);
  private loginPage = this.login.createPage();
  private routing = new PageRouting(this.loginPage);
  constructor() {
    this.login.loginBtn.addEventListener('click', async () => {
      const client = await this.login.getPasswordClient();
      if (client) {
        this.service = client;
      }
    });
  }

  public async render(): Promise<void> {
    const layout = new Layout();
    layout.renderLayout();

    const routerWrapper = setAttributes(main({ className: styles.main }), {
      type: 'data-vanilla-route-ele',
      text: 'router-wrap',
    });
    document.body.appendChild(routerWrapper);

    document.addEventListener('DOMContentLoaded', () => {
      BrowserRoute(this.routing.createRouting());
    });

    // console.log('tokens: ', await this.service.getTokens());
  }
}

const app = new App();
app.render();
