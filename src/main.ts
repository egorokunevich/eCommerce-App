import './components/css/normalise.css';
import { main } from '@control.ts/min';
import { BrowserRoute } from 'vanilla-routing';

import { setAttributes } from '@/utils/BaseComponentProps';
import styles from '@components/NavMain.module.scss';
import { createLayout } from '@pages/Layout';

import { routeConfig } from './routing/routingConfig';

createLayout();

const routerWrapper = setAttributes(main({ className: `${styles.main}` }), {
  type: 'data-vanilla-route-ele',
  text: 'router-wrap',
});
document.body.appendChild(routerWrapper);

document.addEventListener('DOMContentLoaded', () => {
  BrowserRoute(routeConfig);
});
