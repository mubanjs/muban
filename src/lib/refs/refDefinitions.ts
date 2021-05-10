/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

// see https://github.com/vuejs/vue-next/blob/ca8276d1fa01c06fd63394a2c0d572581618ae3d/packages/reactivity/src/ref.ts#L184-L201
declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    runtimeDOMBailTypes: Node | Window | HTMLElement;
  }
}

import { Ref, ref } from '@vue/reactivity';
import type { ComponentFactory } from '../Component.types';
import {
  bindCollection,
  BindComponent,
  bindComponentCollection,
  bindElement,
} from '../bindings/bindingDefinitions';
import { getParentComponentElement } from '../utils/domUtils';
import type {
  ComponentRefItemCollection,
  ComponentRefItemComponent,
  ComponentRefItemComponentCollection,
  ComponentRefItemElement,
  ComponentsRef,
  RefOptions,
} from './refDefinitions.types';

/**
 * Ensures that the passed element is a direct child of the parent, so that the
 * parent is the "owner" of that child. If correct, return the element, otherwise
 * return null.
 * @param parent
 * @param element
 * @param ignoreGuard
 */
export function ensureElementIsComponentChild<T extends HTMLElement>(
  parent: HTMLElement,
  element: T | null,
  ignoreGuard: boolean = false,
): T | null {
  if (!element) {
    return null;
  }

  if (ignoreGuard || parent === element) {
    // valid if self
    return element;
  }

  const parentComponentElement = getParentComponentElement(element);
  if (parent === parentComponentElement) {
    // valid if direct parent
    return element;
  }

  return null;
}

export function refElement<T extends HTMLElement = HTMLElement>(
  refIdOrQuery: string | ComponentRefItemElement<T>['queryRef'],
  { isRequired = true, ignoreGuard }: RefOptions<{ isRequired?: boolean }> = {},
): ComponentRefItemElement<T> {
  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'element',
    queryRef(parent) {
      // also check for data-ref on the root element to not have to refactor
      // when moving the div (e.g. when adding wrapping containers)
      if (this.ref === '_self_' || parent.dataset.ref === this.ref) {
        return parent as T | null;
      }

      let element: T | null;
      if (typeof refIdOrQuery === 'function') {
        element = refIdOrQuery(parent);
      } else {
        element = (parent.querySelector<T>(`[data-ref="${this.ref}"]`) ?? null) as T | null;
      }
      return ensureElementIsComponentChild(parent, element, ignoreGuard);
    },
    createRef(instance) {
      const elementRef = ref<T>();
      const getElement = (initial: boolean = false) => {
        // when ref is not provided, pick the component element itself
        const element = this.queryRef(instance.element);

        if (isRequired && !element && (initial || elementRef.value !== element)) {
          console.error('Element not found', this.ref);
        }
        return element;
      };
      elementRef.value = getElement(true) ?? undefined;

      return {
        type: 'element',
        getBindingDefinition(props) {
          return bindElement(elementRef, props);
        },
        // TODO: this is currently not reactive, so is only correct in the setup function, not in async code or callbacks
        element: elementRef.value,
        refreshRefs() {
          const element = getElement();
          if (element !== elementRef.value) {
            elementRef.value = element ?? undefined;
          }
        },
      };
    },
    isRequired,
  };
}

export function refCollection<T extends HTMLElement = HTMLElement>(
  refIdOrQuery: string | ComponentRefItemCollection<T>['queryRef'],
  { minimumItemsRequired = 0, ignoreGuard }: RefOptions<{ minimumItemsRequired?: number }> = {},
): ComponentRefItemCollection<T> {
  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'collection',
    queryRef(parent) {
      let elements: Array<T>;
      if (typeof refIdOrQuery === 'function') {
        elements = refIdOrQuery(parent);
      } else {
        elements = Array.from(parent.querySelectorAll<T>(`[data-ref="${refIdOrQuery}"]`));
      }
      return elements.filter((element) =>
        Boolean(ensureElementIsComponentChild(parent, element, ignoreGuard)),
      );
    },
    createRef(instance) {
      const elementsRef = ref([]) as Ref<Array<T>>;
      const getElements = () => {
        const elements = this.queryRef(instance.element);
        if (elements.length < minimumItemsRequired) {
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
          );
        }

        return elements;
      };
      elementsRef.value = getElements();

      return {
        type: 'collection',
        getBindingDefinition(props) {
          return bindCollection(elementsRef, props);
        },
        getElements() {
          return elementsRef.value;
        },
        // elements: elementsRef.value,
        getRefs() {
          return elementsRef.value.map((element) => {
            return {
              type: 'element',
              getBindingDefinition(props) {
                return bindElement(ref(element) as Ref<T>, props);
              },
              // TODO: this is currently not reactive, so is only correct in the setup function, not in async code or callbacks
              element: element,
            };
          });
        },
        refreshRefs() {
          const elements = getElements();
          // only re-assign if some refs are actually different
          if (
            elements.length !== elementsRef.value.length ||
            !elements.every((el) => elementsRef.value.includes(el))
          ) {
            elementsRef.value = elements;
          }
        },
      };
    },
  };
}

