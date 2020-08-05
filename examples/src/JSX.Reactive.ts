/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */

import { Ref } from '@vue/reactivity';
import { ComponentFactory } from './Component';

export const BindElement = <T extends HTMLElement>(
  props: BindProps<T>,
): { type: 'element'; props: BindProps<HTMLElement> } => {
  return {
    type: 'element',
    props: props,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BindCollection = <T extends HTMLElement>(
  props: BindProps<Array<T>>,
): { type: 'collection'; props: BindProps<Array<T>> } => {
  return {
    type: 'collection',
    props: props,
  };
};

type ComponentSetPropsParam<T> = T extends { setProps(props: infer R): void } ? R : T;

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponent<T extends Pick<ReturnType<ComponentFactory>, 'setProps'>>(
  props: { ref: T } & ComponentSetPropsParam<T>,
): { type: 'component'; props: { ref: T } & ComponentSetPropsParam<T> } {
  return {
    type: 'component',
    props: props,
  };
}

export const createElement = (
  element: (props: any) => any,
  props: Record<string, any>,
  ...children: Array<any>
): Binding => {
  // console.log('createElement', element, props, children);
  return element({ ...props, children: children as any });
};
export const Fragment = ({ children }: { children: Array<any> }): Array<BindProps<any>> => {
  // console.log('createFragment', children);
  return children;
};

export type Binding =
  | ReturnType<typeof BindElement>
  | ReturnType<typeof BindCollection>
  | ReturnType<typeof BindComponent>;

type BindingValue<T> = T | Ref<T>;

export type BindProps<T> = {
  ref: T;
  text?: BindingValue<string>;
  html?: BindingValue<string>;
  click?: (event: HTMLElementEventMap['click']) => void;
  style?: BindingValue<Record<string, string>>;
  css?: BindingValue<Record<string, string>>;
};
