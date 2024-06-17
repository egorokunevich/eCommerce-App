import type { DiscountCode } from '@commercetools/platform-sdk';
import { describe, expect, it } from 'vitest';

import { PromoCode } from '../components/Promo-slider/Promo-code';

const promoCode = new PromoCode();
const mockDiscountCodes: DiscountCode[] = [
  {
    code: 'TESTCODE',
    description: { en: 'Test Description' },
    id: '1',
    version: 1,
    createdAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString(),
    cartDiscounts: [],
    isActive: true,
    maxApplications: 1,
    maxApplicationsPerCustomer: 1,
    groups: [],
    applicationVersion: 1,
    references: [],
  },
];

describe('PromoCode', () => {
  it('creates a swiper element with correct classes', () => {
    const swiperElement = promoCode.createSwiper(mockDiscountCodes);

    expect(swiperElement.classList).toContain('swiperPromoCode');
    expect(swiperElement.querySelector('.swiper-wrapper')).not.toBeNull();
    expect(swiperElement.querySelector('.swiper-pagination')).not.toBeNull();
    expect(swiperElement.querySelector('.swiper-button-prev')).not.toBeNull();
    expect(swiperElement.querySelector('.swiper-button-next')).not.toBeNull();
  });
});

describe('PromoCode', () => {
  it('creates a swiper node with article class', async () => {
    const swiperNode = await promoCode.createSwiperNode();
    expect(swiperNode).toBeInstanceOf(HTMLElement);
    expect(swiperNode.classList).toContain('promoArticle');
  });
});
