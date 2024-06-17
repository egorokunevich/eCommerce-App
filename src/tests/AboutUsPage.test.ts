import { beforeEach, describe, expect, it } from 'vitest';

import { AboutUsPage } from '@pages/AboutUsPage/AboutUsPage';

describe('AboutUsPage', () => {
  let aboutUsPage: AboutUsPage;

  beforeEach(() => {
    aboutUsPage = new AboutUsPage();
  });

  it('should create the page wrapper', () => {
    const pageElement = aboutUsPage.createPage();
    expect(pageElement).toBeInstanceOf(HTMLElement);
  });

  it('should create and append the links section', () => {
    aboutUsPage.createPage();

    const links = aboutUsPage.pageWrapper.querySelector('a');
    expect(links).toBeInstanceOf(HTMLAnchorElement);
  });
});
