import type { AddressDraft, BaseAddress, Customer, Address as PlatformAddress } from '@commercetools/platform-sdk';
import { article, button, div, h3, input, p, span } from '@control.ts/min';

import { ToastColors, showToastMessage } from '@components/Toast';
import clientService from '@services/ClientService';
import { validationText } from '@utils/RegistrationValidationsData';

/* eslint-disable import/no-cycle */
import { AddNewAddress } from './add-new-address';
import styles from './styles.module.scss';

interface Address extends Partial<BaseAddress> {
  id: string;
  country: string;
  [key: string]: string | undefined;
}

export class CreateInformationUsers {
  private showAllAddressesStatus = false;
  private showNewAddressesStatus = false;

  private addNewAddress: AddNewAddress = new AddNewAddress();
  private allAddressesContainer: null | HTMLDivElement = null;
  private defaultBillingAddressId: string | undefined = undefined;
  private defaultShippingAddressId: string | undefined = undefined;

  private async getDataFromServer(): Promise<Customer> {
    const data = await clientService.apiRoot.me().get().execute();
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

  private async createAddressButtonsContainer(showAllButton: HTMLButtonElement): Promise<HTMLDivElement> {
    const container = div({ className: styles.addressButtonsContainer });
    const addAddressButton = button({ className: styles.userInfoBtn, txt: 'Add Address' });
    const newAddress = await this.addNewAddress.addNewAddressContainer();
    addAddressButton.addEventListener('click', () => {
      // her change info for add address
      if (this.showNewAddressesStatus) {
        newAddress.remove();
      } else {
        container.append(newAddress);
      }
      this.showNewAddressesStatus = !this.showNewAddressesStatus;
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
    const addressButtonsContainer = await this.createAddressButtonsContainer(buttonShowAllAddresses);
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
        Object.entries(address).forEach(([key, value]) => {
          if (key !== 'id') {
            const nodeInfoAddresses = div(
              { className: styles.accountProfileInfoContent },
              p({ txt: `${key}:` }),
              span({ txt: String(value) }),
            );
            node.append(nodeInfoAddresses);
          }
        });

        const editButton = button({ className: styles.userInfoBtn, txt: 'Edit' });
        editButton.addEventListener('click', () => this.editAddressForm(address, node));
        node.append(editButton);

        const deleteButton = button({ className: styles.userInfoBtn, txt: 'Delete' });
        if (address.id) {
          deleteButton.addEventListener('click', () => this.deleteAddress(String(address.id), node));
        } else {
          console.error('Address ID is missing for delete operation.');
        }
        node.append(deleteButton);
      }
    });

    return node;
  }

  private async showAllAddresses(node: HTMLDivElement): Promise<HTMLDivElement> {
    const data = await this.getDataFromServer();

    data.addresses.forEach((address) => {
      const nodeInfoAddressesContainer = div({ className: styles.profileAddresses });
      Object.entries(address).forEach(([key, value]) => {
        if (key !== 'id') {
          const nodeInfoAddresses = div(
            { className: styles.accountProfileInfoContent },
            p({ txt: key }),
            span({ txt: String(value) }),
          );
          nodeInfoAddressesContainer.append(nodeInfoAddresses);
        }
      });
      const editButton = button({ className: styles.userInfoBtn, txt: 'Edit' });
      editButton.addEventListener('click', () => this.editAddressForm(address, nodeInfoAddressesContainer));
      nodeInfoAddressesContainer.append(editButton);

      const deleteButton = button({ className: styles.userInfoBtn, txt: 'Delete' });
      if (address.id) {
        deleteButton.addEventListener('click', () =>
          this.deleteAddress(String(address.id), nodeInfoAddressesContainer),
        );
      } else {
        console.error('Address ID is missing for delete operation.');
      }
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
  private editAddressForm(address: PlatformAddress, container: HTMLElement): void {
    const addressType = container.querySelector('h3')?.textContent?.includes('Billing') ? 'Billing' : 'Shipping';
    container.innerHTML = '';

    Object.entries(address).forEach(([key, value]) => {
      if (key !== 'id') {
        const inputField = this.createInputField(key, String(value));
        const nodeInfoAddresses = this.createAddressNodeInfo(key, inputField);

        if (validationText[key]) {
          this.addValidationMessages(key, inputField, nodeInfoAddresses);
        }

        container.append(nodeInfoAddresses);
      }
    });

    this.addSaveButton(String(address.id), addressType, container);
  }

  private createInputField(key: string, value: string): HTMLInputElement {
    const inputField = input({ className: styles.editInput, value });
    inputField.dataset.key = key;
    return inputField;
  }

  private createAddressNodeInfo(key: string, inputField: HTMLInputElement): HTMLDivElement {
    return div({ className: styles.accountProfileInfoContent }, p({ txt: `${key}:` }), inputField);
  }

  private addValidationMessages(key: string, inputField: HTMLInputElement, nodeInfoAddresses: HTMLDivElement): void {
    const validationMessagesContainer = div({ className: styles.inputContainer });

    validationText[key].forEach((validation) => {
      const validationMessage = p({ className: styles.errorMsg, txt: validation.text });
      validationMessage.style.display = 'none';
      validationMessagesContainer.append(validationMessage);

      inputField.addEventListener('input', () => {
        const isValid = validation.func(inputField.value);
        validationMessage.style.display = isValid ? 'none' : 'block';
      });
    });

    nodeInfoAddresses.append(validationMessagesContainer);
  }

  private addSaveButton(addressId: string, addressType: string, container: HTMLElement): void {
    const saveButton = button({ className: styles.userInfoBtn, txt: 'Save' });
    saveButton.addEventListener('click', async () => {
      await this.saveAddress(addressId, container);
      container.innerHTML = '';

      if (addressType === 'Billing' && this.defaultBillingAddressId) {
        const defaultAddressNode = await this.showDefaultAddresses(this.defaultBillingAddressId, 'Billing');
        container.append(defaultAddressNode);
      } else if (addressType === 'Shipping' && this.defaultShippingAddressId) {
        const shippingAddressNode = await this.showDefaultAddresses(this.defaultShippingAddressId, 'Shipping');
        container.append(shippingAddressNode);
      }
    });
    container.append(saveButton);
  }

  private async saveAddress(addressId: string, container: HTMLElement): Promise<void> {
    const data = await this.getDataFromServer();
    const currentVersion = data.version;
    const editInputs = container.querySelectorAll('input');
    const updatedAddress: Partial<Address> = { id: addressId };
    editInputs.forEach((editInput) => {
      const { key } = editInput.dataset;
      if (key) {
        updatedAddress[key] = editInput.value;
      }
    });
    const completeAddress: AddressDraft = {
      country: updatedAddress.country ?? 'DefaultCountry',
      streetName: updatedAddress.streetName || '',
      postalCode: updatedAddress.postalCode || '',
      city: updatedAddress.city || '',
      ...updatedAddress,
    };
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
                address: completeAddress,
              },
            ],
          },
        })
        .execute();
      showToastMessage('Address updated successfully!', ToastColors.Green);
    } catch (error) {
      console.error('Error updating address:', error);
      showToastMessage('Error updating address.');
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

export const createInformationUsers = new CreateInformationUsers();
