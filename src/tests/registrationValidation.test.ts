import { expect, test } from 'vitest';

import { validationFunctions } from '@utils/RegistrationValidations';
import { isRegistrationActive } from '@utils/RegistrationValidationsData';

test('Email validation should correctly check email input', () => {
  expect(validationFunctions.validateEmail('test@test.com')).toBe(true);
  expect(validationFunctions.validateEmail('aa@aa.io')).toBe(true);
  expect(validationFunctions.validateEmail('test@test...@test@aa.io')).toBe(false);
  expect(validationFunctions.validateEmail('test')).toBe(false);
  expect(validationFunctions.validateEmail(' q q ')).toBe(false);
  expect(validationFunctions.validateEmail('')).toBe(false);
  expect(validationFunctions.validateEmail(' ')).toBe(false);
});

test(`Length validation should correctly check input's length`, () => {
  expect(validationFunctions.validatePasswordLength('12345678')).toBe(true);
  expect(validationFunctions.validatePasswordLength('12345678900000')).toBe(true);
  expect(validationFunctions.validatePasswordLength('0')).toBe(false);
  expect(validationFunctions.validatePasswordLength(' q q ')).toBe(false);
  expect(validationFunctions.validatePasswordLength('')).toBe(false);
  expect(validationFunctions.validatePasswordLength('        ')).toBe(true);
});

test(`Should correctly check for both uppercase and lowercase presence`, () => {
  expect(validationFunctions.validateUppercaseLowercase('12345678')).toBe(false);
  expect(validationFunctions.validateUppercaseLowercase('aaaaaa')).toBe(false);
  expect(validationFunctions.validateUppercaseLowercase('BBBBBBB')).toBe(false);
  expect(validationFunctions.validateUppercaseLowercase('aaaaaaBBBBBB')).toBe(true);
  expect(validationFunctions.validateUppercaseLowercase('aB')).toBe(true);
  expect(validationFunctions.validateUppercaseLowercase('')).toBe(false);
  expect(validationFunctions.validateUppercaseLowercase(' ')).toBe(false);
});

test(`Should correctly check for digit presence`, () => {
  expect(validationFunctions.validateDigit('12345678')).toBe(true);
  expect(validationFunctions.validateDigit('0')).toBe(true);
  expect(validationFunctions.validateDigit('no digit here')).toBe(false);
  expect(validationFunctions.validateDigit('there is a digit 1')).toBe(true);
  expect(validationFunctions.validateDigit('')).toBe(false);
  expect(validationFunctions.validateDigit(' ')).toBe(false);
});

test(`Should correctly check for whitespace absence`, () => {
  expect(validationFunctions.validateNoWhitespace('12345678')).toBe(true);
  expect(validationFunctions.validateNoWhitespace('x')).toBe(true);
  expect(validationFunctions.validateNoWhitespace(' x ')).toBe(false);
  expect(validationFunctions.validateNoWhitespace('there are whitespaces here')).toBe(false);
  expect(validationFunctions.validateNoWhitespace('there-is_no#Whitespaces')).toBe(true);
  expect(validationFunctions.validateNoWhitespace('')).toBe(true);
  expect(validationFunctions.validateNoWhitespace(' ')).toBe(false);
});

test(`Should correctly check for at least one character presence`, () => {
  expect(validationFunctions.validateAtLeastOneCharacter('12345678')).toBe(false);
  expect(validationFunctions.validateAtLeastOneCharacter('x')).toBe(true);
  expect(validationFunctions.validateAtLeastOneCharacter('!')).toBe(false);
  expect(validationFunctions.validateAtLeastOneCharacter('')).toBe(false);
  expect(validationFunctions.validateAtLeastOneCharacter(' ')).toBe(false);
});

test(`Should correctly check for only english letters presence`, () => {
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('12345678')).toBe(false);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('x')).toBe(true);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers(' x ')).toBe(true);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('!')).toBe(false);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('hi-there')).toBe(false);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('number 1')).toBe(false);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers('')).toBe(false);
  expect(validationFunctions.validateNoSpecialCharactersOrNumbers(' ')).toBe(true);
});

test(`Should return true if user is older than 13 years old`, () => {
  expect(validationFunctions.howOldAreYou('2024-05-07')).toBe(false);
  expect(validationFunctions.howOldAreYou('1998-09-22')).toBe(true);
  expect(validationFunctions.howOldAreYou('2011-01-25')).toBe(true);
  expect(validationFunctions.howOldAreYou('2077-20-77')).toBe(false);
  expect(validationFunctions.howOldAreYou('!')).toBe(false);
  expect(validationFunctions.howOldAreYou('hi-there')).toBe(false);
  expect(validationFunctions.howOldAreYou('')).toBe(false);
  expect(validationFunctions.howOldAreYou(' ')).toBe(false);
});

test(`isRegistrationActive should correctly check if every status is valid`, () => {
  expect(isRegistrationActive({ '1': true, '2': true })).toBe(true);
  expect(isRegistrationActive({ '1': true, '2': false })).toBe(false);
  expect(isRegistrationActive({ '1': false, '2': true })).toBe(false);
  expect(isRegistrationActive({ '1': false, '2': false })).toBe(false);
});

test(`isValidCountry should correctly check if such country is allowed`, () => {
  expect(validationFunctions.isValidCountry('Belarus')).toBe(false);
  expect(validationFunctions.isValidCountry('USA')).toBe(true);
  expect(validationFunctions.isValidCountry('UK')).toBe(true);
  expect(validationFunctions.isValidCountry('Ukraine')).toBe(false);
});

test(`validateUSPostalCode should correctly check postal code`, () => {
  expect(validationFunctions.validateUSPostalCode('12345-1234')).toBe(true);
  expect(validationFunctions.validateUSPostalCode('12345')).toBe(true);
  expect(validationFunctions.validateUSPostalCode('AB 00-12')).toBe(false);
  expect(validationFunctions.validateUSPostalCode('1234')).toBe(false);
});
