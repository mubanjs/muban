/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

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
import typedObjectEntries from './type-utils/typedObjectEntries';

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
  ref?: string;
  selector: (parent: HTMLElement) => T | undefined;
  isRequired?: boolean;
};

type ComponentRefItem =
  | string
  | ComponentRefItemElement
  | ComponentRefItemCollection
  | ComponentRefItemComponent<any>;

export type ComponentPropTypes<T extends Record<string, any>> = { [P in keyof T]: any };
export type ComponentRefTypes<T extends Record<string, any>> = { [P in keyof T]: ComponentRefItem };
export type ComponentProps<T extends Record<string, any>> = T;
export type ComponentRefs<T extends Record<string, any>> = T;

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

      if (elements.length === 0) {
        console.error('Elements not found', `[data-ref="${ref}"]`);
      }

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
      const element = parent.querySelector(`[data-ref="${ref}"]`) as HTMLElement | null;

      if (!element) {
        console.error('Element not found', `[data-ref="${ref}"]`);
      }

      const fn = (props: Omit<BindProps<any>, 'ref'>) => {
        return BindElement({ ref: element ?? undefined, ...props });
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
      const query = ref ? `[data-ref="${ref}"]` : `[data-component="${component.displayName}"]`;
      const element: HTMLElement | null = parent.querySelector(query);

      if (!element) {
        console.error('Component not found', query);
      }
      const instance = (element && component(element)) ?? undefined;
      const fn = (props: { onChange: (value: Array<string>) => void }) => {
        return BindComponent({ ref: instance, ...props });
      };
      fn.value = instance;
      return (fn as unknown) as T;
    },
    isRequired,
  };
}

export function getProps<T extends HTMLElement>(
  props: Record<string, any> | undefined,
  element: T,
) {
  return (
    Object.entries(props ?? {}).reduce((accumulator, [propName, propType]) => {
      const value = element.dataset[propName];
      if (value !== undefined) {
        accumulator[propName] = [Boolean, Number].includes(propType) ? JSON.parse(value) : value;
      }
      return accumulator;
    }, {} as Record<string, any>) ?? {}
  );
}
export function getRefs<T extends HTMLElement, R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  element: T,
): ComponentRefs<R> | {} {
  return (
    (refs &&
      typedObjectEntries(refs).reduce((accumulator, [propName, selector]) => {
        (accumulator as any)[propName] = (typeof selector === 'string'
          ? refElement(selector)
          : selector
        ).selector(element);
        return accumulator;
      }, {} as ComponentRefs<R>)) ??
    {}
  );
}
