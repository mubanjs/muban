/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import { unref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { getCurrentComponentInstance } from '../Component';
import type { ComponentFactory } from '../Component.types';
import type {
  RefElementType,
  CollectionRef,
  ComponentParams,
  ComponentsRef,
  AnyRef,
  ElementRef,
  ComponentRef,
} from '../refs/refDefinitions.types';
import { applyBindings } from './applyBindings';
import type { Binding, BindProps, TemplateProps } from './bindings.types';

///
// Component functions
// These are called from within your components' setup function, and return the response from one of the
// `BindXXX` functions below, wrapped through the refDefinitions they apply to.
// The `getBindingDefinition` just forwards the props, but passes long the target Elements/Components
// inside a `ref` so they can be updated when the DOM changes
///

export function bind<T extends Pick<AnyRef<RefElementType>, 'getBindingDefinition'>>(
  target: T,
  // make sure that if we bind props onto multiple components,
  // we only allow setting props that exist on all of them
  props: Pick<
    Parameters<T['getBindingDefinition']>[0],
    keyof Parameters<T['getBindingDefinition']>[0]
  >,
) {
  return target.getBindingDefinition(props);
}

export type BindMapBinding = {
  type: 'bindMap';
  getElements(): ReadonlyArray<RefElementType>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  props: {};
  dispose: () => void;
};
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
    CollectionRef<RefElementType, BindProps> | ComponentsRef<ComponentFactory<any>>,
    'getRefs' | 'getBindingDefinition'
  >,
>(
  target: T,
  getProps: (
    ref: ReturnType<T['getRefs']>[number],
    index: number,
  ) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding>;
export function bindMap<
  T extends Pick<
    ElementRef<RefElementType, BindProps> | ComponentRef<ComponentFactory<any>>,
    'getBindingDefinition'
  >,
>(
  target: Array<T>,
  getProps: (ref: T, index: number) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding>;
export function bindMap(
  target: any,
  getProps: (
    ref: ElementRef<RefElementType, BindProps> | ComponentRef<ComponentFactory<any>>,
    index: number,
  ) => any,
): Array<Binding> {
  const instance = getCurrentComponentInstance();
  if (instance) {
    // If we pass an array of refs instead of a refCollection,
    // these are only set up once
    if (Array.isArray(target)) {
      return target.map((ref, index) => bind(ref, getProps(ref, index)));
    }

    // target.getRefs() is reactive and triggers this watchEffect to update
    // as soon as the underlying ref array updates when the items in the DOM
    // are updated
    const disposeWatch = watch(
      () => (target as any).getRefs() as Array<ElementRef | ComponentRef<ComponentFactory<any>>>,
      (refs, oldValue, onInvalidate) => {
        const bindings = refs.map((ref, index) => bind(ref, getProps(ref, index)));

        const removeBindingList = applyBindings(bindings, instance) || [];

        onInvalidate(() => {
          removeBindingList.forEach((binding) => binding?.());
        });
      },
      { immediate: true },
    );

    return [
      {
        type: 'bindMap',
        getElements: () => [],
        props: {},
        dispose() {
          disposeWatch();
        },
      },
    ];
  }

  return [];
}

export type TemplateBinding<T extends RefElementType> = {
  type: 'template';
  props: TemplateProps<T>;
  getElements(): ReadonlyArray<RefElementType>;
};
export function BindTemplate<T extends RefElementType>(
  props: TemplateProps<T>,
): TemplateBinding<T> {
  return {
    type: 'template',
    props,
    getElements() {
      return props.ref?.element ? [props.ref.element] : [];
    },
  };
}

export function bindTemplate(
  target: ElementRef<RefElementType, BindProps>,
  onUpdate: TemplateProps<RefElementType>['onUpdate'],
  options: {
    forceImmediateRender?: boolean;
    extract?: TemplateProps<RefElementType>['extract'];
  } = {},
): TemplateBinding<RefElementType> {
  return BindTemplate({ ref: target, onUpdate, ...options });
}

///
// Definitions
// These are called via the refDefinitions from the bind/Map/Template above
// The response from these functions are used by the "applyBindings" function
///

export type ElementBinding<T extends RefElementType, P extends BindProps> = {
  ref: Ref<T | undefined>;
  type: 'element';
  props: P;
  getElements(): Array<T>;
};
export function bindElement<T extends RefElementType, P extends BindProps>(
  ref: Ref<T | undefined>,
  props: P,
): ElementBinding<T, P> {
  return {
    ref,
    type: 'element',
    props,
    getElements() {
      return ref.value ? [ref.value] : [];
    },
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type CollectionBinding<T extends RefElementType, P extends BindProps> = {
  ref: Ref<ReadonlyArray<Ref<T>>>;
  type: 'collection';
  props: P;
  getElements(): ReadonlyArray<T>;
};
export function bindCollection<T extends RefElementType, P extends BindProps>(
  ref: Ref<ReadonlyArray<Ref<T>>>,
  props: P,
): CollectionBinding<T, P> {
  return {
    ref,
    type: 'collection',
    props,
    getElements() {
      return ref.value.map((r) => unref(r));
    },
  };
}

export type SimpleComponentApi = Pick<ReturnType<ComponentFactory<any>>, 'setProps' | 'element'>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ComponentBinding<T extends SimpleComponentApi> = {
  ref: Ref<T | undefined>;
  type: 'component';
  props: ComponentParams<T>;
  getElements(): ReadonlyArray<RefElementType>;
};
export function BindComponent<T extends SimpleComponentApi>(
  ref: Ref<T | undefined>,
  props: ComponentParams<T>,
): ComponentBinding<T> {
  return {
    ref,
    type: 'component',
    props,
    getElements() {
      return ref.value?.element ? [ref.value.element] : [];
    },
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type ComponentCollectionBinding<T extends SimpleComponentApi> = {
  ref: Ref<ReadonlyArray<Ref<T>>>;
  type: 'componentCollection';
  props: ComponentParams<T>;
  getElements(): ReadonlyArray<RefElementType>;
};
export function bindComponentCollection<T extends SimpleComponentApi>(
  ref: Ref<ReadonlyArray<Ref<T>>>,
  props: ComponentParams<T>,
): ComponentCollectionBinding<T> {
  return {
    ref,
    type: 'componentCollection',
    props,
    getElements() {
      return ref.value.map((refItem) => refItem.value.element);
    },
  };
}
