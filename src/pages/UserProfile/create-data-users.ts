import type { Customer } from '@commercetools/platform-sdk';
import { article, button, div, h3, input, p, span } from '@control.ts/min';

import { ToastColors, showToastMessage } from '@components/Toast';
import RegistrationPage from '@pages/RegistrationPage';
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

  private createAddressButtonsContainer(showAllButton: HTMLButtonElement): HTMLDivElement {
    const container = div({ className: styles.addressButtonsContainer });
    const addAddressButton = button({ className: styles.userInfoBtn, txt: 'Add Address' });

    addAddressButton.addEventListener('click', () => {
      const registrationPage = new RegistrationPage();
      const addressForm = registrationPage.createFormAddress();
      container.append(addressForm);
    });

    container.append(showAllButton, addAddressButton);
    return container;
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
    const addressButtonsContainer = this.createAddressButtonsContainer(buttonShowAllAddresses);
    node.append(addressButtonsContainer, this.allAddressesContainer);
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
              // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
              span({ txt: addressData[1] as string }),
            );
            node.append(nodeInfoAddresses);
          }
        });
        const editButton = button({ className: styles.userInfoBtn, txt: 'Edit' });
        editButton.addEventListener('click', () => this.editAddressForm(address, node));
        node.append(editButton);

        const deleteButton = button({ className: styles.userInfoBtn, txt: 'Delete' });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        deleteButton.addEventListener('click', () => this.deleteAddress(address.id!, node));
        node.append(deleteButton);
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
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            span({ txt: addressData[1] as string }),
          );
          nodeInfoAddressesContainer.append(nodeInfoAddresses);
        }
      });
      const editButton = button({ className: styles.userInfoBtn, txt: 'Edit' });
      editButton.addEventListener('click', () => this.editAddressForm(address, nodeInfoAddressesContainer));
      nodeInfoAddressesContainer.append(editButton);

      const deleteButton = button({ className: styles.userInfoBtn, txt: 'Delete' });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      deleteButton.addEventListener('click', () => this.deleteAddress(address.id!, nodeInfoAddressesContainer));
      nodeInfoAddressesContainer.append(deleteButton);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private editAddressForm(address: any, container: HTMLElement): void {
    container.innerHTML = '';
    Object.entries(address).forEach((addressData) => {
      if (addressData[0] !== 'id') {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const inputField = input({ className: styles.editInput, value: addressData[1] as string });
        // eslint-disable-next-line prefer-destructuring
        inputField.dataset.key = addressData[0]; // Use dataset for custom data attributes
        const nodeInfoAddresses = div(
          { className: styles.accountProfileInfoContent },
          p({ txt: `${addressData[0]}:` }),
          inputField,
        );
        container.append(nodeInfoAddresses);
      }
    });

    const saveButton = button({ className: styles.userInfoBtn, txt: 'Save' });
    saveButton.addEventListener('click', () => this.saveAddress(address.id, container));
    container.append(saveButton);
    // this.createProfileAddresses();
  }

  private async saveAddress(addressId: string, container: HTMLElement): Promise<void> {
    const data = await this.getDataFromServer();
    const currentVersion = data.version; // Get the current version of the customer

    const editInputs = container.querySelectorAll('input');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedAddress: any = { id: addressId };

    editInputs.forEach((editInput) => {
      const { key } = editInput.dataset;
      if (key) {
        updatedAddress[key] = editInput.value;
      }
    });

    try {
      await clientService.apiRoot
        .me()
        .post({
          body: {
            version: currentVersion,
            actions: [
              {
                action: 'changeAddress',
                addressId,
                address: updatedAddress,
              },
            ],
          },
        })
        .execute();
      showToastMessage('Address updated successfully!', ToastColors.Green);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  }
  private async deleteAddress(addressId: string, container: HTMLElement): Promise<void> {
    const data = await this.getDataFromServer();
    const currentVersion = data.version;

    try {
      await clientService.apiRoot
        .me()
        .post({
          body: {
            version: currentVersion,
            actions: [
              {
                action: 'removeAddress',
                addressId,
              },
            ],
          },
        })
        .execute();
      showToastMessage('Address deleted successfully!', ToastColors.Green);
      container.style.display = 'none';
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  }
}
