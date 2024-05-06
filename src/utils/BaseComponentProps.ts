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
