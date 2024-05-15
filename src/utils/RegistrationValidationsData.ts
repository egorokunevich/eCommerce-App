import { validationFunctions } from '@/utils/RegistrationValidations';

type ValidationFunction = (input: string) => boolean;

export type ValidationTextType = {
  [key: string]: { nameMsg: string; text: string; func: ValidationFunction }[];
};

export function isRegistrationActive(validationMessages: { [key: string]: boolean }): boolean {
  return Object.values(validationMessages).every((status) => status === true);
}

// add new  label + inputs like  [key: string]: { nameMsg: string; text: string; func: Function }[]; to create
export const validationText: ValidationTextType = {
  mail: [{ nameMsg: 'mail', text: `> Wrong email format (user@example.com)`, func: validationFunctions.validateEmail }],
  password: [
    {
      nameMsg: 'countLetters',
      text: `> Should be at least 8 letters`,
      func: validationFunctions.validatePasswordLength,
    },
    {
      nameMsg: 'letterCase',
      text: `> Use english uppercase and lowercase`,
      func: validationFunctions.validateUppercaseLowercase,
    },
    { nameMsg: 'digit', text: `> Should contain at least 1 digit`, func: validationFunctions.validateDigit },
    { nameMsg: 'whitespace', text: `> No whitespace allowed`, func: validationFunctions.validateNoWhitespace },
  ],
  name: [
    {
      nameMsg: 'characterName',
      text: '> Must contain at least one character ',
      func: validationFunctions.validateAtLeastOneCharacter,
    },
    {
      nameMsg: 'noSpecialName',
      text: '> No special characters or numbers',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  birth: [{ nameMsg: 'age', text: '> 13 years old or older', func: validationFunctions.howOldAreYou }],
  street: [
    {
      nameMsg: 'characterStreet',
      text: 'Must contain at least one character',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  code: [
    {
      nameMsg: 'formatCode',
      text: 'Must follow the format for the country',
      func: validationFunctions.validateUSPostalCode,
    },
  ], // add code too discus
  country: [
    { nameMsg: 'validCountry', text: 'Must be a valid country from list', func: validationFunctions.isValidCountry },
  ],
};
