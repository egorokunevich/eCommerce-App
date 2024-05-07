import { div, button, h2, p, form, input } from '@control.ts/min';

import styles from './LoginPage.module.scss';


export class LoginPage {
  private pageWrapper: HTMLElement;
  private parent: HTMLElement;

  constructor() {
    this.parent = document.body;
    this.pageWrapper = div({className: `${styles.loginPageWrapper}`});
  }
  public render() {

    const formContainer = div({className: `${styles.loginContainer}`});



    const infoContainer = div({className: `${styles.loginContainerInfo}`});

    const header = h2({className: `${styles.infoHeader}`, txt: 'WELCOME'});

    const info = p({className: `${styles.infoDescription}`, txt: `Nice to see you! Please login via Email and Password.`});

    const loginForm = form({className: `${styles.loginContainerLoginForm}`});

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

    const emailValidationMessage =div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Email must be properly formatted (user@example.com)`,
    });

    const passwordInput = input({
      type: 'password',
      placeholder: 'Password',
      className: `${styles.inputField}`,
      required: true,
      autocomplete: 'off',
      minLength: 8
    });

    const passwordLengthValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Should be at least ${passwordInput.minLength} letters`,
    });
    const passwordUppercaseValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Use both uppercase and lowercase`,
    });
    const passwordEnglishValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Use only English letters and "-"`,
    });
    const passwordDigitValidationMessage = div({
      className: `${styles.loginFormErrorMsg}`,
      txt: `> Use only English letters and "-"`,
    });



    const emailLabel = div({ className: `${styles.inputLabel}` });
    const passwordLabel = div({ className: `${styles.inputLabel}` });

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



    //Make sure that inputs have values. Otherwise disable login button. Check errors
    // emailInput.addEventListener('input', () => {
    //   emailInput.validateEmail();
    //   validateName(emailInput, nameUppercaseMessage, nameLabel);
    //   validateBoth(emailInput, nameLengthMessage, nameEnglishMessage, nameLabel);
    //   checkInputValues();
    // });
    // passwordInput.element.addEventListener('input', () => {
    //   passwordInput.validateLength();
    //   validatePassword(passwordInput, passwordUppercaseMessage, passwordLabel);
    //   validateBoth(passwordInput, passwordLengthMessage, passwordEnglishMessage, passwordLabel);
    //   checkInputValues();
    // });

    // function checkInputValues() {
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

    emailContainer.append(
      emailLabel,
      emailInput,
      emailValidationMessage
    );

    passwordContainer.append(
      passwordLabel,
      passwordInput,
      passwordLengthValidationMessage,
      passwordUppercaseValidationMessage,
      passwordDigitValidationMessage,
      passwordEnglishValidationMessage,
    );

    loginForm.append(emailContainer, passwordContainer, submitContainer, status);
    formContainer.append(infoContainer, loginForm);

    this.pageWrapper.append(formContainer);

    this.parent.append(this.pageWrapper)
  }

  public destroy() {
    this.pageWrapper.remove();
  }
}