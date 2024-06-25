import { div, h2, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import profileService from '@services/ProfileService';

import styles from './UserProfile.module.scss';

export class ProfilePage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });

  public createPage(): HTMLElement {
    this.createContainer();

    return this.pageWrapper;
  }

  private async createContainer(): Promise<HTMLElement> {
    const userData = await profileService.getUserData();
    const container = div({ className: styles.container });
    if (userData && userData.statusCode === 200) {
      const title = h2({ className: styles.title, txt: `Welcome, ${userData.body.firstName}!` });
      const oldProfile = div({ className: styles.profileBtn, txt: `OLD PROFILE` });
      oldProfile.addEventListener('click', () => {
        Router.go('/profile', { addToHistory: true });
      });
      container.append(title, oldProfile);
    }
    this.pageWrapper.append(container);
    return container;
  }
}
