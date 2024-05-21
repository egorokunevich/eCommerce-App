import type { MyCustomerDraft } from '@commercetools/platform-sdk';
import { button, div, form, h2, input, label, p, section, span } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import { ToastColors, showToastMessage } from '@components/Toast';
import type { ClientService } from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';
import type { IRegistrationObject } from '@utils/RegistrationValidationsData';
import { isRegistrationActive, validationText } from '@utils/RegistrationValidationsData';

import styles from './LoginPage.module.scss';
import styleSwitch from './swtich-btn.module.scss';
import stylesValid from '../utils/InputValidations.module.scss';

type ValidationFunction = (input: string) => boolean;
type ErrorMsgType = { nameMsg: string; text: string; func: ValidationFunction }[];
type ValidationErrors = { [key: string]: boolean } & { billingAddress?: { [key: string]: boolean } };

export default class RegistrationPage {
  private validationMessages: ValidationErrors = {};
  private registrationBtN: HTMLElement | null = null;
  private nodeLabel: HTMLElement | null = null;
  private inputTag: HTMLInputElement | HTMLElement | null = null;
  private billingIsShipping = false;
  private billingForm: HTMLElement | null = null;
  private billingAddressInput: HTMLElement[] | null = null;
  private shippingAddressInput: HTMLElement[] | null = null;
  private userMainInput: HTMLElement[] | null = null;
  private defaultShipping: number | undefined = undefined;
  private defaultBilling: number | undefined = undefined;
  private userRegistrationData: IRegistrationObject;
  private clientService: ClientService;

