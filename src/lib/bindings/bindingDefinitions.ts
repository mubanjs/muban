/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import type { ComponentFactory } from '../Component.types';
import type {
  CollectionRef,
  ComponentParams,
  ComponentsRef,
  AnyRef,
  ElementRef,
} from '../refs/refDefinitions.types';
import type { Binding, BindProps, TemplateProps } from './bindings.types';

/////
// Component functions
// These are called from within your components' setup function, and return the response from one of the
// `BindXXX` functions below, wrapped through the refDefinitions they apply to.
// The `getBindingDefinition` just forwards the props, but passes long the target Elements/Components
// inside a `ref` so they can be updated when the DOM changes
////

export function bind<T extends Pick<AnyRef, 'getBindingDefinition'>>(
  target: T,
  props: Parameters<T['getBindingDefinition']>[0],
) {
  return target.getBindingDefinition(props);
}

export function bindMap<
  T extends Pick<
    CollectionRef<HTMLElement, BindProps> | ComponentsRef<ComponentFactory<any>>,
    'refs' | 'getBindingDefinition'
  >
>(
  target: T,
  getProps: (ref: T['refs'][number], index: number) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding> {
  return (target.refs as Array<T['refs'][number]>).map((ref, index) =>
    bind(ref, getProps(ref, index)),
  );
}

export function bindTemplate<P extends Record<string, unknown>>(
  target: ElementRef<HTMLElement, BindProps>,
  data: Ref<P>,
  template: (props: P) => string | Array<string>,
  {
    extract,
    renderImmediate = false,
  }: {
    extract?: {
      config: any;
      onData: (data: any) => void;
    };
    renderImmediate?: boolean;
  } = {},
): TemplateBinding<HTMLElement> {
  return BindTemplate({ ref: target, data, template, extract, renderImmediate });
}

/////
// Definitions
// These are called via the refDefinitions from the bind/Map/Template above
// The response from these functions are used by the "applyBindings" function
////

export type ElementBinding<T extends HTMLElement, P extends BindProps> = {
  ref: Ref<T | undefined>;
  type: 'element';
  props: P;
  getElements(): Array<T>;
};
export function bindElement<T extends HTMLElement, P extends BindProps>(
  ref: Ref<T | undefined>,
  props: P,
): ElementBinding<T, P> {
  return {
    ref,
    type: 'element',
    props: props,
    getElements() {
      return ref.value ? [ref.value] : [];
    },
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type CollectionBinding<T extends HTMLElement, P extends BindProps> = {
  ref: Ref<Array<T>>;
  type: 'collection';
  props: P;
  getElements(): Array<T>;
};
export function bindCollection<T extends HTMLElement, P extends BindProps>(
  ref: Ref<Array<T>>,
  props: P,
): CollectionBinding<T, P> {
  return {
    ref,
    type: 'collection',
    props: props,
    getElements() {
      return ref.value;
    },
  };
}

export type SimpleComponentApi = Pick<ReturnType<ComponentFactory<any>>, 'setProps' | 'element'>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ComponentBinding<T extends SimpleComponentApi> = {
  ref: Ref<T | undefined>;
  type: 'component';
  props: ComponentParams<T>;
  getElements(): Array<HTMLElement>;
};
export function BindComponent<T extends SimpleComponentApi>(
  ref: Ref<T | undefined>,
  props: ComponentParams<T>,
): ComponentBinding<T> {
  return {
    ref,
    type: 'component',
    props: props,
    getElements() {
      return ref.value?.element ? [ref.value.element] : [];
    },
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ComponentCollectionBinding<T extends SimpleComponentApi> = {
  ref: Ref<Array<T>>;
  type: 'componentCollection';
  props: ComponentParams<T>;
  getElements(): Array<HTMLElement>;
};
export function bindComponentCollection<T extends SimpleComponentApi>(
  ref: Ref<Array<T>>,
  props: ComponentParams<T>,
): ComponentCollectionBinding<T> {
  return {
    ref,
    type: 'componentCollection',
    props: props,
    getElements() {
      return ref.value.map((component) => component.element);
    },
  };
}

export type TemplateBinding<T extends HTMLElement> = {
  type: 'template';
  props: TemplateProps<T>;
  getElements(): Array<HTMLElement>;
};
export function BindTemplate<T extends HTMLElement>(props: TemplateProps<T>): TemplateBinding<T> {
  return {
    type: 'template',
    props: props,
    getElements() {
      return props.ref?.element ? [props.ref.element] : [];
    },
  };
}
