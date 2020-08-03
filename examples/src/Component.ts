/* eslint-disable @typescript-eslint/no-explicit-any */
import { BindProps } from './JSX.Reactive';

export type ComponentFactory<T extends HTMLElement = HTMLElement> = (
  element: T,
) => {
  setProps: (props: Record<string, unknown>) => void;
  dispose: () => void;
};

export type Binding = BindProps;

export type DefineComponentOptions<T extends HTMLElement> = {
  name: string;
  props?: Record<string, any>;
  refs?: Record<string, string>;
  setup: (
    props: Record<string, unknown>,
    refs: Record<string, HTMLElement>,
    context: { element: T },
  ) => Array<Binding>;
};

export type DefineComponentOptionsReact<T extends HTMLElement> = {
  name: string;
  props?: Record<string, any>;
  refs?: Record<string, string>;
  render: (
    props: Record<string, unknown>,
    refs: Record<string, HTMLElement>,
    context: { element: T },
  ) => Array<Binding>;
};

export function getProps<T extends HTMLElement>(props: Record<string, any>, element: T) {
  return (
    Object.entries(props).reduce((accumulator, [propName, propType]) => {
      const value = element.dataset[propName];
      accumulator[propName] = [Boolean, Number].includes(propType) ? JSON.parse(value) : value;
      return accumulator;
    }, {} as Record<string, any>) ?? {}
  );
}
export function getRefs<T extends HTMLElement>(refs: Record<string, any>, element: T) {
  return (
    Object.entries(refs).reduce((accumulator, [propName, selector]) => {
      accumulator[propName] = element.querySelector(`[data-ref="${selector}"]`);
      return accumulator;
    }, {} as Record<string, any>) ?? {}
  );
}
