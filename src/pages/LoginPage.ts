import { div, button, h2, p, form, input, label } from '@control.ts/min';

import styles from './LoginPage.module.scss';

import validationStyles from '@/utils/InputValidations.module.scss';

import {
  passwordValidationMessages,
  validatePasswordClientSide,
  validateEmailClientSide,
  validateForm,
} from '@/utils/InputValidations';

export class LoginPage {
  private pageWrapper: HTMLElement;
  private parent: HTMLElement;

  constructor() {
    this.parent = document.body;
    this.pageWrapper = div({ className: `${styles.loginPageWrapper}` });
  }
  public render() {
    const formContainer = div({ className: `${styles.loginContainer}` });

    const infoContainer = div({ className: `${styles.loginContainerInfo}` });

    const header = h2({ className: `${styles.infoHeader}`, txt: 'WELCOME' });

    const info = p({
      className: `${styles.infoDescription}`,
      txt: `Nice to see you! Please login via Email and Password.`,
    });

    const loginForm = form({ className: `${styles.loginContainerLoginForm}` });

    // loginForm.addEventListener('submit', (e) => {
    //   //Prevent page reload on submission
    //   e.preventDefault();
    //   // Implement submission...
    // });

    const emailContainer = div({ className: `${styles.inputContainer}` });
    const passwordContainer = div({ className: `${styles.inputContainer}` });

    const emailInput = input({
      placeholder: 'Email',
      className: `${styles.inputField}`,
      required: true,
    });

    const emailValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Wrong email format (user@example.com)`,
    });

    const passwordInput = input({
      type: 'password',
      placeholder: 'Password',
      className: `${styles.inputField}`,
      required: true,
      autocomplete: 'off',
      minLength: 8,
    });

    const passwordLengthValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
    });
    const passwordUppercaseValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
    });
    const passwordDigitValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
    });
    const passwordWhitespaceValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
    });

    const passwordValidationMsgs: passwordValidationMessages = {
      lengthMsg: passwordLengthValidationMessage,
      uppercaseMsg: passwordUppercaseValidationMessage,
      digitMsg: passwordDigitValidationMessage,
      whitespaceMsg: passwordWhitespaceValidationMessage,
    };

    const showPassBtn = div({ className: `${validationStyles.showPasswordBtn}` });

    showPassBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
      } else {
        passwordInput.type = 'password';
      }
    });

    const emailLabel = label({ className: `${styles.loginFormInputLabel}` });
    const passwordLabel = label({ className: `${styles.loginFormInputLabel}` }, showPassBtn);

    const submitContainer = div({
      className: `${styles.submitContainer}`,
    });

    const loginBtn = button({
      type: 'submit',
      txt: 'Login',
      className: `${styles.submitBtn}`,
      disabled: true,
    });

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

    // Make sure that input values valid. Otherwise disable login button. Check errors
    const areInputsValid = {
      email: false,
      password: false,
    };

    emailInput.addEventListener('input', () => {
      emailInput.value = emailInput.value.trim();
      areInputsValid.email = validateEmailClientSide(emailInput, emailValidationMessage, emailLabel);
      validateForm(Object.values(areInputsValid), loginBtn);
    });
    passwordInput.addEventListener('input', () => {
      areInputsValid.password = validatePasswordClientSide(passwordInput, passwordValidationMsgs, passwordLabel);
      validateForm(Object.values(areInputsValid), loginBtn);
    });

    infoContainer.append(header, info);

    submitContainer.append(loginBtn, signUpBtn);

    emailContainer.append(emailLabel, emailInput, emailValidationMessage);

    passwordContainer.append(
      passwordLabel,
      passwordInput,
      passwordLengthValidationMessage,
      passwordUppercaseValidationMessage,
      passwordDigitValidationMessage,
      passwordWhitespaceValidationMessage,
    );

    loginForm.append(emailContainer, passwordContainer, submitContainer, status);
    formContainer.append(infoContainer, loginForm);

    this.pageWrapper.append(formContainer);

    this.parent.append(this.pageWrapper);
  }

  // private checkInputValues() {
  //   const isNameValid =
  //     emailInput.isEnglishValid && emailInput.isLengthValid && emailInput.isUppercaseValid;
  //   const isPasswordValid =
  //     passwordInput.isEnglishValid &&
  //     passwordInput.isLengthValid &&
  //     passwordInput.isUppercaseValid;
  //   if (isNameValid && isPasswordValid && emailInput.value && passwordInput.value) {
  //     loginBtn.disabled = false;
  //   } else {
  //     loginBtn.disabled = true;
  //   }
  // }

  // private validateEmail(input: HTMLInputElement, inputErrorMsg: HTMLElement, inputLabel: HTMLElement) {
  //   const regExp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  //   if (input.value[0] && regExp.test(input.value)) {
  //     inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
  //     inputLabel.classList.remove(`${styles.inputWarning}`);
  //     inputLabel.classList.add(`${styles.inputAccept}`);
  //   } else if (input.value[0]) {
  //     inputErrorMsg.classList.add(`${styles.errorMsgActive}`);
  //     inputLabel.classList.add(`${styles.inputWarning}`);
  //     inputLabel.classList.remove(`${styles.inputAccept}`);
  //   } else {
  //     inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
  //     inputLabel.classList.remove(`${styles.inputWarning}`);
  //     inputLabel.classList.remove(`${styles.inputAccept}`);
  //   }

  //   //   const hasErrors = errorStatus.uppercase;

  //   //   if (input.value && !hasErrors) {
  //   //     inputLabel.classList.remove(`${styles.warning}`);
  //   //     inputLabel.classList.add(`${styles.accept}`);
  //   //   } else if (input.value && hasErrors) {
  //   //     inputLabel.classList.remove(`${styles.accept}`);
  //   //     inputLabel.classList.add(`${styles.warning}`);
  //   //   } else {
  //   //     inputLabel.classList.remove(`${styles.warning}`);
  //   //     inputLabel.classList.remove(`${styles.accept}`);
  //   //   }
  // }

  // private validatePassword(
  //   input: HTMLInputElement,
  //   inputErrorMsgs: passwordValidationMessages,
  //   inputLabel: HTMLElement,
  // ) {
  //   const uppercaseRegExp = /(?=.*[a-z])(?=.*[A-Z])/;
  //   const digitRegExp = /\d/;
  //   const whitespaceRegExp = /\s/;

  //   // Check for correct length
  //   if (input.value.length < 8 && input.value[0]) {
  //     inputErrorMsgs.lengthMsg.classList.add(`${styles.errorMsgActive}`);
  //   } else if (input.value.length >= 8) {
  //     inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
  //   } else {
  //     inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
  //   }

  //   // Check for both uppercase and lowercase
  //   if (input.value[0] && uppercaseRegExp.test(input.value)) {
  //     inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
  //   } else if (input.value[0]) {
  //     inputErrorMsgs.uppercaseMsg.classList.add(`${styles.errorMsgActive}`);
  //   } else {
  //     inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
  //   }

  //   // Check for at least 1 digit
  //   if (input.value[0] && digitRegExp.test(input.value)) {
  //     inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
  //   } else if (input.value[0]) {
  //     inputErrorMsgs.digitMsg.classList.add(`${styles.errorMsgActive}`);
  //   } else {
  //     inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
  //   }

  //   // Check for whitespaces
  //   if (input.value[0] && whitespaceRegExp.test(input.value)) {
  //     inputErrorMsgs.whitespaceMsg.classList.add(`${styles.errorMsgActive}`);
  //   } else if (input.value[0]) {
  //     inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
  //   } else {
  //     inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
  //   }

  //   inputLabel.classList.remove(`${styles.inputWarning}`);
  //   inputLabel.classList.remove(`${styles.inputAccept}`);
  // }
  public destroy() {
    this.pageWrapper.remove();
  }
}
