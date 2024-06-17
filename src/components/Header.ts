import { a, header } from '@control.ts/min';

import { setAttributes } from '@utils/BaseComponentProps';

import styles from './Header.module.scss';

export default class Header {
  private headerElement: HTMLElement | null = null;

  public createHeader(): void {
    const link = setAttributes(a({ href: '/', txt: 'COFFEE LOOP' }), {
      type: 'data-vanilla-route-link',
      text: 'spa',
    });

    const headerMain = header({ className: styles.header }, link);
    this.headerElement = headerMain;
  }

  public getHeaderElement(): HTMLElement | null {
    if (!this.headerElement) {
      this.createHeader();
    }
    return this.headerElement;
  }

  public renderHeader(): void {
    const headerMain = this.getHeaderElement();
    if (headerMain) {
      document.body.appendChild(headerMain);
    }
  }
}
