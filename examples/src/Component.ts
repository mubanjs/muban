/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BindCollection,
  BindComponent,
  BindElement,
  Binding,
  BindProps,
  CollectionRef,
  ComponentRef,
  ElementRef,
} from './JSX.Reactive';

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
  selector: (parent: HTMLElement) => ElementRef<HTMLElement>;
  isRequired?: boolean;
};
type ComponentRefItemCollection = {
  type: 'collection';
  ref: string;
  selector: (parent: HTMLElement) => CollectionRef<HTMLElement>;
  isRequired?: boolean;
};
type ComponentRefItemComponent<T extends ComponentRef<ComponentFactory>> = {
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
    selector: (parent) => {
      const elements = Array.from(parent.querySelectorAll(`[data-ref="${ref}"]`)) as Array<
        HTMLElement
      >;

      const fn = (props: Omit<BindProps<any>, 'ref'>) => {
        return BindCollection({ ref: elements, ...props });
      };
      fn.value = elements;
      return (fn as unknown) as CollectionRef<HTMLElement>;
    },
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
    selector: (parent) => {
      const element = parent.querySelector(`[data-ref="${ref}"]`) as HTMLElement;

      const fn = (props: Omit<BindProps<any>, 'ref'>) => {
        return BindElement({ ref: element, ...props });
      };
      fn.value = element;
      return (fn as unknown) as ElementRef<HTMLElement>;
    },
    isRequired,
  };
}

export function refComponent<T extends ComponentRef<ComponentFactory>>(
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

      const instance = component(element);
      const fn = (props: { onChange: (value: Array<string>) => void }) => {
        return BindComponent({ ref: instance, ...props });
      };
      fn.value = instance;
      return (fn as unknown) as T;
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
