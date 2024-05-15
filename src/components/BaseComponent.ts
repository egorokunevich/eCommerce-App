import type { BaseComponentProps } from '@utils/BaseComponentProps';

// Common class for all HTML Elements
class BaseComponent {
  private _element: HTMLElement;
  constructor(props: Partial<BaseComponentProps>) {
    // create element by tag or div
    const element = document.createElement(props.tag ?? 'div');

    // Set element's inner text
    element.innerText = props.innerText ?? '';

    // Set element's class
    if (props.classList) {
      if (props.classList instanceof Array) {
        props.classList.forEach((item) => {
          element.classList.add(`${item}`);
        });
      } else {
        element.classList.add(props.classList);
      }
    }

    if (props.draggable === true) {
      element.draggable = true;
    }

    this._element = element;
  }

  // Getter for created HTML element
  public get element(): HTMLElement {
    return this._element;
  }
}

export const createBaseComponent = (props: Partial<BaseComponentProps>): HTMLElement => {
  return new BaseComponent(props).element;
};
