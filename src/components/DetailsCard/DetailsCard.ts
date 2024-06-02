import type { ProductProjection } from '@commercetools/platform-sdk';
import { div, p } from '@control.ts/min';

import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductCard } from '@components/ProductCard/ProductCard';
import styles from '@components/ProductCard/ProductCard.module.scss';

export class ProductDetails extends ProductCard {
  public async createDetails(product: ProductProjection): Promise<HTMLDivElement> {
    const card = await super.createCard(product);
    card.classList.add(styles.details);

    const sliderContainer = this.createSlider(product);
    card.appendChild(sliderContainer);

    const attributesContainer = this.createAttributesContainer(product);
    card.append(attributesContainer);

    return card;
  }

  private createSlider(product: ProductProjection): HTMLDivElement {
    const sliderContainer = div({ className: 'swiper' });
    sliderContainer.classList.add('swiper-style');
    const sliderWrapper = div({ className: 'swiper-wrapper' });
    sliderWrapper.classList.add('swiper-wrapper-style');
    const btnNext = div({ className: 'swiper-button-next' });
    btnNext.classList.add('btn-next-style');
    const btnPrev = div({ className: 'swiper-button-prev' });
    btnPrev.classList.add('btn-prev-style');
    const pagination = div({ className: 'swiper-pagination' });
    pagination.classList.add('pagination-style');

    const images = product.variants.map((variant) => variant.images).flat();
    images.forEach((image) => {
      const slide = div({ className: 'swiper-slide' });
      const img = document.createElement('img');
      if (img && image) {
        img.src = image.url;
        slide.appendChild(img);
      }
      sliderWrapper.appendChild(slide);
    });

    sliderContainer.appendChild(sliderWrapper);
    sliderContainer.appendChild(btnNext);
    sliderContainer.appendChild(btnPrev);
    sliderContainer.appendChild(pagination);

    return sliderContainer;
  }

  private createAttributesContainer(product: ProductProjection): HTMLDivElement {
    const attributesContainer = div({ className: styles.attributesContainer });
    const { attributes } = product.masterVariant;
    if (attributes && attributes.length > 0) {
      for (let i = 0; i < attributes.length; i++) {
        let attributeField;
        if (attributes[i].name === 'full_description') {
          attributeField = p({
            className: styles.attributes,
            txt: `${this.getAttributeValue(product, i + 1)}`,
          });
          attributesContainer.insertBefore(attributeField, attributesContainer.firstChild);
        } else {
          attributeField = p({
            className: styles.attributes,
            txt: `${this.getAttributeName(product, i + 1)}: ${this.getAttributeValue(product, i + 1)}`,
          });
          attributesContainer.append(attributeField);
        }
      }
    }
    return attributesContainer;
  }

  private getAttributeValue(product: ProductProjection, index: number): string {
    const customFields = product.masterVariant.attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.value.toString();
    }
    return 'No attributes';
  }

  private getAttributeName(product: ProductProjection, index: number): string {
    const customFields = product.masterVariant.attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.name.toString();
    }
    return 'No attributes';
  }
}

const productDetails = new ProductDetails();
export default productDetails;
