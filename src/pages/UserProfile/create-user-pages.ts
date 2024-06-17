import { button, div, h2 } from '@control.ts/min';

import { ChangePassword } from './change-password';
import { ChangeUserData } from './change-user-data';
import { CreateInformationUsers } from './create-data-users';
import styles from './styles.module.scss';

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

  // private async getDataFromServer(): Promise<Customer> {
  //   const data = await clientService.apiRoot.me().get().execute();
  //   return data.body;
  // }

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
            const node = await new CreateInformationUsers().createProfileInformation();
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

        const node = await new CreateInformationUsers().createProfileAddresses();
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
        // add inform
        const node = await new ChangePassword().creteNodePassword();
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
        // add inform
        const registrationPage = await new ChangeUserData().createChangeLayout();
        if (registrationPage) {
          this.profileInformationContainer.append(registrationPage);
        }
      }
    });
    return btn;
  }
}

export const userProfile = new UserProfile();
