import { expect, test } from 'vitest';

import { isNotNullable, isNullable } from '@utils/isNull';

test('isNullable should correctly identify null and undefined values', () => {
  expect(isNullable(null)).toBe(true);
  expect(isNullable(undefined)).toBe(true);
  expect(isNullable(0)).toBe(false);
  expect(isNullable('')).toBe(false);
});

test('isNotNullable should correctly identify non-null and non-undefined values', () => {
  expect(isNotNullable(0)).toBe(true);
  expect(isNotNullable('')).toBe(true);
  expect(isNotNullable(null)).toBe(false);
  expect(isNotNullable(undefined)).toBe(false);
});
