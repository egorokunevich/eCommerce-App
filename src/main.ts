import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import { setAttributes } from '@/utils/BaseComponentProps';
import NavMain from '@components/NavMain';
import styles from '@components/NavMain.module.scss';
import { createLayout } from '@pages/Layout';

import { routeConfig } from './routing/routingConfig';
import './components/css/normalise.css';

createLayout();
const navMain = new NavMain();
navMain.renderNav();

const routerWrapper = setAttributes(main({ className: styles.main}), {
  type: 'data-vanilla-route-ele',
  text: 'router-wrap',
});
document.body.appendChild(routerWrapper);

document.addEventListener('DOMContentLoaded', () => {
  BrowserRoute(routeConfig);
});
