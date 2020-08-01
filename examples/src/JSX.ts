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

type ValueOrFunction<T> = /*T | */ () => T;

export type BindProps = {
  ref: HTMLElement;
  text?: ValueOrFunction<string>;
  html?: ValueOrFunction<string>;
  click?: () => void;
  style?: ValueOrFunction<Record<string, string>>;
  css?: ValueOrFunction<Record<string, string>>;
  children?: Array<BindProps>;
};
