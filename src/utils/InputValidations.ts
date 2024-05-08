import styles from '@/utils/InputValidations.module.scss';

export type passwordValidationMessages = {
  lengthMsg: HTMLElement;
  uppercaseMsg: HTMLElement;
  digitMsg: HTMLElement;
  whitespaceMsg: HTMLElement;
};

export function validatePasswordClientSide(
  passwordInput: HTMLInputElement,
  inputErrorMsgs: passwordValidationMessages,
  inputLabel: HTMLElement,
): boolean {
  const uppercaseRegExp = /(?=.*[a-z])(?=.*[A-Z])/;
  const digitRegExp = /\d/;
  const whitespaceRegExp = /\s/;

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

  // Check for correct length
  if (passwordInput.value.length < 8 && passwordInput.value[0]) {
    inputErrorMsgs.lengthMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.lengthError = true;
  } else if (passwordInput.value.length >= 8) {
    inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.lengthError = false;
  } else {
    inputErrorMsgs.lengthMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.lengthError = false;
  }

  // Check for both uppercase and lowercase
  if (passwordInput.value[0] && uppercaseRegExp.test(passwordInput.value)) {
    inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.uppercaseError = false;
  } else if (passwordInput.value[0]) {
    inputErrorMsgs.uppercaseMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.uppercaseError = true;
  } else {
    inputErrorMsgs.uppercaseMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.uppercaseError = false;
  }

  // Check for at least 1 digit
  if (passwordInput.value[0] && digitRegExp.test(passwordInput.value)) {
    inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.digitError = false;
  } else if (passwordInput.value[0]) {
    inputErrorMsgs.digitMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.digitError = true;
  } else {
    inputErrorMsgs.digitMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.digitError = false;
  }

  // Check for whiteSpaces
  if (passwordInput.value[0] && whitespaceRegExp.test(passwordInput.value)) {
    inputErrorMsgs.whitespaceMsg.classList.add(`${styles.errorMsgActive}`);
    errorStatuses.whitespaceError = true;
  } else if (passwordInput.value[0]) {
    inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.whitespaceError = false;
  } else {
    inputErrorMsgs.whitespaceMsg.classList.remove(`${styles.errorMsgActive}`);
    errorStatuses.whitespaceError = false;
  }

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
  } else if (emailInput.value[0]) {
    inputErrorMsg.classList.add(`${styles.errorMsgActive}`);
    inputLabel.classList.add(`${styles.inputWarningIcon}`);
    inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
    return false;
  } else {
    inputErrorMsg.classList.remove(`${styles.errorMsgActive}`);
    inputLabel.classList.remove(`${styles.inputWarningIcon}`);
    inputLabel.classList.remove(`${styles.inputAcceptIcon}`);
    return false;
  }
}

export function validateForm(statuses: boolean[], button: HTMLButtonElement) {
  const isValid = statuses.every((status) => status === true);
  if (isValid) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}
