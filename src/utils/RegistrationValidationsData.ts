import { validationFunctions } from '@utils/RegistrationValidations';

type ValidationFunction = (input: string) => boolean;

export type ValidationTextType = {
  [key: string]: { nameMsg: string; text: string; func: ValidationFunction }[];
};

export function isRegistrationActive(validationMessages: { [key: string]: boolean }): boolean {
  return Object.values(validationMessages).every((status) => status === true);
}

export interface IRegistrationObject {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  addresses: BaseAddress[];
  defaultBillingAddress?: number | undefined;
  defaultShippingAddress?: number | undefined;
}

interface BaseAddress {
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

// add new  label + inputs like  [key: string]: { nameMsg: string; text: string; func: Function }[]; to create
export const validationText: ValidationTextType = {
  email: [
    { nameMsg: 'mail', text: `> Wrong email format (user@example.com)`, func: validationFunctions.validateEmail },
  ],
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
  firstName: [
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
  lastName: [
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
  dateOfBirth: [{ nameMsg: 'age', text: '> 13 years old or older', func: validationFunctions.howOldAreYou }],
  streetName: [
    {
      nameMsg: 'characterStreetName',
      text: 'Must contain at least one character',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  streetNumber: [
    {
      nameMsg: 'characterStreetNumber',
      text: 'Must contain at least one character',
      func: validationFunctions.validateAtLeastOneCharacter,
    },
  ],
  city: [
    {
      nameMsg: 'characterCity',
      text: 'Must contain at least one character',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  postalCode: [
    {
      nameMsg: 'formatPostalCode',
      text: `Must be in 'NNNNN' format`,
      func: validationFunctions.validateUSPostalCode,
    },
  ], // add code too discus
  country: [{ nameMsg: 'validCountry', text: 'Must be UA or DE', func: validationFunctions.isValidCountry }],
  streetNameBilling: [
    {
      nameMsg: 'characterStreetNameBilling',
      text: 'Must contain at least one character',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  streetNumberBilling: [
    {
      nameMsg: 'characterStreetNumberBilling',
      text: 'Must contain at least one character',
      func: validationFunctions.validateAtLeastOneCharacter,
    },
  ],
  cityBilling: [
    {
      nameMsg: 'characterCityBilling',
      text: 'Must contain at least one character',
      func: validationFunctions.validateNoSpecialCharactersOrNumbers,
    },
  ],
  postalCodeBilling: [
    {
      nameMsg: 'formatPostalCodeBilling',
      text: `Must be in 'NNNNN' format`,
      func: validationFunctions.validateUSPostalCode,
    },
  ], // add code too discus
  countryBilling: [
    {
      nameMsg: 'validCountryBilling',
      text: 'Must be UA or DE',
      func: validationFunctions.isValidCountry,
    },
  ],
};
