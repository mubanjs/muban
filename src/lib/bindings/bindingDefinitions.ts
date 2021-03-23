/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import { watchEffect } from '@vue/runtime-core';
import { getCurrentComponentInstance } from '../Component';
import type { ComponentFactory } from '../Component.types';
import type {
  CollectionRef,
  ComponentParams,
  ComponentsRef,
  AnyRef,
  ElementRef,
  ComponentRef,
} from '../refs/refDefinitions.types';
import type { ComponentTemplateResult } from '../template/template.types';
import { applyBindings } from './applyBindings';
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

/**
 *
 * @param target Either a ref collection (either element or component),
 * or an Array of refs. When an Array is passed, it just loops over the refs
 * inside the Array and executes getProps to get the props for each ref.
 * When a refCollection is called, it will keep watching for changes in the
 * collection and call the getProps each time the collection is updated.
 * @param getProps A function that will be called for each ref in the Array or
 * Collection, receiving the ref and the index, and expects the binding object
 * returned to apply this to each ref.
 */
export function bindMap<
  T extends Pick<
    CollectionRef<HTMLElement, BindProps> | ComponentsRef<ComponentFactory<any>>,
    'getRefs' | 'getBindingDefinition'
  >
>(
  target: T,
  getProps: (
    ref: ReturnType<T['getRefs']>[number],
    index: number,
  ) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding>;
export function bindMap<
  T extends Pick<
    ElementRef<HTMLElement, BindProps> | ComponentRef<ComponentFactory<any>>,
    'getBindingDefinition'
  >
>(
  target: Array<T>,
  getProps: (ref: T, index: number) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding>;
export function bindMap(
  target: any,
  getProps: (
    ref: ElementRef<HTMLElement, BindProps> | ComponentRef<ComponentFactory<any>>,
    index: number,
  ) => any,
): Array<Binding> {
  const instance = getCurrentComponentInstance();
  if (instance) {
    if (Array.isArray(target)) {
      return target.map((ref, index) => bind(ref, getProps(ref, index)));
    }
    // target.getRefs() is reactive and triggers this watchEffect to update
    // as soon as the underlying ref array updates when the items in the DOM
    // are updated
    watchEffect(() => {
      // TODO: should we check if this item already has bindings attached to it?
      const bindings = ((target as any).getRefs() as Array<
        ElementRef<HTMLElement, BindProps> | ComponentRef<ComponentFactory<any>>
      >).map((ref, index) => bind(ref, getProps(ref, index)));

      // TODO: should we register this as part of the component instance
      //  so they get cleaned up on unmount?
      applyBindings(bindings, instance);
    });
  }

  return [];
}

export function bindTemplate<P extends any>(
  target: ElementRef<HTMLElement, BindProps>,
  data: Ref<P>,
  template: (data: P) => ComponentTemplateResult,
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
