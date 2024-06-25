import { button, div, h2 } from '@control.ts/min';

import { PasswordUpdate } from './PasswordUpdate';
import { UserInfo } from './UserInfo';
import { UserInfoUpdate } from './UserInfoUpdate';
import styles from './UserProfile.module.scss';

export class UserProfile {
  public profileInformationContainer: null | HTMLDivElement = null;
  private btnUserStatus = false;

  public createUserPage(): HTMLDivElement {
    const node = div(
      { className: styles.profileContainer },
      div(
        { className: styles.profileTitle },
        h2({ className: styles.titleUser, txt: 'User Profile' }),
        this.createBtnUserInfoLayout(),
        this.createBtnAddressesInfoLayout(),
        this.createBtnPasswordLayout(),
        this.createBtnChangeInformationLayout(),
      ),
      this.createProfileInformationContainer(),
    );
    return node;
  }

  private createProfileInformationContainer(): HTMLDivElement {
    this.profileInformationContainer = div({ className: styles.usersInformationContainer });
    return this.profileInformationContainer;
  }

  private createBtnUserInfoLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'User Information' });
    btn.addEventListener('click', async () => {
      if (!this.btnUserStatus) {
        try {
          if (this.profileInformationContainer) {
            this.profileInformationContainer.innerHTML = '';
            const node = await new UserInfo().createProfileInformation();
            if (node) {
              this.profileInformationContainer.append(node);
            }
          }
        } catch (error) {
          throw new Error(`${error}`);
        }
      }
      this.btnUserStatus = !this.btnUserStatus;
    });
    return btn;
  }

  private createBtnAddressesInfoLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'User Addresses' });
    btn.addEventListener('click', async () => {
      if (this.profileInformationContainer) {
        this.profileInformationContainer.innerHTML = '';

        const node = await new UserInfo().createProfileAddresses();
        if (node) {
          this.profileInformationContainer.append(node);
        }
      }
    });
    return btn;
  }

  private createBtnPasswordLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'Change Password' });
    btn.addEventListener('click', async () => {
      if (this.profileInformationContainer) {
        this.profileInformationContainer.innerHTML = '';
        const node = await new PasswordUpdate().creteNodePassword();
        this.profileInformationContainer.append(node);
      }
    });
    return btn;
  }

  private createBtnChangeInformationLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'Change Information' });
    btn.addEventListener('click', async () => {
      if (this.profileInformationContainer) {
        this.profileInformationContainer.innerHTML = '';
        const registrationPage = await new UserInfoUpdate().createChangeLayout();
        if (registrationPage) {
          this.profileInformationContainer.append(registrationPage);
        }
      }
    });
    return btn;
  }
}

export const userProfile = new UserProfile();
