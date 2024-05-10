import type NavMain from '@components/NavMain';
import { createNavMain } from '@components/NavMain';

export class Layout {
  private navMain: NavMain;

  constructor() {
    this.navMain = createNavMain();
  }

  public getNavMain(): NavMain {
    return this.navMain;
  }
}

export const createLayout = (): Layout => {
  const layout = new Layout();
  return layout;
};
