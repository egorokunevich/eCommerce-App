import type { Category, ProductProjection } from '@commercetools/platform-sdk';
import { li, ul } from '@control.ts/min';

import styles from '@pages/CatalogPage/CatalogPage.module.scss';
import clientService from '@services/ClientService';
import productsService from '@services/ProductsService';

export default class CategoryItem {
  constructor(
    private readonly category: Category,
    private readonly onClick: (productsArray?: ProductProjection[]) => void,
  ) {}

  public async create(mainList: HTMLElement): Promise<HTMLElement> {
    const listItem = li({ className: styles.listItem, txt: this.category.name[`en-US`] });

    listItem.addEventListener('click', async (e) => {
      e.stopPropagation();
      productsService.getCategoryQuery(this.category.id);
      const products = await productsService.getFilteredAndSortedProducts();
      this.onClick(products);
    });

    const subtrees = await this.getSubtrees();
    mainList.append(listItem);

    if (subtrees.length > 0) {
      const childrenList = ul({ className: styles.listItemParent });
      listItem.append(childrenList);
      subtrees.forEach(async (item) => {
        const category = new CategoryItem(item, this.onClick);
        await category.create(childrenList);
      });
    } else {
      listItem.classList.add(styles.sub);
    }

    return listItem;
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
