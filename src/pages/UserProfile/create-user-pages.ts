// import type { Customer } from '@commercetools/platform-sdk';
// import clientService from '@services/ClientService';
import { button, div, h2 } from '@control.ts/min';

import RegistrationPage from '@pages/RegistrationPage';

import { CreateInformationUsers } from './create-data-users';
import styles from './styles.module.scss';

export class UserProfile {
  private profileInformationContainer: null | HTMLDivElement = null;
  private btnUserStatus = false;
  // private btnAddressesStatus = false;
  // private btnPasswordStatus = false;
  // private btnChangeStatus = false;
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
            this.profileInformationContainer.append(node);
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
        this.profileInformationContainer.append(node);
      }
    });
    return btn;
  }

  private createBtnPasswordLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'Change Password' });
    btn.addEventListener('click', () => {
      if (this.profileInformationContainer) {
        this.profileInformationContainer.innerHTML = '';
        // add inform
        this.profileInformationContainer.textContent = 'dff';
      }
    });
    return btn;
  }

  private createBtnChangeInformationLayout(): HTMLButtonElement {
    const btn = button({ className: styles.userInfoBtn, txt: 'Change Information' });
    btn.addEventListener('click', () => {
      if (this.profileInformationContainer) {
        this.profileInformationContainer.innerHTML = '';
        // add inform
        const registrationPage = new RegistrationPage().createFormComponents();
        this.profileInformationContainer.append(registrationPage);
      }
    });
    return btn;
  }
}
