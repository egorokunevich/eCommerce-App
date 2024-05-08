// Element properties
export interface BaseComponentProps {
  tag: string;
  innerText: string;
  classList: string | string[];
  type: string;
  placeholder: string;
  required: boolean;
  disabled: boolean;
  value: string;
  minlength: number;
  maxlength: number;
  draggable: boolean;
  title: string;
  src: string;
  autocomplete: 'on' | 'off';
  href: string;
}

export interface ButtonProps extends BaseComponentProps {
  type: 'button' | 'submit' | 'reset';
}

type Attribute = {
  type: string;
  text: string | boolean;
};

type ValueAttributes = Attribute[] | Attribute;

export const setAttributes = (node: HTMLElement, valueAttributes: ValueAttributes): HTMLElement => {
  if (!valueAttributes) {
    return node;
  }

  if (Array.isArray(valueAttributes)) {
    valueAttributes.forEach((attribute) => {
      node.setAttribute(attribute.type, attribute.text.toString());
    });
    return node;
  }
  node.setAttribute(valueAttributes.type, valueAttributes.text.toString());

  return node;
};
