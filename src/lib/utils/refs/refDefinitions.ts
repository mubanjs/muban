/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

// see https://github.com/vuejs/vue-next/blob/ca8276d1fa01c06fd63394a2c0d572581618ae3d/packages/reactivity/src/ref.ts#L184-L201
declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    runtimeDOMBailTypes: Node | Window | HTMLElement;
  }
}

import { Ref, ref } from '@vue/reactivity';
import type { ComponentFactory } from '../../Component.types';
import {
  BindCollection,
  BindComponent,
  BindComponents,
  BindElement,
} from '../bindings/bindingDefinitions';
import type {
  ComponentRefItemCollection,
  ComponentRefItemComponent,
  ComponentRefItemComponentCollection,
  ComponentRefItemElement,
  ComponentsRef,
} from './refDefinitions.types';

export function refElement<T extends HTMLElement = HTMLElement>(
  refIdOrQuery: string | ComponentRefItemElement<T>['queryRef'],
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemElement<T> {
  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'element',
    queryRef(parent) {
      if (typeof refIdOrQuery === 'function') {
        return refIdOrQuery(parent);
      }
      return (this.ref === '_self_'
        ? parent
        : parent.querySelector<T>(`[data-ref="${this.ref}"]`) ?? null) as T | null;
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
          return BindElement(elementRef, props);
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
): ComponentRefItemCollection<T> {
  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'collection',
    queryRef(parent) {
      if (typeof refIdOrQuery === 'function') {
        return refIdOrQuery(parent);
      }
      return Array.from(parent.querySelectorAll<T>(`[data-ref="${refIdOrQuery}"]`));
    },
    createRef(instance) {
      const getElements = () => {
        const elements = this.queryRef(instance.element);
        if (elements.length === 0) {
          console.error('Elements not found', `[data-ref="${this.ref}"]`);
        }
        return elements;
      };
      const elementsRef = ref(getElements()) as Ref<Array<T>>;

      return {
        type: 'collection',
        getBindingDefinition(props) {
          return BindCollection(elementsRef, props);
        },
        elements: elementsRef.value,
        refs: elementsRef.value.map((element) => {
          return {
            type: 'element',
            getBindingDefinition(props) {
              return BindElement(ref(element) as Ref<T>, props);
            },
            // TODO: this is currently not reactive, so is only correct in the setup function, not in async code or callbacks
            element: element,
          };
        }),
        refreshRefs() {
          elementsRef.value = getElements();
        },
      };
    },
  };
}

export function refComponent<T extends ComponentFactory<any>>(
  component: T,
  {
    ref: refIdOrQuery,
    isRequired = true,
  }: { ref?: string | ComponentRefItemComponent<T>['queryRef']; isRequired?: boolean } = {},
): ComponentRefItemComponent<T> {
  const getQuery = () => {
    return refIdOrQuery
      ? `[data-ref="${refIdOrQuery}"]`
      : `[data-component="${component.displayName}"]`;
  };

  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'component',
    queryRef(parent) {
      if (typeof refIdOrQuery === 'function') {
        return refIdOrQuery(parent);
      }
      return parent.querySelector<HTMLElement>(getQuery()) ?? null;
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
          // create new component instance
          const refInstance = component(element, { parent: instance }) as ReturnType<T>;
          instance.children.push(refInstance);
          return refInstance;
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
  { ref: refIdOrQuery }: { ref?: string | ComponentRefItemComponentCollection<T>['queryRef'] } = {},
): ComponentRefItemComponentCollection<T> {
  return {
    ref: typeof refIdOrQuery === 'string' ? refIdOrQuery : '[custom]',
    type: 'componentCollection',
    queryRef(parent) {
      if (typeof refIdOrQuery === 'function') {
        return refIdOrQuery(parent);
      }
      const query = refIdOrQuery
        ? `[data-ref="${refIdOrQuery}"]`
        : `[data-component="${component.displayName}"]`;
      return Array.from(parent.querySelectorAll(query));
    },
    createRef(instance) {
      const instancesRef = ref([]) as Ref<Array<ReturnType<T>>>;

      const getComponents = () => {
        const elements = this.queryRef(instance.element);

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
          return BindComponents(instancesRef, props);
        },
        components: instancesRef.value,
        refs: instancesRef.value.map((instance) => {
          return {
            type: 'component',
            getBindingDefinition(props) {
              return BindComponent(ref(instance), props);
            },
            component: instance,
          };
        }) as ComponentsRef<T>['refs'],
        refreshRefs() {
          instancesRef.value = getComponents();
        },
      };
    },
  };
}
