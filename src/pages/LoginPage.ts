import { button, div, form, h2, input, label, p, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import { showToastMessage } from '@components/Toast';
import clientService from '@services/ClientService';
import {
  type PasswordValidationMessages,
  validateEmailClientSide,
  validateForm,
  validatePasswordClientSide,
} from '@utils/InputValidations';
import validationStyles from '@utils/InputValidations.module.scss';

import styles from './LoginPage.module.scss';

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
  public spinner: HTMLElement = div({});
  private loginBtn: HTMLButtonElement = button({});

  constructor() {
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

  private handlePasswordDisplay(passwordInput: HTMLInputElement, showPassBtn: HTMLElement): void {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      showPassBtn.classList.add(validationStyles.hide);
    } else {
      passwordInput.type = 'password';
      showPassBtn.classList.remove(validationStyles.hide);
    }
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
    showPassBtn.addEventListener('click', () => this.handlePasswordDisplay(passwordInput, showPassBtn));
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

  public createPage(): HTMLElement {
    const windowsContainer = div({ className: styles.windowsContainer });
    windowsContainer.append(this.createLoginWindow(), this.createRegistrationWindow());
    this.pageWrapper.append(windowsContainer);

    return this.pageWrapper;
  }

  private createLoginWindow(): Element {
    const formContainer = div({ className: `${styles.loginContainer}` });
    const infoContainer = div({ className: `${styles.loginContainerInfo}` });
    const header = h2({ className: `${styles.infoHeader}`, txt: 'LOGIN' });
    const info = p({
      className: `${styles.infoDescription}`,
      txt: `Nice to see you! Please login via Email and Password.`,
    });
    const loginForm = form({ className: `${styles.loginContainerLoginForm}` });
    const submitContainer = div({
      className: `${styles.submitContainer}`,
    });
    this.loginBtn = button({
      type: 'submit',
      txt: 'Login',
      className: `${styles.submitBtn}`,
      disabled: false,
    });
    this.spinner = div(
      {
        className: `${styles.spinner}`,
      },
      div({ className: styles.bounce1 }),
      div({ className: styles.bounce2 }),
      div({ className: styles.bounce3 }),
    );
    // Activates spinner
    document.addEventListener('pendingStart', () => {
      this.spinner.classList.add(styles.activeSpinner);
    });
    document.addEventListener('pendingEnd', () => {
      this.spinner.classList.remove(styles.activeSpinner);
    });
    infoContainer.append(header, info);
    submitContainer.append(this.loginBtn);
    loginForm.append(this.createEmailInputField(), this.createPasswordInputField(), submitContainer, this.spinner);
    formContainer.append(infoContainer, loginForm);
    this.validate(this.emailInputElement, this.passwordInputElement, this.loginBtn);
    return formContainer;
  }

  public createRegistrationWindow(): Element {
    const formContainer = div({ className: `${styles.loginContainer}` });
    formContainer.classList.add(styles.signUp);
    const infoContainer = div({ className: `${styles.loginContainerInfo}` });
    const header = h2({ className: `${styles.infoHeader}`, txt: 'SIGN UP' });
    const info = p({
      className: `${styles.infoDescription}`,
      txt: `Don't have an account yet? Sign up now to get access to personal cart and profile!`,
    });

    const submitContainer = div({
      className: `${styles.submitContainer}`,
    });
    const signUpBtn = button({
      type: 'button',
      txt: 'Sign Up',
      className: `${styles.submitBtn}`,
      disabled: false,
    });
    signUpBtn.addEventListener('click', () => {
      Router.go('/registration');
    });

    infoContainer.append(header, info);
    submitContainer.append(signUpBtn);
    formContainer.append(infoContainer, submitContainer);
    return formContainer;
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
    });
    passwordInput.addEventListener('input', () => {
      passwordInput.value = passwordInput.value.trim();
      areInputsValid.password = validatePasswordClientSide(
        passwordInput,
        this.passwordValidationMsgs,
        this.passwordLabel,
      );
      validateForm(Object.values(areInputsValid), loginBtn);
    });
    this.loginBtn.addEventListener('click', async (e): Promise<void> => {
      e.preventDefault();

      const isValid = validateForm(Object.values(areInputsValid), loginBtn);

      if (isValid) {
        clientService.login(this.emailInputElement.value, this.passwordInputElement.value);
      } else if (!this.emailInputElement.value || !this.passwordInputElement.value) {
        showToastMessage('Fill all inputs.');
      } else {
        showToastMessage('Invalid credentials.');
      }
    });
  }

  public destroy(): void {
    this.pageWrapper.remove();
  }
}
