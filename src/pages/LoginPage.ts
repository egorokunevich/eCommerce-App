import { button, div, form, h2, input, label, main, p } from '@control.ts/min';

import type { PasswordValidationMessages } from '@/utils/InputValidations';
import { validateEmailClientSide, validateForm, validatePasswordClientSide } from '@/utils/InputValidations';
import validationStyles from '@/utils/InputValidations.module.scss';

import styles from './LoginPage.module.scss';

export class LoginPage {
  private pageWrapper: HTMLElement;
  private parent: HTMLElement = document.body;
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
  private loginBtn: HTMLButtonElement = button({});
  constructor() {
    this.pageWrapper = main({ className: `${styles.loginPageWrapper}` });
  }

  private createEmailInputField(): HTMLElement {
    const emailContainer = div({ className: `${styles.inputContainer}` });

    const emailInput = input({
      placeholder: 'Email',
      className: `${styles.inputField}`,
      required: true,
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

  public render(): void {
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
    const status = div({
      txt: '',
      className: `${styles.loginStatus}`,
    });
    infoContainer.append(header, info);
    submitContainer.append(loginBtn, signUpBtn);
    loginForm.append(this.createEmailInputField(), this.createPasswordInputField(), submitContainer, status);
    formContainer.append(infoContainer, loginForm);
    this.pageWrapper.append(formContainer);
    this.parent.append(this.pageWrapper);
    this.validate(this.emailInputElement, this.passwordInputElement, loginBtn);
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
      areInputsValid.password = validatePasswordClientSide(
        passwordInput,
        this.passwordValidationMsgs,
        this.passwordLabel,
      );
      validateForm(Object.values(areInputsValid), loginBtn);
    });
    this.loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }

  public destroy(): void {
    this.pageWrapper.remove();
  }
}
