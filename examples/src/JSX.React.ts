/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BindElement = (props: BindProps): BindProps => {
  return props;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BindCollection = (props: BindProps): BindProps => {
  return props;
};

export const createElement = (
  element: typeof BindElement | typeof BindCollection,
  props: BindProps,
  ...children: Array<BindProps>
): BindProps => {
  // console.log('createElement', element, props, children);
  return element({ ...props, children });
};
export const Fragment = ({ children }: { children: Array<any> }): Array<BindProps> => {
  // console.log('createFragment', children);
  return children;
};

export type BindProps = {
  ref: HTMLElement;
  text?: string;
  html?: string;
  click?: () => void;
  style?: Record<string, string>;
  css?: Record<string, string>;
  children?: Array<BindProps>;
};