  constructor(service: ClientService) {
    this.clientService = service;
    this.userRegistrationData = {
      email: 'example@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      addresses: [
        {
          streetName: 'Main St',
          streetNumber: '123',
          postalCode: '12345',
          city: 'Anytown',
          country: 'Country',
        },
        {
          streetName: 'Second St',
          streetNumber: '456',
          postalCode: '67890',
          city: 'Othertown',
          country: 'AnotherCountry',
        },
      ],
      defaultShippingAddress: undefined,
      defaultBillingAddress: undefined,
    };
  }

  public createRegistration(): HTMLElement {
    const regSection = section(
      { className: 'registration' },
      div(
        { className: styles.registrationContainer },
        div(
          { className: styles.loginContainer },
          h2({ className: styles.infoHeader, txt: 'REGISTRATION' }),
          this.createFormComponents(),
        ),
        this.createTextLoginComponents(),
      ),
    );
    return regSection;
  }

  private createFormComponents(): HTMLElement {
    this.userMainInput = [
      this.createFormLabel('email', validationText.email),
      this.createFormLabel('password', validationText.password),
      this.createFormLabel('firstName', validationText.firstName),
      this.createFormLabel('lastName', validationText.lastName),
      this.createFormLabel('dateOfBirth', validationText.dateOfBirth),
    ];
    const node = form(
      { className: [styles.registrationForm, 'form', styles.loginContainerLoginForm].join(' ') },
      ...this.userMainInput,

      this.createFormAddress(),
    );

    return node;
  }

  private createFormAddress(): HTMLElement {
    this.shippingAddressInput = [
      this.createFormLabel('streetName', validationText.streetName),
      this.createFormLabel('streetNumber', validationText.streetNumber),
      this.createFormLabel('city', validationText.city),
      this.createFormLabel('country', validationText.country, 'countryShipping'),
      this.createFormLabel('postalCode', validationText.postalCode, 'postalShipping'),
    ];

    const node = div(
      { className: ['form_address', 'shipping_address'].join(' ') },
      p({ txt: 'Shipping Address ' }),
      ...this.shippingAddressInput,
      this.createBtn(),
      p({ txt: 'Also use as billing address' }),
      this.createCopyFormAddress(),

      this.createRegistrationBtn(),
    );
    return node;
  }

  private createCopyFormAddress(): HTMLElement {
    this.billingAddressInput = [
      this.createFormLabel('streetName', validationText.streetNameBilling),
      this.createFormLabel('streetNumber', validationText.streetNumberBilling),
      this.createFormLabel('city', validationText.cityBilling),
      this.createFormLabel('country', validationText.countryBilling, 'countryBilling'),
      this.createFormLabel('postalCode', validationText.postalCodeBilling, 'postalBilling'),
    ];
    const switchBtn = this.createDefaultSwitchBtn('Billing');
    switchBtn.addEventListener('click', () => {
      this.defaultBilling = this.defaultBilling === undefined ? 1 : undefined;
    });
    const node = div(
      { className: ['form_address', styles.billingAddress].join(' ') },
      p({ txt: 'Billing Address ' }),
      ...this.billingAddressInput,
      switchBtn,
    );
    this.billingForm = node;
    return node;
  }

  private createFormLabel(text: string, textMessageError: ErrorMsgType, isAddressType?: string): HTMLElement {
    this.inputTag = setAttributes(
      input({ className: [styles.inputField, isAddressType].join(' '), id: `user-${text}` }),
      [
        {
          type: 'user',
          text: `${text}`,
        },
        { type: 'placeholder', text: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
      ],
    );
    if (text === 'dateOfBirth') {
      setAttributes(this.inputTag, [{ type: 'type', text: 'date' }]);
    }
    const node: HTMLElement = this.createInputField(textMessageError);
    this.nodeLabel = label({ className: `${styles.loginFormInputLabel}` }, this.inputTag, node);
    if (text === 'country') {
      this.nodeLabel.append(p({ txt: 'Select UA:Ukraine or DE:Germany' }));
    }

    const nodeInput = this.inputTag;
    this.inputTag.addEventListener('input', () => {
      if (this.billingIsShipping) {
        const textBilling = document.querySelector(`.${styles.billingAddress} #${nodeInput?.id}`);
        if (textBilling instanceof HTMLInputElement && nodeInput instanceof HTMLInputElement) {
          textBilling.value = nodeInput.value;
        }
      }

      this.registrationBtN?.setAttribute('disabled', 'true');
      if (isRegistrationActive(this.validationMessages)) {
        this.registrationBtN?.removeAttribute('disabled');
      }
    });
    return this.nodeLabel;
  }

  // button

  private createBtnUseShippingUsBilling(): HTMLElement {
    const nodeInput = setAttributes(input({ className: styleSwitch.defaultInput }), { type: 'type', text: 'checkbox' });

    nodeInput.addEventListener('click', () => {
      this.billingAddressInput?.forEach((el, index) => {
        if (el && this.shippingAddressInput) {
          const inputBillingAddress = el.querySelector('input');
          const inputAddressShipping = this.shippingAddressInput[index].querySelector('input');
          if (inputBillingAddress instanceof HTMLInputElement && inputAddressShipping instanceof HTMLInputElement) {
            inputBillingAddress.value = inputAddressShipping.value;
            this.billingForm?.classList.toggle(styles.active);

            const arr = [
              'characterCityBilling',
              'characterStreetNameBilling',
              'characterStreetNumberBilling',
              'formatPostalCodeBilling',
              'validCountryBilling',
            ];
            arr.forEach((ev) => {
              this.validationMessages[ev] = true;
            });
            this.registrationBtN?.setAttribute('disabled', 'true');
            if (isRegistrationActive(this.validationMessages)) {
              this.registrationBtN?.removeAttribute('disabled');
            }
          }
        }
      });

      this.billingIsShipping = !this.billingIsShipping;
    });
    return nodeInput;
  }

  private createDefaultSwitchBtn(name: string): HTMLElement {
    const nodeInput = setAttributes(input({ className: styleSwitch.switchInput }), { type: 'type', text: 'checkbox' });
    const node = div(
      {},
      label(
        { className: `${styleSwitch.registrationSwitch}` },
        nodeInput,
        span({ className: styleSwitch.registrationMove }),
      ),
      p({ txt: `Set as default ${name} address` }),
    );
    nodeInput.addEventListener('click', (ev) => {
      ev.stopPropagation();
    });
    return node;
  }

  private createBtn(): HTMLElement {
    const switchBtn = this.createDefaultSwitchBtn('Shipping');
    switchBtn.addEventListener('click', () => {
      this.defaultShipping = this.defaultShipping === undefined ? 0 : undefined;
    });
    const node = div({ className: styles.formBtn }, switchBtn, this.createBtnUseShippingUsBilling());
    return node;
  }

  private createRegistrationBtn(): HTMLElement {
    this.registrationBtN = setAttributes(
      button({ className: ['register-btn', 'btn', styles.submitBtn].join(' '), txt: 'Register' }),
      [{ text: true, type: 'disabled' }],
    );
    this.registrationBtN.addEventListener('click', (ev) => {
      ev.preventDefault();
      const inputsArray = document.querySelectorAll(`.${styles.inputField}`);
      if (inputsArray) {
        if (
          Array.from(inputsArray).every((el) => {
            if (el instanceof HTMLInputElement && el) {
              return !el.value;
            }
            return false;
          })
        ) {
          // func too show msg eror Toastify
        }
        if (this.userMainInput) {
          this.preparingWriteRegistrationObj(this.userMainInput, 0);
        }
        if (this.shippingAddressInput) {
          this.preparingWriteRegistrationObj(this.shippingAddressInput, 0);
        }
        if (this.billingAddressInput) {
          this.preparingWriteRegistrationObj(this.billingAddressInput, 1);
        }
        this.sendRegistrOnj(this.createUserObjToSend());
      }
      // Toastify
    });
    return this.registrationBtN;
  }

  private createUserObjToSend(): MyCustomerDraft {
    const defaultBilling = this.billingIsShipping ? 0 : this.defaultBilling;
    return {
      email: this.userRegistrationData.email,
      password: this.userRegistrationData.password,
      lastName: this.userRegistrationData.lastName,
      firstName: this.userRegistrationData.firstName,
      dateOfBirth: this.userRegistrationData.dateOfBirth,
      addresses: [this.userRegistrationData.addresses[0], this.userRegistrationData.addresses[1]],
      ...(this.defaultShipping !== undefined ? { defaultShippingAddress: this.defaultShipping } : {}),
      ...(this.defaultBilling !== undefined || this.billingIsShipping ? { defaultBillingAddress: defaultBilling } : {}),
    };
  }

  private async sendRegistrOnj(objUser: MyCustomerDraft): Promise<void> {
    try {
      const res = await this.clientService.registerUser(objUser);
      if (res.statusCode === 201) {
        showToastMessage('Registration is successfull', ToastColors.Green);
        this.clientService.login(this.userRegistrationData.email, this.userRegistrationData.password);
      }
    } catch (error) {
      console.error('Error during registration or login:', error);
      this.clientService.handleAuthError(error);
    }
  }

  private preparingWriteRegistrationObj(arrInputs: HTMLElement[], indexAddress: number): void {
    arrInputs?.forEach((el) => {
      const inputData = el.querySelector('input');
      if (inputData && inputData instanceof HTMLInputElement) {
        this.writeRegistrationObj(inputData, indexAddress);
      }
    });
  }

  private writeRegistrationObj(inputsArray: HTMLInputElement, num: number): void {
    const key = inputsArray.getAttribute('user');
    const { value } = inputsArray;
    if (this.userRegistrationData.addresses) {
      switch (key) {
        case 'firstName':
          this.userRegistrationData.firstName = value;
          break;
        case 'lastName':
          this.userRegistrationData.lastName = value;
          break;
        case 'email':
          this.userRegistrationData.email = value;
          break;
        case 'password':
          this.userRegistrationData.password = value;
          break;
        case 'dateOfBirth':
          this.userRegistrationData.dateOfBirth = value;
          break;
        case 'streetName':
          this.userRegistrationData.addresses[num].streetName = value;
          break;
        case 'streetNumber':
          this.userRegistrationData.addresses[num].streetNumber = value;
          break;
        case 'postalCode':
          this.userRegistrationData.addresses[num].postalCode = value;
          break;
        case 'city':
          this.userRegistrationData.addresses[num].city = value;
          break;
        case 'country':
          this.userRegistrationData.addresses[num].country = value;
          break;
        default:
          break;
      }
    }
  }

  private createValidationMessage(text: { nameMsg: string; text: string; func: ValidationFunction }): HTMLElement {
    const node = setAttributes(div({ txt: text.text, className: `${stylesValid.loginFormErrorMsg}` }), {
      type: 'data-msg',
      text: `${text.nameMsg}`,
    });
    const { nameMsg } = text;
    this.validationMessages[nameMsg] = false;

    if (this.inputTag && this.inputTag instanceof HTMLInputElement) {
      const nodeInput = this.inputTag;

      this.inputTag.addEventListener('input', () => {
        // проверяем будет успешная валидация или нет

        const isValid = text.func(nodeInput.value);

        node.classList.toggle(`${stylesValid.errorMsgActive}`, !isValid);
        // если вводим один адрес на два поля то копируем значения  обьекта

        if (this.billingIsShipping) {
          this.validationMessages[`${nameMsg}Billing`] = isValid;
        }
        // late write icon error message
        this.validationMessages[nameMsg] = isValid;
      });
    }
    return node;
  }

  private createInputField(textMessageError: ErrorMsgType): HTMLElement {
    const passwordContainer = div({ className: `${styles.inputContainer}` });

    textMessageError.forEach((text) => {
      passwordContainer.append(this.createValidationMessage(text));
    });

    return passwordContainer;
  }

  private createTextLoginComponents(): HTMLElement {
    const buttonLoginPage = button({ className: [styles.loginBtn, 'btn', styles.submitBtn].join(' '), txt: 'Login' });
    buttonLoginPage.addEventListener('click', () => {
      Router.go('/login');
    });

    const node = div(
      { className: ['registration_container-login', 'login', styles.loginContainer].join(' ') },
      p({
        txt: `Already have an account?`,
      }),
      buttonLoginPage,
    );
    return node;
  }
}

// import { pageRegistration } from '@pages/RegistrationPage';

// pageRegistration.createRegistration();

// export const pageRegistration = new RegistrationPage();
