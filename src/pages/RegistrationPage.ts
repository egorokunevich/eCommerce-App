import { button, div, form, h2, input, label, p, section } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';
import { validateEmailClientSide, validateForm, validatePasswordClientSide } from '@/utils/InputValidations';

import styles from './LoginPage.module.scss';

export default class RegistrationPage {
  public createRegistration(): HTMLElement {
    const regSection = section(
      { className: 'registration' },
      div(
        { className: 'styles.loginContainer' },
        div(
          { className: styles.loginContainer },
          h2({ className: styles.infoHeader, txt: 'REGISTRATION' }),
          this.createFormComponents(),
        ),
        this.createTextLoginComponents(),
      ),
    );
    document.querySelector(`.${styles.loginPageWrapper}`)?.append(regSection);
    return regSection;
  }

  private createFormComponents(): HTMLElement {
    const node = form(
      { className: ['registration_form', 'form', styles.loginContainerLoginForm].join(' ') },
      this.createFormLabel('mail'),
      this.createFormLabel('password'),
      this.createFormLabel('name'),
      this.createFormLabel('surname'),
      this.createFormLabel('birthday'),

      this.createFormAddress(),
    );
    return node;
  }

  private createFormAddress(): HTMLElement {
    const node = div(
      { className: 'form_address' },
      p({ txt: 'Address ' }),
      this.createFormLabel('street'),
      this.createFormLabel('city'),
      this.createFormLabel('code'),
      this.createFormLabel('country'),
      button({ className: styles.submitBtn, txt: 'Register' }),
    );
    return node;
  }

  private createFormLabel(text: string): HTMLLabelElement {
    //at the end we must made this node Input as HTMLInputElement
    const inputTag = setAttributes(input({ className: styles.inputField, id: `user-${text}` }), [
      {
        type: 'user',
        text: `user-${text}`,
      },
      { type: 'placeholder', text: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
    ]) as HTMLInputElement;
    // const inputTag = document.createElement('input');
    inputTag.addEventListener('input', function () {
      const inputTag = this.value;
      //we must start today Egor!!!!!!!
      // emailValidationMessage(inputTag,)
    });

    return label(
      {},
      inputTag,
      // { txt: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
    );
  }
  private createTextLoginComponents(): HTMLElement {
    const node = div(
      { className: ['registration_container-login', 'login', styles.loginContainer].join(' ') },
      h2({ className: styles.infoHeader, txt: 'LOGIN' }),
      p({
        txt: `Registering on this site will allow you to access the status and history of your orders. Simply fill out the fields below and we'll quickly create a new account for you. We will only ask you the information necessary to make the purchasing process faster and easier`,
      }),
      button({ className: ['login-btn', 'btn', styles.submitBtn].join(' '), txt: 'Login' }),
    );
    return node;
  }
}

// import { pageRegistration } from '@pages/RegistrationPage';

// pageRegistration.createRegistration();

export const pageRegistration = new RegistrationPage();
