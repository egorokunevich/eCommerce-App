import type { Category, ProductProjection } from '@commercetools/platform-sdk';
import { div, li, ul } from '@control.ts/min';

import styles from '@pages/CatalogPage/CatalogPage.module.scss';
import clientService from '@services/ClientService';
import productsService from '@services/ProductsService';

import Breadcrumbs from './Breadcrumbs';

export default class CategoryItem {
  constructor(
    private readonly category: Category,
    private readonly breadcrumbsContainer: HTMLElement,
    private readonly onClick: (productsArray?: ProductProjection[]) => void,
  ) {}

  public async create(mainList: HTMLElement): Promise<HTMLElement> {
    const listItem = li({ className: styles.listItem, txt: this.category.name[`en-US`] });

    listItem.addEventListener('click', async (event) => {
      event.stopPropagation();
      productsService.getCategoryQuery(this.category);
      const products = await productsService.getFilteredAndSortedProducts();
      this.onClick(products);
      const currentCategory = productsService.getCurrentCategory();
      const baseCrumb = this.initializeBreadcrumbs();
      let category = div({ className: styles.crumb });
      let subcategory = div({ className: styles.crumb });
      if (this.category.ancestors.length === 0) {
        Breadcrumbs.category = currentCategory;
        delete Breadcrumbs.subcategory;
        category = div({ className: styles.crumb, txt: Breadcrumbs.category.name['en-US'].toUpperCase() });
        this.breadcrumbsContainer.append(category);
      } else {
        Breadcrumbs.subcategory = currentCategory;
        Breadcrumbs.category = await productsService.getCategoryById(this.category.ancestors[0].id);
        subcategory = div({ className: styles.crumb, txt: Breadcrumbs.subcategory.name['en-US'].toUpperCase() });
        category = div({ className: styles.crumb, txt: Breadcrumbs.category.name['en-US'].toUpperCase() });
        this.breadcrumbsContainer.append(category, subcategory);
      }
      this.createListeners(baseCrumb, category, subcategory);
    });
    const subtrees = await this.getSubtrees();
    mainList.append(listItem);
    if (subtrees.length > 0) {
      const childrenList = ul({ className: styles.listItemParent });
      listItem.append(childrenList);
      subtrees.forEach(async (item) => {
        const category = new CategoryItem(item, this.breadcrumbsContainer, this.onClick);
        await category.create(childrenList);
      });
    } else {
      listItem.classList.add(styles.sub);
    }
    return listItem;
  }

  private initializeBreadcrumbs(): HTMLElement {
    this.breadcrumbsContainer.innerHTML = '';
    const baseCrumb = div({ className: styles.crumb, txt: 'All products'.toUpperCase() });
    this.breadcrumbsContainer.append(baseCrumb);

    return baseCrumb;
  }

  private createListeners(baseCrumb: HTMLElement, category: HTMLElement, subcategory: HTMLElement): void {
    baseCrumb.addEventListener('click', async (e) => {
      e.stopPropagation();
      productsService.clearCategoryQuery();
      const newProducts = await productsService.getFilteredAndSortedProducts();
      this.onClick(newProducts);

      delete Breadcrumbs.category;
      delete Breadcrumbs.subcategory;
      baseCrumb.nextSibling?.nextSibling?.remove();
      baseCrumb.nextSibling?.remove();
    });

    category.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (Breadcrumbs.category) {
        productsService.getCategoryQuery(Breadcrumbs.category);
      }
      const newProducts = await productsService.getFilteredAndSortedProducts();
      this.onClick(newProducts);

      delete Breadcrumbs.subcategory;
      category.nextSibling?.remove();
    });

    subcategory.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (Breadcrumbs.subcategory) {
        productsService.getCategoryQuery(Breadcrumbs.subcategory);
      }
      const newProducts = await productsService.getFilteredAndSortedProducts();
      this.onClick(newProducts);
    });
  }

  public async getSubtrees(): Promise<Category[]> {
    const subtrees = await clientService.apiRoot
      .categories()
      .get({
        queryArgs: {
          where: `parent(id="${this.category.id}")`,
        },
      })
      .execute();
    return subtrees.body.results;
  }
}
