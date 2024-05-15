import { button, div, form, h2, input, label, p, section } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';
import { isRegistrationActive, validationText } from '@/utils/RegistrationValidationsData';

import styles from './LoginPage.module.scss';
import stylesValid from '../utils/InputValidations.module.scss';

type ValidationFunction = (input: string) => boolean;
type ErrorMsgType = { nameMsg: string; text: string; func: ValidationFunction }[];
type ValidationErrors = { [key: string]: boolean };

export default class RegistrationPage {
  private validationMessages: ValidationErrors;
  private registrationBtN: HTMLElement | null;
  private nodeLabel: HTMLElement | null;
  private inputTag: HTMLInputElement | HTMLElement | null;
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
      { className: ['registration_form', 'form', styles.loginContainerLoginForm].join(' ') },
      this.createFormLabel('mail', validationText.mail),
      this.createFormLabel('password', validationText.password),
      this.createFormLabel('name', validationText.name),
      this.createFormLabel('surname', validationText.name),
      this.createFormLabel('birthday', validationText.birth),

      this.createFormAddress(),
    );

    return node;
  }

  private createFormAddress(): HTMLElement {
    const node = div(
      { className: 'form_address' },
      p({ txt: 'Address ' }),
      this.createFormLabel('street', validationText.street),
      this.createFormLabel('street number', validationText.street),
      this.createFormLabel('city', validationText.name),
      this.createFormLabel('code', validationText.code),
      this.createFormLabel('country', validationText.country),
      this.createRegistrationBtn(),
    );
    return node;
  }

  private createRegistrationBtn(): HTMLElement {
    this.registrationBtN = setAttributes(
      button({ className: ['register-btn', 'btn', styles.submitBtn].join(' '), txt: 'Register' }),
      [{ text: true, type: 'disabled' }],
    );
    this.registrationBtN.addEventListener('click', () => {
      // write function routing
      // console.log('routing');
    });
    return this.registrationBtN;
  }

  private createFormLabel(text: string, textMessageError: ErrorMsgType): HTMLElement {
    // at the end we must made this node Input as HTMLInputElement
    this.inputTag = setAttributes(input({ className: styles.inputField, id: `user-${text}` }), [
      {
        type: 'user',
        text: `user-${text}`,
      },
      { type: 'placeholder', text: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
    ]);

    const node: HTMLElement = this.createInputField(textMessageError);
    this.nodeLabel = label({ className: `${styles.loginFormInputLabel}` }, this.inputTag, node);

    // const nodeInput = this.inputTag;
    this.inputTag.addEventListener('input', () => {
      if (isRegistrationActive(this.validationMessages)) {
        this.registrationBtN?.removeAttribute('disabled');
      }
    });
    return this.nodeLabel;
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
        const label1 = this.nodeLabel;
        node.classList.toggle(`${stylesValid.errorMsgActive}`, !isValid);
        if (this.nodeLabel && label1) {
          this.nodeLabel.classList.toggle(`${stylesValid.inputWarningIcon}`, !isValid);
          label1.classList.add('input_accept-icon');
        }
        // node.classList.toggle(`${stylesValid.inputWarningIcon}`, isValid);
        // .classList.remove(`${stylesValid.inputWarningIcon}`
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
    const buttonLoginPage = button({ className: ['login-btn', 'btn', styles.submitBtn].join(' '), txt: 'Login' });
    buttonLoginPage.addEventListener('click', () => {
      // Toastify({
      //   text: "This is a toast",
      //   className: "info",
      //   style: {
      //     background: "linear-gradient(to right, #00b09b, #96c93d)",
      //   }
      // }).showToast();
      // const parentElement = document.querySelector(`.${styles.loginPageWrapper}`);
      // routing too login page
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
