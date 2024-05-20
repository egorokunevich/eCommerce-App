import { button, div, input } from '@control.ts/min';
import { expect, test } from 'vitest';

import {
  checkDigits,
  checkLength,
  checkUppercase,
  checkWhitespaces,
  validateEmailClientSide,
  validateForm,
  validatePasswordClientSide,
} from '@utils/InputValidations';
import type { ErrorStatusesType, PasswordValidationMessages } from '@utils/InputValidations';

const statuses: ErrorStatusesType = {
  lengthError: false,
  uppercaseError: false,
  digitError: false,
  whitespaceError: false,
};

const msgs: PasswordValidationMessages = {
  lengthMsg: div({}),
  uppercaseMsg: div({}),
  digitMsg: div({}),
  whitespaceMsg: div({}),
};

test('checkLength should correctly check that input length >= 8', () => {
  expect(checkLength(input({ value: '1234567890' }), msgs, statuses)).toBe(true);
  expect(checkLength(input({ value: '1234' }), msgs, statuses)).toBe(false);
  expect(checkLength(input({ value: '' }), msgs, statuses)).toBe(false);
  expect(checkLength(input({}), msgs, statuses)).toBe(false);
});

test('checkWhitespaces should correctly check for no whitespaces', () => {
  expect(checkWhitespaces(input({ value: '1234567890' }), msgs, statuses)).toBe(true);
  expect(checkWhitespaces(input({ value: '1234' }), msgs, statuses)).toBe(true);
  expect(checkWhitespaces(input({ value: '1 1' }), msgs, statuses)).toBe(false);
  expect(checkWhitespaces(input({ value: '' }), msgs, statuses)).toBe(true);
});

test('checkDigits should correctly check for digit presence', () => {
  expect(checkDigits(input({ value: '1234567890' }), msgs, statuses)).toBe(true);
  expect(checkDigits(input({ value: '1 digit' }), msgs, statuses)).toBe(true);
  expect(checkDigits(input({ value: 'no digits' }), msgs, statuses)).toBe(false);
  expect(checkDigits(input({ value: '' }), msgs, statuses)).toBe(false);
  expect(checkDigits(input({ value: ' ' }), msgs, statuses)).toBe(false);
});

test('checkUppercase should correctly check for both uppercase and lowercase presence', () => {
  expect(checkUppercase(input({ value: '1234567890' }), msgs, statuses)).toBe(false);
  expect(checkUppercase(input({ value: 'aaaaaa' }), msgs, statuses)).toBe(false);
  expect(checkUppercase(input({ value: 'BBBBBBB' }), msgs, statuses)).toBe(false);
  expect(checkUppercase(input({ value: 'aaaaaaBBBBBB' }), msgs, statuses)).toBe(true);
  expect(checkUppercase(input({ value: 'aB' }), msgs, statuses)).toBe(true);
  expect(checkUppercase(input({ value: '' }), msgs, statuses)).toBe(false);
  expect(checkUppercase(input({ value: ' ' }), msgs, statuses)).toBe(false);
});

test('validateForm should correctly check if every status is valid', () => {
  expect(validateForm([true, true], button({}))).toBe(true);
  expect(validateForm([true, false], button({}))).toBe(false);
  expect(validateForm([false, true], button({}))).toBe(false);
  expect(validateForm([false, false], button({}))).toBe(false);
});

test('validateEmailClientSide checks for email formatting', () => {
  expect(validateEmailClientSide(input({ value: 'test@test.com' }), div({}), div({}))).toBe(true);
  expect(validateEmailClientSide(input({ value: 'aa@aa.io' }), div({}), div({}))).toBe(true);
  expect(validateEmailClientSide(input({ value: 'test@test...@test@aa.io' }), div({}), div({}))).toBe(false);
  expect(validateEmailClientSide(input({ value: 'test' }), div({}), div({}))).toBe(false);
  expect(validateEmailClientSide(input({ value: ' q q ' }), div({}), div({}))).toBe(false);
  expect(validateEmailClientSide(input({ value: '' }), div({}), div({}))).toBe(false);
  expect(validateEmailClientSide(input({ value: ' ' }), div({}), div({}))).toBe(false);
});

test('validatePasswordClientSide checks for password formatting', () => {
  expect(validatePasswordClientSide(input({ value: 'aA123456' }), msgs, div({}))).toBe(true);
  expect(validatePasswordClientSide(input({ value: '123AAA456aa' }), msgs, div({}))).toBe(true);
  expect(validatePasswordClientSide(input({ value: 'Aa123' }), msgs, div({}))).toBe(false);
  expect(validatePasswordClientSide(input({ value: 'test13qqqqq' }), msgs, div({}))).toBe(false);
  expect(validatePasswordClientSide(input({ value: 'test whitespace' }), msgs, div({}))).toBe(false);
  expect(validatePasswordClientSide(input({ value: ' q Q ' }), msgs, div({}))).toBe(false);
  expect(validatePasswordClientSide(input({ value: '' }), msgs, div({}))).toBe(false);
  expect(validatePasswordClientSide(input({ value: ' ' }), msgs, div({}))).toBe(false);
});
