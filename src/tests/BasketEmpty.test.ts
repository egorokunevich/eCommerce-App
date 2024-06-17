import { describe, it, expect, beforeEach } from 'vitest';
import { BasketEmpty } from '@components/BasketEmpty/BasketEmpty';

describe('BasketEmpty', () => {
  let basketEmpty: BasketEmpty;

  beforeEach(() => {
    basketEmpty = new BasketEmpty();
  });

  it('should create the basket empty container', () => {
    const container = basketEmpty.createBasketEmpty();
    expect(container).toBeInstanceOf(HTMLDivElement);
  });
});