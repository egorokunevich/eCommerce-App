import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import styles from '@components/NavMain.module.scss';
import { Layout } from '@pages/Layout';
import { LoginPage } from '@pages/LoginPage';
import { anonCacheClass, anonymousClient } from '@services/BuildAnonymousFlowClient';
import { ClientService } from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';

import './components/css/normalise.css';
import { PageRouting } from './routing/routingConfig';

class App {
  private service: ClientService = new ClientService(anonymousClient);
  private login = new LoginPage(this.service);
  private loginPage = this.login.createPage();
  private routing = new PageRouting(this.loginPage);
  private layout = new Layout(this.service);
  constructor() {
    this.login.loginBtn.addEventListener('click', async () => {
      // console.log('tok: ', this.service.checkForTokens());
      const client = await this.login.getPasswordClient();
      if (client) {
        localStorage.setItem('passwordToken', JSON.stringify(anonCacheClass.get()));
        this.service = client;
        this.layout.renderLoggedInNav();
      }
    });

    document.addEventListener('click', () => {
      console.log(window.location.href);
    });
  }

  public async render(): Promise<void> {
    this.service.getAnonymousToken();

    const { layout } = this;
    layout.renderLayout();

    // Render profile and logout buttons if logged in
    const user = JSON.parse(localStorage.getItem('passwordToken') ?? 'null');
    if (user) {
      this.layout.renderLoggedInNav();
      this.layout.navMain.logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('anonymousToken');
        localStorage.removeItem('passwordToken');

        this.layout.renderLoggedOutNav();

        this.service.updateClient(anonymousClient);
        this.service.getAnonymousToken();
      });
    }

    const routerWrapper = setAttributes(main({ className: styles.main }), {
      type: 'data-vanilla-route-ele',
      text: 'router-wrap',
    });
    document.body.appendChild(routerWrapper);

    document.addEventListener('DOMContentLoaded', () => {
      BrowserRoute(this.routing.createRouting());
    });
  }
}

const app = new App();
app.render();
