import { button, div, form, h2, input, label, p, section, span } from '@control.ts/min';
import Toastify from 'toastify-js';
import { Router } from 'vanilla-routing';

import { setAttributes } from '@utils/BaseComponentProps';
import { isRegistrationActive, validationText } from '@utils/RegistrationValidationsData';

import styles from './LoginPage.module.scss';
import styleSwitch from './swtich-btn.module.scss';
import stylesValid from '../utils/InputValidations.module.scss';

type ValidationFunction = (input: string) => boolean;
type ErrorMsgType = { nameMsg: string; text: string; func: ValidationFunction }[];
type ValidationErrors = { [key: string]: boolean } & { billingAddress?: { [key: string]: boolean } };
// type ValidationErrorsBilling = { billingAddress: { [key: string]: boolean } };

export default class RegistrationPage {
  private validationMessages: ValidationErrors;
  private registrationBtN: HTMLElement | null;
  private nodeLabel: HTMLElement | null;
  private inputTag: HTMLInputElement | HTMLElement | null;
  private billingIsShipping = false;
  private billingForm: HTMLElement | null = null;
  private billingAddressInput: HTMLElement[] | null = null;
  private shippingAddressInput: HTMLElement[] | null = null;
  constructor() {
    this.validationMessages = {};

    // deleted after
    // this.validationMessages = {
    //   mail: true,
    //   countLetters: true,
    //   letterCase: true,
    //   digit: true,
    //   whitespace: true,
    //   character: true,
    //   noSpecial: true,
    //   age: true,
    //   characterStreet: true,
    //   formatCode: true,
    //   validCountry: true,
    // };

    this.registrationBtN = null;
    this.inputTag = null;
    this.nodeLabel = null;
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
    // написать куда она будет аппендиттся
    // document.querySelector(`.${styles.loginPageWrapper}`)?.append(regSection);
    return regSection;
  }

  private createFormComponents(): HTMLElement {
    const node = form(
      { className: [styles.registrationForm, 'form', styles.loginContainerLoginForm].join(' ') },
      this.createFormLabel('email', validationText.email),
      this.createFormLabel('password', validationText.password),
      this.createFormLabel('firstName', validationText.firstName),
      this.createFormLabel('lastName', validationText.lastName),
      this.createFormLabel('dateOfBirth', validationText.dateOfBirth),

      this.createFormAddress(),
    );

    return node;
  }

  private createFormAddress(): HTMLElement {
    this.billingAddressInput = [
      this.createFormLabel('streetName', validationText.streetName),
      this.createFormLabel('streetNumber', validationText.streetNumber),
      this.createFormLabel('city', validationText.city),
      this.createFormLabel('postalCode', validationText.postalCode),
      this.createFormLabel('country', validationText.country),
    ];

    const node = div(
      { className: ['form_address', 'shipping_address'].join(' ') },
      p({ txt: 'Shipping Address ' }),
      ...this.billingAddressInput,
      this.createBtn(),
      p({ txt: 'Also use as billing address' }),
      this.createCopyFormAddress(),

      this.createRegistrationBtn(),
    );
    // console.log(this.validationMessages);
    return node;
  }

  private createCopyFormAddress(): HTMLElement {
    this.shippingAddressInput = [
      this.createFormLabel('streetName', validationText.streetNameBilling),
      this.createFormLabel('streetNumber', validationText.streetNumberBilling),
      this.createFormLabel('city', validationText.cityBilling),
      this.createFormLabel('postalCode', validationText.postalCodeBilling),
      this.createFormLabel('country', validationText.countryBilling),
    ];

    const node = div(
      { className: ['form_address', styles.billingAddress].join(' ') },
      p({ txt: 'Billing Address ' }),
      ...this.shippingAddressInput,
      this.createDefaultSwitchBtn('Billing'),
    );
    this.billingForm = node;
    return node;
  }

  private createFormLabel(text: string, textMessageError: ErrorMsgType): HTMLElement {
    // at the end we must made this node Input as HTMLInputElement
    this.inputTag = setAttributes(input({ className: styles.inputField, id: `user-${text}` }), [
      {
        type: 'user',
        text: `${text}`,
      },
      { type: 'placeholder', text: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
    ]);
    if (text === 'dateOfBirth') {
      setAttributes(this.inputTag, [{ type: 'type', text: 'date' }]);
    }
    const node: HTMLElement = this.createInputField(textMessageError);
    this.nodeLabel = label({ className: `${styles.loginFormInputLabel}` }, this.inputTag, node);

    const nodeInput = this.inputTag;
    this.inputTag.addEventListener('input', () => {
      if (this.billingIsShipping) {
        const textBilling = document.querySelector(`.${styles.billingAddress} #${nodeInput?.id}`);
        if (textBilling instanceof HTMLInputElement && nodeInput instanceof HTMLInputElement) {
          // console.log(textBilling);
          textBilling.value = nodeInput.value;
        }
      }

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
      // this.billingAddressInput;
      // this.validationMessages;
      this.shippingAddressInput?.forEach((el, index) => {
        if (el && this.billingAddressInput) {
          const inputAddressShipping = el.querySelector('input');
          const inputBillingAddress = this.billingAddressInput[index].querySelector('input');
          if (inputAddressShipping instanceof HTMLInputElement && inputBillingAddress instanceof HTMLInputElement) {
            inputAddressShipping.value = inputBillingAddress.value;
            this.billingForm?.classList.toggle(styles.active);
            // console.log(inputBillingAddress)
            // this.validationMessages
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

    return node;
  }

  private createBtn(): HTMLElement {
    const node = div(
      { className: styles.formBtn },
      this.createDefaultSwitchBtn('Shipping'),
      this.createBtnUseShippingUsBilling(),
    );
    return node;
  }

  private createRegistrationBtn(): HTMLElement {
    this.registrationBtN = setAttributes(
      button({ className: ['register-btn', 'btn', styles.submitBtn].join(' '), txt: 'Register' }),
      [{ text: true, type: 'disabled' }],
    );
    this.registrationBtN.addEventListener('click', () => {
      Toastify({
        text: 'content',
        backgroundColor: 'linear-gradient(to right, #d50000, #950000)',
        gravity: 'bottom',
      }).showToast();
      // write function routing
      // console.log('routing');
    });
    return this.registrationBtN;
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
        // const label1 = this.nodeLabel;
        // if (this.nodeLabel && label1) {
        // label1.classList.toggle(`${stylesValid.inputWarningIcon}`, !isValid);
        // label1.classList.add('input_accept-icon');
        // }
        // node.classList.toggle(`${stylesValid.inputWarningIcon}`, isValid);
        // .classList.remove(`${stylesValid.inputWarningIcon}`
        this.validationMessages[nameMsg] = isValid;
      });
    }
    // console.log(this.validationMessages);
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
      h2({ className: styles.infoHeader, txt: 'LOGIN' }),
      p({
        txt: `Registering on this site will allow you to access the status and history of your orders. Simply fill out the fields below and we'll quickly create a new account for you. We will only ask you the information necessary to make the purchasing process faster and easier`,
      }),
      buttonLoginPage,
    );
    return node;
  }
}

// import { pageRegistration } from '@pages/RegistrationPage';

// pageRegistration.createRegistration();

export const pageRegistration = new RegistrationPage();
