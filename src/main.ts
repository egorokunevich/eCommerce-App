import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import styles from '@components/NavMain.module.scss';
import { Layout } from '@pages/Layout';
import { LoginPage } from '@pages/LoginPage';
import { ClientService } from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';

import './components/css/normalise.css';
import { PageRouting } from './routing/routingConfig';

class App {
  private service: ClientService = new ClientService();
  private login = new LoginPage(this.service);
  private loginPage = this.login.createPage();
  private routing = new PageRouting(this.loginPage);
  private layout = new Layout(this.service);

  public async render(): Promise<void> {
    // this.service.getAnonymousToken();

    const { layout } = this;
    layout.renderLayout();

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
