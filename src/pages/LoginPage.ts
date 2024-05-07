import { div, button, h2, p, form, input, label } from '@control.ts/min';

import styles from './LoginPage.module.scss';

type passwordValidationMessages = {
  lengthMsg: HTMLElement;
  uppercaseMsg: HTMLElement;
  digitMsg: HTMLElement;
  whitespaceMsg: HTMLElement;
};

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
      txt: `> Should be at least ${passwordInput.minLength} letters`,
    });
    const passwordUppercaseValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Use both uppercase and lowercase`,
    });
    const passwordDigitValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Should be at least 1 digit`,
    });
    const passwordWhitespaceValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> No whitespace allowed`,
    });

    const passwordValidationMsgs: passwordValidationMessages = {
      lengthMsg: passwordLengthValidationMessage,
      uppercaseMsg: passwordUppercaseValidationMessage,
      digitMsg: passwordDigitValidationMessage,
      whitespaceMsg: passwordWhitespaceValidationMessage,
    };

    const emailLabel = label({ className: `${styles.loginFormInputLabel}` });
    const passwordLabel = label({ className: `${styles.loginFormInputLabel}` });

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

    // Make sure that inputs have values. Otherwise disable login button. Check errors
    emailInput.addEventListener('input', () => {
      emailInput.value = emailInput.value.trim();
      this.validateEmail(emailInput, emailValidationMessage, emailLabel);
    });
    passwordInput.addEventListener('input', () => {
      this.validatePassword(passwordInput, passwordValidationMsgs, passwordLabel);
    });
    // passwordInput.element.addEventListener('input', () => {
    //   passwordInput.validateLength();
    //   validatePassword(passwordInput, passwordUppercaseMessage, passwordLabel);
    //   validateBoth(passwordInput, passwordLengthMessage, passwordEnglishMessage, passwordLabel);
    //   checkInputValues();
    // });

    // function validateEmail(input: HTMLInputElement, uppercaseOutput: HTMLElement, label: HTMLElement) {
    //   const errorStatus = {
    //     uppercase: false,
    //   };

    //   //Check for first letter to be in uppercase
    //   if (
    //     (input.value[0] && input.value[0] !== input.value[0].toUpperCase()) ||
    //     (input.value[0] && input.value[0] === '-')
    //   ) {
    //     errorStatus.uppercase = true;
    //     input.isUppercaseValid = false;
    //     uppercaseOutput.classList.add(`${styles.active}`);
    //   } else {
    //     errorStatus.uppercase = false;
    //     input.isUppercaseValid = true;
    //     uppercaseOutput.classList.remove(`${styles.active}`);
    //   }

    //   const hasErrors = errorStatus.uppercase;

    //   if (input.value && !hasErrors) {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.add(`${styles.accept}`);
    //   } else if (input.value && hasErrors) {
    //     label.classList.remove(`${styles.accept}`);
    //     label.classList.add(`${styles.warning}`);
    //   } else {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.remove(`${styles.accept}`);
    //   }
    // }

    // function validatePassword(
    //   input: InputElement,
    //   uppercaseOutput: HTMLElement,
    //   label: HTMLElement
    // ) {
    //   const errorStatus = {
    //     uppercase: false,
    //   };

    //   //Check for at least one letter to be in uppercase
    //   if (!/(?=.*[a-z])(?=.*[A-Z])/.test(input.value)) {
    //     errorStatus.uppercase = true;
    //     input.isUppercaseValid = false;
    //     uppercaseOutput.classList.add(`${styles.active}`);
    //   } else {
    //     errorStatus.uppercase = false;
    //     input.isUppercaseValid = true;
    //     uppercaseOutput.classList.remove(`${styles.active}`);
    //   }

    //   const hasErrors = errorStatus.uppercase;

    //   if (input.value && !hasErrors) {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.add(`${styles.accept}`);
    //   } else if (input.value && hasErrors) {
    //     label.classList.remove(`${styles.accept}`);
    //     label.classList.add(`${styles.warning}`);
    //   } else {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.remove(`${styles.accept}`);
    //   }
    // }
    // function validateBoth(
    //   input: InputElement,
    //   lengthOutput: HTMLElement,
    //   englishOutput: HTMLElement,
    //   label: HTMLElement
    // ) {
    //   const errorStatus = {
    //     length: false,
    //     english: false,
    //   };

    //   //Check for input length
    //   if (input.value && input.lengthError && input.value.length < input.minLength) {
    //     errorStatus.length = true;
    //     input.isLengthValid = false;
    //     lengthOutput.classList.add(`${styles.active}`);
    //   } else {
    //     errorStatus.length = false;
    //     input.isLengthValid = true;
    //     lengthOutput.classList.remove(`${styles.active}`);
    //   }

    //   //Check for english letters and '-'
    //   const checkRegexp = input.value.match(/[A-Za-z-]/g);
    //   if (input.value && checkRegexp?.join('') !== input.value) {
    //     errorStatus.english = true;
    //     input.isEnglishValid = false;
    //     englishOutput.classList.add(`${styles.active}`);
    //   } else {
    //     errorStatus.english = false;
    //     input.isEnglishValid = true;
    //     englishOutput.classList.remove(`${styles.active}`);
    //   }

    //   const hasErrors = errorStatus.length || errorStatus.english;

    //   if (input.value && !hasErrors) {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.add(`${styles.accept}`);
    //   } else if (input.value && hasErrors) {
    //     label.classList.remove(`${styles.accept}`);
    //     label.classList.add(`${styles.warning}`);
    //   } else {
    //     label.classList.remove(`${styles.warning}`);
    //     label.classList.remove(`${styles.accept}`);
    //   }
    // }

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

  private validateEmail(input: HTMLInputElement, inputErrorMsg: HTMLElement, inputLabel: HTMLElement) {
    const regExp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (input.value[0] && regExp.test(input.value)) {
      inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
      inputLabel.classList.remove(`${styles.inputWarning}`);
      inputLabel.classList.add(`${styles.inputAccept}`);
    } else if (input.value[0]) {
      inputErrorMsg.classList.add(`${styles.errorMsgActive}`);
      inputLabel.classList.add(`${styles.inputWarning}`);
      inputLabel.classList.remove(`${styles.inputAccept}`);
    } else {
      inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
      inputLabel.classList.remove(`${styles.inputWarning}`);
      inputLabel.classList.remove(`${styles.inputAccept}`);
    }

    //   const hasErrors = errorStatus.uppercase;

    //   if (input.value && !hasErrors) {
    //     inputLabel.classList.remove(`${styles.warning}`);
    //     inputLabel.classList.add(`${styles.accept}`);
    //   } else if (input.value && hasErrors) {
    //     inputLabel.classList.remove(`${styles.accept}`);
    //     inputLabel.classList.add(`${styles.warning}`);
    //   } else {
    //     inputLabel.classList.remove(`${styles.warning}`);
    //     inputLabel.classList.remove(`${styles.accept}`);
    //   }
  }

  private validatePassword(
    input: HTMLInputElement,
    inputErrorMsgs: passwordValidationMessages,
    inputLabel: HTMLElement,
  ) {
    const uppercaseRegExp = /(?=.*[a-z])(?=.*[A-Z])/;
    const digitRegExp = /\d/;
    const whitespaceRegExp = /\s/;

    // Check for correct length
    if (input.value.length < 8 && input.value[0]) {
      inputErrorMsgs.lengthMsg.classList.add(`${styles.errorMsgActive}`);
    } else if (input.value.length >= 8) {
      inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
    } else {
      inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
    }

    // Check for both uppercase and lowercase
    if (input.value[0] && uppercaseRegExp.test(input.value)) {
      inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
    } else if (input.value[0]) {
      inputErrorMsgs.uppercaseMsg.classList.add(`${styles.errorMsgActive}`);
    } else {
      inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
    }

    // Check for at least 1 digit
    if (input.value[0] && digitRegExp.test(input.value)) {
      inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
    } else if (input.value[0]) {
      inputErrorMsgs.digitMsg.classList.add(`${styles.errorMsgActive}`);
    } else {
      inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
    }

    // Check for whitespaces
    if (input.value[0] && whitespaceRegExp.test(input.value)) {
      inputErrorMsgs.whitespaceMsg.classList.add(`${styles.errorMsgActive}`);
    } else if (input.value[0]) {
      inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
    } else {
      inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
    }

    inputLabel.classList.remove(`${styles.inputWarning}`);
    inputLabel.classList.remove(`${styles.inputAccept}`);
  }
  public destroy() {
    this.pageWrapper.remove();
  }
}
