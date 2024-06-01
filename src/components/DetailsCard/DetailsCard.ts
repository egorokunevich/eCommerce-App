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
    const sliderContainer = div({ className: styles.swiper });
    const sliderWrapper = div({ className: styles.swiperWrapper });
    const btnNext = div({ className: styles.swiperButtonNext });
    const btnPrev = div({ className: styles.swiperButtonPrev });
    const pagination = div({ className: styles.swiperPagination });

    const images = product.variants.map((variant) => variant.images).flat();
    images.forEach((image) => {
      const slide = div({ className: styles.swiperSlide });
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

    for (let i = 1; i <= 7; i++) {
      let attributeField;
      if (i === 1) {
        attributeField = p({
          className: styles.attributes,
          txt: `${this.getAttributeValue(product, i)}`,
        });
      } else {
        attributeField = p({
          className: styles.attributes,
          txt: `${this.getAttributeName(product, i)}: ${this.getAttributeValue(product, i)}`,
        });
      }
      attributesContainer.append(attributeField);
    }
    return attributesContainer;
  }

  private getAttributeValue(product: ProductProjection, index: number): string {
    const customFields = product.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.value.toString();
    }
    return 'No attributes';
  }

  private getAttributeName(product: ProductProjection, index: number): string {
    const customFields = product.variants[0].attributes;
    if (customFields && customFields.length >= index) {
      const attribute = customFields[index - 1];
      return attribute.name.toString();
    }
    return 'No attributes';
  }
}

const productDetails = new ProductDetails();
export default productDetails;
