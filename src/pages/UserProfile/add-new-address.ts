import type { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { button, div, form } from '@control.ts/min';

import { ToastColors, showToastMessage } from '@components/Toast';
import RegistrationPage from '@pages/RegistrationPage';
import clientService from '@services/ClientService';
import { isRegistrationActive, validationText } from '@utils/RegistrationValidationsData';

import styles from './styles.module.scss';

interface UserInput {
  streetName: string;
  streetNumber: string;
  city: string;
  country: string;
  postalCode: string;
}

export class AddNewAddress {
  private registrationPageClass: RegistrationPage = new RegistrationPage();

  private defaultShipping: number | undefined = undefined;
  private defaultBilling: number | undefined = undefined;

  private inputStreetName: null | HTMLElement = null;
  private inputStreetNumber: null | HTMLElement = null;
  private inputCity: null | HTMLElement = null;
  private inputCountry: null | HTMLElement = null;
  private inputPostalCode: null | HTMLElement = null;

  private async getDataFromServer(): Promise<Customer> {
    const data = await clientService.apiRoot.me().get().execute();
    return data.body;
  }

  public async addNewAddressContainer(): Promise<HTMLElement> {
    const node = form({}, this.createInputs(), this.createDefaultBtn(), await this.createBtnToAddNewAddress());
    return node;
  }

  private createInputs(): HTMLElement {
    // const data = await this.getDataFromServer();
    const node = div({});

    const labelStreetName = this.registrationPageClass.createFormLabel('streetName', validationText.streetNameBilling);
    this.inputStreetName = this.registrationPageClass.inputTag;

    const labelStreetNumber = this.registrationPageClass.createFormLabel(
      'streetNumber',
      validationText.streetNumberBilling,
    );
    this.inputStreetNumber = this.registrationPageClass.inputTag;

    const labelCity = this.registrationPageClass.createFormLabel('city', validationText.cityBilling);
    this.inputCity = this.registrationPageClass.inputTag;

    const labelCountry = this.registrationPageClass.createFormLabel('country', validationText.countryBilling);
    this.inputCountry = this.registrationPageClass.inputTag;

    const labelPostalCode = this.registrationPageClass.createFormLabel('postalCode', validationText.postalCodeBilling);
    this.inputPostalCode = this.registrationPageClass.inputTag;

    node.append(labelStreetName, labelStreetNumber, labelCity, labelCountry, labelPostalCode);

    return node;
  }

  private async createBtnToAddNewAddress(): Promise<HTMLButtonElement> {
    const { validationMessages } = this.registrationPageClass;
    const btn = button({ className: styles.userInfoBtn, txt: 'Save New Address' });

    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const inputsValue = this.checkInputsValue();
      if (inputsValue && isRegistrationActive(validationMessages) && this.isInputsValueEmpty()) {
        await this.addMyCustomerAddress(inputsValue);

        showToastMessage('Your new Address was add', ToastColors.Green);
        const addressLayout = document.querySelector(`.${styles.usersInformationContainer}`);
        if (addressLayout) {
          addressLayout.innerHTML = '';
          // addressLayout.append(await createInformationUsers.createProfileAddresses());
        }
      } else {
        showToastMessage('Please, fill in all Fields', ToastColors.Red);
      }
    });
    return btn;
  }

  private createDefaultBtn(): HTMLElement {
    const defaultShippingBtn = this.registrationPageClass.createDefaultSwitchBtn('Shipping');
    const defaultBillingBtn = this.registrationPageClass.createDefaultSwitchBtn('Billing');

    defaultShippingBtn.addEventListener('click', () => {
      this.defaultShipping = this.defaultShipping === undefined ? 0 : undefined;
    });

    defaultBillingBtn.addEventListener('click', () => {
      this.defaultBilling = this.defaultBilling === undefined ? 1 : undefined;
    });

    const node = div({}, defaultBillingBtn, defaultShippingBtn);
    return node;
  }

  public checkInputsValue(): UserInput | undefined {
    if (
      this.inputStreetName instanceof HTMLInputElement &&
      this.inputStreetNumber instanceof HTMLInputElement &&
      this.inputCity instanceof HTMLInputElement &&
      this.inputCountry instanceof HTMLInputElement &&
      this.inputPostalCode instanceof HTMLInputElement
    ) {
      return {
        streetName: this.inputStreetName.value,
        streetNumber: this.inputStreetNumber.value,
        city: this.inputCity.value,
        country: this.inputCountry.value,
        postalCode: this.inputPostalCode.value,
      };
    }
    return undefined;
  }

  private isInputsValueEmpty(): boolean {
    const inputsValue = this.checkInputsValue();

    return inputsValue ? Object.values(inputsValue).every((value) => value !== '') : false;
  }

  private async addMyCustomerAddress(newAddress: UserInput): Promise<Customer> {
    const actions: MyCustomerUpdateAction[] = [
      {
        action: 'addAddress',
        address: newAddress,
      },
    ];

    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version: (await this.getDataFromServer()).version,
          actions,
        },
      })
      .execute();
    this.makeDefaultAddress(response.body);
    return response.body;
    // return updateActions.body;
  }

  private async makeDefaultAddress(response: Customer): Promise<void> {
    const addressId = response.addresses[response.addresses.length - 1].id;

    const updateActions: MyCustomerUpdateAction[] = [];

    if (typeof this.defaultBilling === 'number') {
      updateActions.push({
        action: 'setDefaultBillingAddress',
        addressId,
      });
    }
    if (typeof this.defaultShipping === 'number') {
      updateActions.push({
        action: 'setDefaultShippingAddress',
        addressId,
      });
    }
    if (updateActions.length >= 1) {
      await clientService.apiRoot
        .me()
        .post({
          body: {
            version: (await this.getDataFromServer()).version,
            actions: updateActions,
          },
        })
        .execute();
    }
  }
}
