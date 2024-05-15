import { a, div, h2, p, section } from '@control.ts/min';

import styles from './NotFoundPage.module.scss';

export class NotFoundPage {
  private pageWrapper: HTMLElement;
  private parent: HTMLElement = document.body;

  constructor() {
    this.pageWrapper = section({ className: styles.notFoundPageWrapper });
  }

  public render(): Element {
    const infoContainer = div({ className: styles.infoContainer });
    const header = h2({ className: `${styles.infoHeader}`, txt: 'Ooops!' });
    const info = p({
      className: `${styles.infoDescription}`,
      txt: `This page wasn't found.`,
    });
    const linksContainer = div({ className: styles.linksContainer });
    const infoLink = p({
      className: `${styles.infoDescription}`,
      txt: `Please, return`,
    });
    const linkBack = a({ href: '/', txt: 'Home' });

    infoContainer.append(header, info);
    linksContainer.append(infoLink, linkBack);
    this.pageWrapper.append(infoContainer, linksContainer);
    this.parent.append(this.pageWrapper);
    return this.pageWrapper;
  }
}
