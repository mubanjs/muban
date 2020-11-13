/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from '@vue/reactivity';
import type { ComponentFactory } from '../../Component.types';
import type { BindProps } from '../bindings/bindingDefinitions';

export type ElementRef<T extends HTMLElement> = ((props: Omit<BindProps<T>, 'ref'>) => any) & {
  value: T;
  refreshRefs: () => void;
};

export type CollectionRef<T extends HTMLElement> = ((
  props: Omit<BindProps<Array<T>>, 'ref'>,
) => any) & {
  value: Array<T>;
  refs: Array<ElementRef<T>>;
  refreshRefs: () => void;
};

export type ComponentRef<T extends ComponentFactory<any>> = ((
  props: ComponentSetPropsParam<ReturnType<T>>,
) => any) & {
  value: ReturnType<T>;
  refreshRefs: () => void;
};

export type ComponentsRef<T extends ComponentFactory<any>> = ((
  props: ComponentSetPropsParam<ReturnType<T>>,
) => any) & {
  value: Array<ReturnType<T>>;
  refs: Array<ComponentRef<T>>;
  refreshRefs: () => void;
};

type RefOrValue<T> = {
  [P in keyof T]: T[P] | Ref<T[P]>;
};

// Partial is added because bindings are only meant to CHANGE things, not to SET things,
// so all props that are REQUIRED are set by the TEMPLATE already
export type ComponentSetPropsParam<T> = T extends { setProps(props: infer R): void }
  ? Partial<RefOrValue<R>>
  : RefOrValue<T>;

export type ComponentRefItemElement = {
  type: 'element';
  ref: string;
  selector: (parent: HTMLElement) => ElementRef<HTMLElement>;
  isRequired?: boolean;
};
export type ComponentRefItemCollection = {
  type: 'collection';
  ref: string;
  selector: (parent: HTMLElement) => CollectionRef<HTMLElement>;
  isRequired?: boolean;
};
export type ComponentRefItemComponent<T extends ComponentFactory<Record<string, any>>> = {
  type: 'component';
  ref?: string;
  selector: (parent: HTMLElement) => ComponentRef<T>;
  isRequired?: boolean;
};
export type ComponentRefItemComponents<T extends ComponentFactory<Record<string, any>>> = {
  type: 'components';
  ref?: string;
  selector: (parent: HTMLElement) => ComponentsRef<T>;
  isRequired?: boolean;
};

export type ComponentRefItem =
  | string
  | ComponentRefItemElement
  | ComponentRefItemCollection
  | ComponentRefItemComponent<any>
  | ComponentRefItemComponents<any>;

export type TypedRef<T extends ComponentRefItem> = T extends {
  selector: (parent: HTMLElement) => infer R;
}
  ? Exclude<R, undefined>
  : ElementRef<HTMLElement>;

export type TypedRefs<T extends Record<string, ComponentRefItem>> = {
  [P in keyof T]: TypedRef<T[P]>;
};
