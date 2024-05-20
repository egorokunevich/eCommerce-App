// add a new validations function for new fields
export const validationFunctions = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  validatePasswordLength: (password: string): boolean => {
    return password.length >= 8;
  },
  validateUppercaseLowercase: (password: string): boolean => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    return hasUppercase && hasLowercase;
  },
  validateDigit: (password: string): boolean => {
    return /\d/.test(password);
  },
  validateNoWhitespace: (password: string): boolean => {
    return !/\s/.test(password);
  },
  validateAtLeastOneCharacter: (input: string): boolean => {
    return input.trim().length > 0;
    // return input.length > 0 && /^[a-zA-Z]+/.test(input);
  },
  validateNoSpecialCharactersOrNumbers: (input: string): boolean => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(input);
  },
  howOldAreYou: (years: string): boolean => {
    const dateBirthday = new Date(years).getTime();
    const dateNow = new Date().getTime();
    return Math.floor((dateNow - dateBirthday) / 1000 / 60 / 60 / 24 / 365) >= 13;
  },
  validateUSPostalCode: (input: string): boolean => {
    // Регулярное выражение для проверки корректного почтового кода США
    const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return regex.test(input);
  },
  isValidCountry: (country: string): boolean => {
    // write our country
    const validCountries = ['USA', 'Canada', 'UK', 'Germany', 'France'];
    return validCountries.includes(country);
  },
};
