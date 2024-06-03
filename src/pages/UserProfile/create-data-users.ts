import type { Customer } from '@commercetools/platform-sdk';
import { article, button, div, h3, p, span } from '@control.ts/min';

import clientService from '@services/ClientService';

import styles from './styles.module.scss';

export class CreateInformationUsers {
  private showAllAddressesStatus = false;
  private allAddressesContainer: null | HTMLDivElement = null;
  private defaultBillingAddressId: string | undefined = undefined;
  private defaultShippingAddressId: string | undefined = undefined;

  private async getDataFromServer(): Promise<Customer> {
    const data = await clientService.apiRoot.me().get().execute();
    // console.log(data.body);
    return data.body;
  }

  public async createProfileInformation(): Promise<HTMLElement> {
    const data = await this.getDataFromServer();

    const contentInfo = [
      div({ className: styles.accountProfileInfoContent }, p({ txt: 'First Name:' }), span({ txt: data.firstName })),
      div({ className: styles.accountProfileInfoContent }, p({ txt: 'Last Name:' }), span({ txt: data.lastName })),
      div({ className: styles.accountProfileInfoContent }, p({ txt: 'Email:' }), span({ txt: data.email })),
      div({ className: styles.accountProfileInfoContent }, p({ txt: 'Birthday:' }), span({ txt: data.dateOfBirth })),
    ];

    const node = article({ className: styles.profileInformation }, ...contentInfo);

    return node;
  }

  public async createProfileAddresses(): Promise<HTMLElement> {
    const data = await this.getDataFromServer();
    const node = article({ className: [styles.addressesInformationContainer].join(' ') });

    this.defaultBillingAddressId = data.defaultBillingAddressId;
    this.defaultShippingAddressId = data.defaultShippingAddressId;
    if (this.defaultBillingAddressId && this.defaultShippingAddressId) {
      const defaultAddressNode = div(
        { className: styles.addresses },
        await this.showDefaultAddresses(this.defaultBillingAddressId, 'Billing'),
        await this.showDefaultAddresses(this.defaultShippingAddressId, 'Shipping'),
      );
      node.append(defaultAddressNode);
    }
    this.allAddressesContainer = div({ className: styles.allAddressesContainer });
    const buttonShowAllAddresses = this.buttonShowAllAddresses(this.allAddressesContainer);
    node.append(buttonShowAllAddresses, this.allAddressesContainer);
    return node;
  }

  private async showDefaultAddresses(ID: string, text: string): Promise<HTMLDivElement> {
    const data = await this.getDataFromServer();
    const node = div(
      { className: styles.profileAddresses },
      h3({ className: styles.defaultAddressesTitle, txt: `${text} Address` }),
    );

    data.addresses.forEach((address) => {
      if (address.id === ID) {
        Object.entries(address).forEach((addressData) => {
          if (addressData[0] !== 'id') {
            const nodeInfoAddresses = div(
              { className: styles.accountProfileInfoContent },
              p({ txt: `${addressData[0]}:` }),
              span({ txt: addressData[1] }),
            );
            node.append(nodeInfoAddresses);
          }
        });
      }
    });
    return node;
  }

  private async showAllAddresses(node: HTMLDivElement): Promise<HTMLDivElement> {
    const data = await this.getDataFromServer();

    data.addresses.forEach((address) => {
      const nodeInfoAddressesContainer = div({ className: styles.profileAddresses });
      Object.entries(address).forEach((addressData) => {
        if (addressData[0] !== 'id') {
          const nodeInfoAddresses = div(
            { className: styles.accountProfileInfoContent },
            p({ txt: `${addressData[0]}:` }),
            span({ txt: addressData[1] }),
          );
          nodeInfoAddressesContainer.append(nodeInfoAddresses);
        }
      });
      node.append(nodeInfoAddressesContainer);
    });
    return node;
  }

  private buttonShowAllAddresses(node: HTMLDivElement): HTMLButtonElement {
    const buttonShowAllAddresses = button({ className: styles.userInfoBtn, txt: 'Show All Addresses' });
    buttonShowAllAddresses.addEventListener('click', async () => {
      if (!this.showAllAddressesStatus) {
        await this.showAllAddresses(node);
      } else {
        node.innerHTML = '';
      }
      this.showAllAddressesStatus = !this.showAllAddressesStatus;
    });
    return buttonShowAllAddresses;
  }
}
