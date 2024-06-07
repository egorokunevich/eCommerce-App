import type { Category } from '@commercetools/platform-sdk';

export interface IBreadcrumbs {
  category?: Category;
  subcategory?: Category;
}

const Breadcrumbs: IBreadcrumbs = {};

export default Breadcrumbs;
