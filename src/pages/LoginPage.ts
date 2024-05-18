import { button, div, form, h2, input, label, p, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import { ToastColors, showToastMessage } from '@components/Toast';
import { ClientService } from '@services/ClientService';
import {
  type PasswordValidationMessages,
  validateEmailClientSide,
  validateForm,
  validatePasswordClientSide,
} from '@utils/InputValidations';
import validationStyles from '@utils/InputValidations.module.scss';

import styles from './LoginPage.module.scss';

interface FetchError extends Error {
  statusCode?: number;
}

export class LoginPage {
  public pageWrapper: HTMLElement;
  private emailInputElement: HTMLInputElement = input({});
  private passwordInputElement: HTMLInputElement = input({});
  private emailValidationMessage: HTMLElement = div({});
  private passwordValidationMsgs: PasswordValidationMessages = {
    lengthMsg: div({}),
    uppercaseMsg: div({}),
    digitMsg: div({}),
    whitespaceMsg: div({}),
  };
  private emailLabel: HTMLElement = div({});
  private passwordLabel: HTMLElement = div({});
  private loginStatus: HTMLElement = div({});
  public loginBtn: HTMLButtonElement = button({});

  constructor(private readonly service: ClientService) {
    this.pageWrapper = section({ className: `${styles.loginPageWrapper}` });
  }

  private createEmailInputField(): HTMLElement {
    const emailContainer = div({ className: styles.inputContainer });

    const emailInput = input({
      placeholder: 'Email',
      className: `${styles.inputField}`,
      required: true,
      // value: 'test@test.com',
    });

    this.emailInputElement = emailInput;

    this.emailValidationMessage = div({
      className: `${validationStyles.loginFormErrorMsg}`,
      txt: `> Wrong email format (user@example.com)`,
    });

    const emailLabel = label({ className: `${validationStyles.loginFormInputLabel}` });
    this.emailLabel = emailLabel;

    emailContainer.append(emailLabel, emailInput, this.emailValidationMessage);

    return emailContainer;
  }

  private createValidationMessage(): HTMLElement {
    return div({
      className: `${validationStyles.loginFormErrorMsg}`,
    });
  }

  private createPasswordInputField(): HTMLElement {
    const passwordContainer = div({ className: `${styles.inputContainer}` });
    const passwordInput = input({
      type: 'password',
      placeholder: 'Password',
      className: `${styles.inputField}`,
      required: true,
      autocomplete: 'off',
      minLength: 8,
      // value: 'aA123456',
    });
    this.passwordInputElement = passwordInput;
    const passwordLengthValidationMessage = this.createValidationMessage();
    const passwordUppercaseValidationMessage = this.createValidationMessage();
    const passwordDigitValidationMessage = this.createValidationMessage();
    const passwordWhitespaceValidationMessage = this.createValidationMessage();
    this.passwordValidationMsgs = {
      lengthMsg: passwordLengthValidationMessage,
      uppercaseMsg: passwordUppercaseValidationMessage,
      digitMsg: passwordDigitValidationMessage,
      whitespaceMsg: passwordWhitespaceValidationMessage,
    };
    const showPassBtn = div({ className: `${validationStyles.showPasswordBtn}` });
    showPassBtn.addEventListener('click', () => {
      passwordInput.type =
        passwordInput.type === 'password' ? (passwordInput.type = 'text') : (passwordInput.type = 'password');
    });
    const passwordLabel = label({ className: `${validationStyles.loginFormInputLabel}` }, showPassBtn);
    this.passwordLabel = passwordLabel;
    passwordContainer.append(
      passwordLabel,
      passwordInput,
      passwordLengthValidationMessage,
      passwordUppercaseValidationMessage,
      passwordDigitValidationMessage,
      passwordWhitespaceValidationMessage,
    );
    return passwordContainer;
  }

  public createPage(): Element {
    const formContainer = div({ className: `${styles.loginContainer}` });
    const infoContainer = div({ className: `${styles.loginContainerInfo}` });
    const header = h2({ className: `${styles.infoHeader}`, txt: 'WELCOME' });
    const info = p({
      className: `${styles.infoDescription}`,
      txt: `Nice to see you! Please login via Email and Password.`,
    });
    const loginForm = form({ className: `${styles.loginContainerLoginForm}` });
    const submitContainer = div({
      className: `${styles.submitContainer}`,
    });
    const loginBtn = button({
      type: 'submit',
      txt: 'Login',
      className: `${styles.submitBtn}`,
      disabled: true,
    });
    this.loginBtn = loginBtn;
    const signUpBtn = button({
      type: 'button',
      txt: 'Sign Up',
      className: `${styles.submitBtn}`,
      disabled: false,
    });
    signUpBtn.addEventListener('click', () => {
      Router.go('/registration');
    });
    this.loginStatus = div({
      txt: '',
      className: `${styles.loginStatus}`,
    });
    infoContainer.append(header, info);
    submitContainer.append(loginBtn, signUpBtn);
    loginForm.append(this.createEmailInputField(), this.createPasswordInputField(), submitContainer, this.loginStatus);
    formContainer.append(infoContainer, loginForm);
    this.pageWrapper.append(formContainer);
    this.validate(this.emailInputElement, this.passwordInputElement, loginBtn);
    return this.pageWrapper;
  }

  private validate(emailInput: HTMLInputElement, passwordInput: HTMLInputElement, loginBtn: HTMLButtonElement): void {
    // Make sure that input values valid. Otherwise disable login button. Check errors
    const areInputsValid = {
      email: false,
      password: false,
    };

    emailInput.addEventListener('input', () => {
      emailInput.value = emailInput.value.trim();
      areInputsValid.email = validateEmailClientSide(emailInput, this.emailValidationMessage, this.emailLabel);
      validateForm(Object.values(areInputsValid), loginBtn);
      this.loginStatus.innerText = '';
    });
    passwordInput.addEventListener('input', () => {
      passwordInput.value = passwordInput.value.trim();
      areInputsValid.password = validatePasswordClientSide(
        passwordInput,
        this.passwordValidationMsgs,
        this.passwordLabel,
      );
      validateForm(Object.values(areInputsValid), loginBtn);
      this.loginStatus.innerText = '';
    });
    this.loginBtn.addEventListener('click', async (e): Promise<void> => {
      e.preventDefault();
    });
  }

  public async getPasswordClient(): Promise<ClientService | null> {
    let result = null;

    const isFetchError = (error: unknown): error is FetchError => {
      return typeof error === 'object' && error !== null && 'statusCode' in error;
    };
    const handleAuthError = (error: unknown): void => {
      if (isFetchError(error)) {
        showToastMessage(error.message, ToastColors.Red);
      }
    };

    try {
      const response = await this.service.logInCustomer({
        email: this.emailInputElement.value,
        password: this.passwordInputElement.value,
      });

      if (response.statusCode === 200) {
        const client = this.service.getPasswordClient(this.emailInputElement.value, this.passwordInputElement.value);

        Router.go('/', { addToHistory: true });

        result = new ClientService(client);
        // return new ClientService(client);
      }
    } catch (e) {
      handleAuthError(e);
    }
    return result;
  }

  public destroy(): void {
    this.pageWrapper.remove();
  }
}
