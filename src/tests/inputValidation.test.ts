import { div, input } from '@control.ts/min';
import { checkLength, checkWhitespaces } from '@utils/InputValidations';
import type { ErrorStatusesType, PasswordValidationMessages } from '@utils/InputValidations';
import { expect, test } from 'vitest';

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
