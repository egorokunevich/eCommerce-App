import { button, div, form, h2, input, label, p, section } from '@control.ts/min';

import { setAttributes } from '@/utils/BaseComponentProps';

export default class RegistrationPage {
  public createRegistration(): void {
    const regSection = section(
      { className: 'registration' },
      div(
        { className: 'registration_container' },
        div(
          { className: 'registration_container-form' },
          h2({ className: 'registration_title', txt: 'REGISTRATION' }),
          this.createFormComponents(),
        ),
        this.createTextLoginComponents(),
      ),
    );
    document.body.append(regSection);
  }

  private createFormComponents(): HTMLElement {
    const node = form(
      { className: ['registration_form', 'form'].join(' ') },
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
      this.createFormLabel('street'),
      this.createFormLabel('city'),
      this.createFormLabel('code'),
      this.createFormLabel('country'),
    );
    return node;
  }

  private createFormLabel(text: string): HTMLLabelElement {
    return label(
      { txt: `${text.slice(0, 1).toLocaleUpperCase() + text.slice(1)}` },
      setAttributes(input({ className: 'form_input', id: `user-${text}` }), {
        type: 'user',
        text: `user-${text}`,
      }),
    );
  }
  private createTextLoginComponents(): HTMLElement {
    const node = div(
      { className: ['registration_container-login', 'login'].join(' ') },
      h2({ className: 'login_title', txt: 'LOGIN' }),
      p({
        txt: `Registering on this site will allow you to access the status and history of your orders. Simply fill out the fields below and we'll quickly create a new account for you. We will only ask you the information necessary to make the purchasing process faster and easier`,
      }),
      button({ className: ['login-btn', 'btn'].join(' '), txt: 'Registering' }),
    );
    return node;
  }
}

// import { pageRegistration } from '@pages/RegistrationPage';

// pageRegistration.createRegistration();

export const pageRegistration = new RegistrationPage();
