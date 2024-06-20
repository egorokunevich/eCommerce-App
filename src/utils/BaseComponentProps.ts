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
