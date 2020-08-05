/* eslint-disable @typescript-eslint/no-explicit-any */

import { Binding } from './JSX.Reactive';

export type ComponentFactory<
  P extends Record<string, any> = Record<string, any>
> = ComponentReturnValue<P> & ComponentDisplayName;

export type ComponentDisplayName = { displayName: string };
export type ComponentReturnValue<P extends Record<string, any> = Record<string, any>> = (
  element: HTMLElement,
) => {
  name: string;
  setProps: (props: P) => void;
  dispose: () => void;
};

type ComponentRefItemElement = {
  type: 'element';
  ref: string;
  selector: (parent: HTMLElement) => HTMLElement;
  isRequired?: boolean;
};
type ComponentRefItemCollection = {
  type: 'collection';
  ref: string;
  selector: (parent: HTMLElement) => Array<HTMLElement>;
  isRequired?: boolean;
};
type ComponentRefItemComponent<T extends ReturnType<ComponentFactory>> = {
  type: 'component';
  ref: string;
  selector: (parent: HTMLElement) => T;
  isRequired?: boolean;
};

type ComponentRefItem =
  | string
  | ComponentRefItemElement
  | ComponentRefItemCollection
  | ComponentRefItemComponent<any>;

type ComponentPropTypes<T extends Record<string, any>> = { [P in keyof T]?: any };
type ComponentRefTypes<T extends Record<string, any>> = { [P in keyof T]?: ComponentRefItem };
type ComponentProps<T extends Record<string, any>> = T;
type ComponentRefs<T extends Record<string, any>> = T;

export type DefineComponentOptions<P extends Record<string, any>, R extends Record<string, any>> = {
  name: string;
  props?: ComponentPropTypes<P>;
  refs?: ComponentRefTypes<R>;
  setup: (
    props: ComponentProps<P>,
    refs: ComponentRefs<R>,
    context: { element: HTMLElement },
  ) => undefined | null | Array<Binding>;
};

export type DefineComponentOptionsReact<
  P extends Record<string, any>,
  R extends Record<string, any>
> = {
  name: string;
  props?: ComponentPropTypes<P>;
  refs?: ComponentRefTypes<R>;
  render: (
    props: ComponentProps<P>,
    refs: ComponentRefs<R>,
    context: { element: HTMLElement },
  ) => undefined | null | Array<Binding>;
};

export function refCollection(
  ref: string,
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemCollection {
  return {
    ref,
    type: 'collection',
    selector: (parent) => Array.from(parent.querySelectorAll(`[data-ref="${ref}"]`)),
    isRequired,
  };
}

export function refElement(
  ref: string,
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemElement {
  return {
    ref,
    type: 'element',
    selector: (parent) => parent.querySelector(`[data-ref="${ref}"]`),
    isRequired,
  };
}

export function refComponent<T extends ReturnType<ComponentFactory>>(
  component: ComponentFactory,
  { ref, isRequired = true }: { ref?: string; isRequired?: boolean } = {},
): ComponentRefItemComponent<T> {
  return {
    ref,
    type: 'component',
    selector: (parent) => {
      const element: HTMLElement = parent.querySelector(
        ref ? `[data-ref="${ref}"]` : `[data-component="${component.displayName}"]`,
      );

      return component(element) as T;
    },
    isRequired,
  };
}

export function getProps<T extends HTMLElement>(props: Record<string, any>, element: T) {
  return (
    Object.entries(props).reduce((accumulator, [propName, propType]) => {
      const value = element.dataset[propName];
      accumulator[propName] = [Boolean, Number].includes(propType) ? JSON.parse(value) : value;
      return accumulator;
    }, {} as Record<string, any>) ?? {}
  );
}
export function getRefs<T extends HTMLElement>(refs: Record<string, ComponentRefItem>, element: T) {
  return (
    Object.entries(refs).reduce((accumulator, [propName, selector]) => {
      accumulator[propName] = (typeof selector === 'string'
        ? refElement(selector)
        : selector
      ).selector(element);
      return accumulator;
    }, {} as Record<string, any>) ?? {}
  );
}
