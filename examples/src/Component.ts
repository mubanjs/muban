/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

import {
  BindCollection,
  BindComponent,
  BindElement,
  Binding,
  BindProps,
  CollectionRef,
  ComponentRef,
  ComponentSetPropsParam,
  ElementRef,
} from './JSX.Vue';
import type { PropTypeDefinition, TypedProps } from './prop-types';
import typedObjectEntries from './type-utils/typedObjectEntries';

export type ComponentFactory<P extends Record<string, PropTypeDefinition>> = ComponentReturnValue<
  TypedProps<P>
> &
  ComponentDisplayName;

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
type ComponentRefItemComponent<T extends ComponentFactory<Record<string, any>>> = {
  type: 'component';
  ref?: string;
  selector: (parent: HTMLElement) => ComponentRef<T> | undefined;
  isRequired?: boolean;
};

export type ComponentRefItem =
  | string
  | ComponentRefItemElement
  | ComponentRefItemCollection
  | ComponentRefItemComponent<any>;

export type TypedRef<T extends ComponentRefItem> = T extends {
  selector: (parent: HTMLElement) => infer R;
}
  ? Exclude<R, undefined>
  : ElementRef<HTMLElement>;

export type TypedRefs<T extends Record<string, ComponentRefItem>> = {
  [P in keyof T]: TypedRef<T[P]>;
};

export type DefineComponentOptions<
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>
> = {
  name: string;
  props?: P;
  refs?: R;
  setup: (
    props: TypedProps<P>,
    refs: TypedRefs<R>,
    context: { element: HTMLElement },
  ) => undefined | null | Array<Binding>;
};

// export type DefineComponentOptionsReact<
//   P extends Record<string, any>,
//   R extends Record<string, any>
// > = {
//   name: string;
//   props?: P;
//   refs?: R;
//   render: (
//     props: ComponentProps<P>,
//     refs: ComponentRefs<R>,
//     context: { element: HTMLElement },
//   ) => undefined | null | Array<Binding>;
// };

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

export function refComponent<T extends ComponentFactory<any>>(
  component: T,
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
      const fn = (props: ComponentSetPropsParam<ReturnType<T>>) => {
        return BindComponent({ ref: instance, ...props });
      };
      fn.value = instance;
      return (fn as unknown) as ComponentRef<T>;
    },
    isRequired,
  };
}

export function getRefs<T extends HTMLElement, R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  element: T,
): TypedRefs<R> {
  return (
    (refs &&
      typedObjectEntries(refs).reduce((accumulator, [propName, selector]) => {
        (accumulator as any)[propName] = (typeof selector === 'string'
          ? refElement(selector)
          : selector
        ).selector(element);
        return accumulator;
      }, {} as TypedRefs<R>)) ??
    ({} as TypedRefs<R>)
  );
}
