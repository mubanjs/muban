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

export function refElement(
  refId: string,
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemElement {
  return {
    ref: refId,
    type: 'element',
    createRef: (instance) => {
      const elementRef = ref<HTMLElement>();
      const getElement = (initial: boolean = false) => {
        // when ref is not provided, pick the component element itself
        const element =
          refId === '_self_'
            ? instance.element
            : instance.element.querySelector<HTMLElement>(`[data-ref="${refId}"]`) ?? undefined;
        if (isRequired && !element && (initial || elementRef.value !== element)) {
          console.error('Element not found', `[data-ref="${refId}"]`);
        }
        return element;
      };
      elementRef.value = getElement(true);

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
            elementRef.value = element;
          }
        },
      };
    },
    isRequired,
  };
}

export function refCollection(refId: string): ComponentRefItemCollection {
  return {
    ref: refId,
    type: 'collection',
    createRef: (instance) => {
      const getElements = () => {
        const elements = Array.from(
          instance.element.querySelectorAll(`[data-ref="${refId}"]`),
        ) as Array<HTMLElement>;
        if (elements.length === 0) {
          console.error('Elements not found', `[data-ref="${refId}"]`);
        }
        return elements;
      };
      const elementsRef = ref(getElements());

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
              return BindElement(ref(element), props);
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
  { ref: refId, isRequired = true }: { ref?: string; isRequired?: boolean } = {},
): ComponentRefItemComponent<T> {
  return {
    ref: refId,
    type: 'component',
    createRef: (instance) => {
      const instanceRef = ref() as Ref<ReturnType<T> | undefined>;

      const getComponent = (initialRender: boolean = false) => {
        const query = refId
          ? `[data-ref="${refId}"]`
          : `[data-component="${component.displayName}"]`;
        const element = instance.element.querySelector<HTMLElement>(query) ?? undefined;

        if (initialRender && isRequired && !element) {
          console.error('Component not found', query);
        }

        return element === instanceRef.value?.element
          ? instanceRef.value
          : (element && (component(element, { parent: instance }) as ReturnType<T>)) ?? undefined;
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
  { ref: refId }: { ref?: string } = {},
): ComponentRefItemComponentCollection<T> {
  return {
    ref: refId,
    type: 'componentCollection',
    createRef: (instance) => {
      const instancesRef = ref([]) as Ref<Array<ReturnType<T>>>;

      const getComponents = () => {
        const query = refId
          ? `[data-ref="${refId}"]`
          : `[data-component="${component.displayName}"]`;
        const elements: Array<HTMLElement> = Array.from(instance.element.querySelectorAll(query));

        return elements.map((element) => {
          const existingInstance = instancesRef.value
            .map((instance) => instance.element)
            .indexOf(element);
          if (existingInstance === -1) {
            return (component as T)(element, { parent: instance }) as ReturnType<T>;
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
