import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import styles from '@components/NavMain.module.scss';
import { Layout } from '@pages/Layout';
import { setAttributes } from '@utils/BaseComponentProps';

import './components/css/normalise.css';
import { PageRouting } from './routing/routingConfig';

class App {
  private routing = new PageRouting();
  private layout = new Layout();

  public async render(): Promise<void> {
    // clientService.getAnonymousToken();

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
