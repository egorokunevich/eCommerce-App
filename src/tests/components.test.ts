import { div } from '@control.ts/min';

import Header from '@components/Header';
import { HomePage } from '@pages/HomePage';
import { setAttributes } from '@utils/BaseComponentProps';

const header = new Header();
const homePage = new HomePage();

test('setAttributes should return HTMLElement', () => {
  expect(setAttributes(div({}), { text: 'text', type: 'type' })).toBeInstanceOf(HTMLElement);
});

test('getHeaderElement method in Header class should return HTMLElement', () => {
  expect(header.getHeaderElement()).toBeInstanceOf(HTMLElement);
});

test('createPage method in HomePage class should return HTMLElement', () => {
  expect(homePage.createPage()).toBeInstanceOf(HTMLElement);
});
