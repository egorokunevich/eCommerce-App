import { div } from '@control.ts/min';

import Header from '@components/Header';
import NavMain from '@components/NavMain';

import styles from './Layout.module.scss';

export class Layout {
  private layoutElement: HTMLElement | null = null;
  private header: Header;
  public navMain: NavMain;

  constructor() {
    this.header = new Header();
    this.navMain = new NavMain();
  }

  private createLayout(): void {
    const layout = div({ className: styles.headerWrapper });
    const headerElement = this.header.getHeaderElement();
    if (headerElement) {
      layout.appendChild(headerElement);
    }

    const menuElement = this.navMain.getMenuElement();
    if (menuElement) {
      layout.appendChild(menuElement);
    }
    this.layoutElement = layout;
  }

  public getLayoutElement(): HTMLElement | null {
    if (!this.layoutElement) {
      this.createLayout();
    }
    return this.layoutElement;
  }

  public renderLayout(): void {
    const layout = this.getLayoutElement();
    if (layout) {
      document.body.appendChild(layout);
    }
  }
}

// export const renderLayout = (): void => {
//   const layout = new Layout();
//   layout.renderLayout();
// };
