import styles from '@utils/InputValidations.module.scss';

export type PasswordValidationMessages = {
  lengthMsg: HTMLElement;
  uppercaseMsg: HTMLElement;
  digitMsg: HTMLElement;
  whitespaceMsg: HTMLElement;
};

export type ErrorStatusesType = {
  lengthError: boolean;
  uppercaseError: boolean;
  digitError: boolean;
  whitespaceError: boolean;
};

export function checkLength(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: PasswordValidationMessages,
  errorStatuses: ErrorStatusesType,
): boolean {
  // Check for correct length

  if (passwordInput.value.length < 8 && passwordInput.value[0]) {
    inputErrorMsgs.lengthMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.lengthError = true;
    return false;
  }
  if (passwordInput.value.length >= 8) {
    inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.lengthError = false;
    return true;
  }
  inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
  errorStatuses.lengthError = false;
  return false;
}
export function checkWhitespaces(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: PasswordValidationMessages,
  errorStatuses: ErrorStatusesType,
): boolean {
  // Check for whiteSpaces
  const whitespaceRegExp = /\s/;

  if (passwordInput.value[0] && whitespaceRegExp.test(passwordInput.value)) {
    inputErrorMsgs.whitespaceMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.whitespaceError = true;
    return false;
  }
  if (passwordInput.value[0]) {
    inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.whitespaceError = false;
    return true;
  }
  inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
  errorStatuses.whitespaceError = false;
  return true;
}
export function checkDigits(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: PasswordValidationMessages,
  errorStatuses: ErrorStatusesType,
): boolean {
  const digitRegExp = /\d/;

  // Check for at least 1 digit
  if (passwordInput.value[0] && digitRegExp.test(passwordInput.value)) {
    inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.digitError = false;
    return true;
  }
  if (passwordInput.value[0]) {
    inputErrorMsgs.digitMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.digitError = true;
    return false;
  }
  inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
  errorStatuses.digitError = false;
  return false;
}
export function checkUppercase(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: PasswordValidationMessages,
  errorStatuses: ErrorStatusesType,
): boolean {
  const uppercaseRegExp = /(?=.*[a-z])(?=.*[A-Z])/;

  // Check for english uppercase and lowercase
  if (passwordInput.value[0] && uppercaseRegExp.test(passwordInput.value)) {
    inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.uppercaseError = false;
    return true;
  }
  if (passwordInput.value[0]) {
    inputErrorMsgs.uppercaseMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.uppercaseError = true;
    return false;
  }
  inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
  errorStatuses.uppercaseError = false;
  return false;
}

export function validatePasswordClientSide(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: PasswordValidationMessages,
  inputLabel: HTMLElement,
): boolean {
  const errorStatuses = {
    lengthError: false,
    uppercaseError: false,
    digitError: false,
    whitespaceError: false,
  };

  inputErrorMsgs.lengthMsg.innerText = `> Should be at least ${passwordInput.minLength} letters`;
  inputErrorMsgs.uppercaseMsg.innerText = `> Use english uppercase and lowercase`;
  inputErrorMsgs.digitMsg.innerText = `> Should be at least 1 digit`;
  inputErrorMsgs.whitespaceMsg.innerText = `> No whitespace allowed`;

  checkLength(passwordInput, inputErrorMsgs, errorStatuses);
  checkUppercase(passwordInput, inputErrorMsgs, errorStatuses);
  checkDigits(passwordInput, inputErrorMsgs, errorStatuses);
  checkWhitespaces(passwordInput, inputErrorMsgs, errorStatuses);

  const isValid = Object.values(errorStatuses).every((status) => status === false);

  if (isValid) {
    inputLabel.classList.remove(`${styles.inputWarningIcon}`);
    inputLabel.classList.add(`${styles.inputAcceptIcon}`);
  } else {
    inputLabel.classList.add(`${styles.inputWarningIcon}`);
    inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
  }

  if (passwordInput.value.length < 1) {
    inputLabel.classList.remove(`${styles.inputWarningIcon}`);
    inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
    return false;
  }

  return isValid;
}

export function validateEmailClientSide(
  emailInput: HTMLInputElement,
  inputErrorMsg: HTMLElement,
  inputLabel: HTMLElement,
): boolean {
  const regExp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (emailInput.value[0] && regExp.test(emailInput.value)) {
    inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
    inputLabel.classList.remove(`${styles.inputWarningIcon}`);
    inputLabel.classList.add(`${styles.inputAcceptIcon}`);
    return true;
  }
  if (emailInput.value[0]) {
    inputErrorMsg.classList.add(`${styles.errorMsgActive}`);
    inputLabel.classList.add(`${styles.inputWarningIcon}`);
    inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
    return false;
  }
  inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
  inputLabel.classList.remove(`${styles.inputWarningIcon}`);
  inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
  return false;
}

export function validateForm(statuses: boolean[], button: HTMLButtonElement): boolean {
  const isValid = statuses.every((status) => status === true);
  if (isValid) {
    button.disabled = false;
  } else {
    button.disabled = false; // Set this to 'true' to disable login Btn on invalid inputs
  }
  return isValid;
}