export function refComponent<T extends ComponentFactory<any>>(
  component: T | Array<T>,
  {
    ref: refIdOrQuery,
    isRequired = true,
    ignoreGuard,
  }: RefOptions<{
    ref?: string | ComponentRefItemComponent<T>['queryRef'];
    isRequired?: boolean;
  }> = {},
): ComponentRefItemComponent<T> {
  const components = Array.isArray(component) ? component : [component];
  const getQuery = () => {
    return refIdOrQuery
      ? `[data-ref="${refIdOrQuery}"]`
      : components.map((c) => `[data-component="${c.displayName}"]`).join(', ');
  };

  return {
    ref: typeof refIdOrQuery === 'function' ? '[custom]' : refIdOrQuery,
    componentRef: components[0].displayName,
    type: 'component',
    queryRef(parent) {
      let element: HTMLElement | null;
      if (typeof refIdOrQuery === 'function') {
        element = refIdOrQuery(parent);
      } else {
        element = parent.querySelector<HTMLElement>(getQuery()) ?? null;
      }
      return ensureElementIsComponentChild(parent, element, ignoreGuard);
    },
    createRef(instance) {
      const instanceRef = ref() as Ref<ReturnType<T> | undefined>;

      const getComponent = (initialRender: boolean = false) => {
        const element = this.queryRef(instance.element);

        if (initialRender && isRequired && !element) {
          console.error('Component not found', getQuery());
        }

        if (element === instanceRef.value?.element) {
          return instanceRef.value;
        }
        if (element) {
          const newComponentFactory = (Array.isArray(component) ? component : [component]).find(
            (c) => c.displayName === element.dataset.component,
          );
          if (newComponentFactory) {
            // create new component instance
            const refInstance = newComponentFactory(element, { parent: instance }) as ReturnType<T>;
            instance.children.push(refInstance);
            return refInstance;
          } else {
            console.error(
              `[refComponent] Selected element that doesn't match any of the passed components`,
              element,
              (Array.isArray(component) ? component : [component]).map((c) => c.displayName),
            );
          }
        }
      };

      instanceRef.value = getComponent(true);

      return {
        type: 'component',
        getBindingDefinition(props) {
          return BindComponent(instanceRef, props);
        },
        component: instanceRef.value,
        refreshRefs() {
          instanceRef.value = getComponent();
        },
      };
    },
    isRequired,
  };
}

export function refComponents<T extends ComponentFactory<any>>(
  component: T,
  {
    ref: refIdOrQuery,
    minimumItemsRequired = 0,
    ignoreGuard,
  }: RefOptions<{
    ref?: string | ComponentRefItemComponentCollection<T>['queryRef'];
    minimumItemsRequired?: number;
  }> = {},
): ComponentRefItemComponentCollection<T> {
  return {
    ref: typeof refIdOrQuery === 'function' ? '[custom]' : refIdOrQuery,
    componentRef: component.displayName,
    type: 'componentCollection',
    queryRef(parent) {
      let elements: Array<HTMLElement>;
      if (typeof refIdOrQuery === 'function') {
        elements = refIdOrQuery(parent);
      } else {
        const query = refIdOrQuery
          ? `[data-ref="${refIdOrQuery}"]`
          : `[data-component="${component.displayName}"]`;
        elements = Array.from(parent.querySelectorAll(query));
      }

      return elements.filter((element) =>
        Boolean(ensureElementIsComponentChild(parent, element, ignoreGuard)),
      );
    },
    createRef(instance) {
      const instancesRef = ref([]) as Ref<Array<ReturnType<T>>>;

      const getComponents = () => {
        const elements = this.queryRef(instance.element);

        if (elements.length < minimumItemsRequired) {
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
          );
        }

        return elements.map((element) => {
          const existingInstance = instancesRef.value
            .map((instance) => instance.element)
            .indexOf(element);
          if (existingInstance === -1) {
            // create new component instance
            const refInstance = component(element, { parent: instance }) as ReturnType<T>;
            instance.children.push(refInstance);
            return refInstance;
          } else {
            return instancesRef.value[existingInstance];
          }
        });
      };

      instancesRef.value = getComponents();

      return {
        type: 'componentCollection',
        getBindingDefinition(props) {
          return bindComponentCollection(instancesRef, props);
        },
        getComponents() {
          return instancesRef.value;
        },
        getRefs() {
          return instancesRef.value.map((instance) => {
            return {
              type: 'component',
              getBindingDefinition(props) {
                return BindComponent(ref(instance), props);
              },
              component: instance,
            };
          }) as ReturnType<ComponentsRef<T>['getRefs']>;
        },
        refreshRefs() {
          instancesRef.value = getComponents();
        },
      };
    },
  };
}
