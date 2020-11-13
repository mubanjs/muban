/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

// see https://github.com/vuejs/vue-next/blob/ca8276d1fa01c06fd63394a2c0d572581618ae3d/packages/reactivity/src/ref.ts#L184-L201
declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    runtimeDOMBailTypes: Node | Window | HTMLElement;
  }
}

import { Ref, ref } from '@vue/reactivity';
import type { ComponentApi, ComponentFactory } from '../../Component.types';
import {
  BindCollection,
  BindComponent,
  BindComponents,
  BindElement,
  BindProps,
} from '../bindings/bindingDefinitions';
import type {
  CollectionRef,
  ComponentRef,
  ComponentRefItemCollection,
  ComponentRefItemComponent,
  ComponentRefItemComponents,
  ComponentRefItemElement,
  ComponentSetPropsParam,
  ComponentsRef,
  ElementRef,
} from './refDefinitions.types';

export function refElement(
  refId: string,
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemElement {
  return {
    ref: refId,
    type: 'element',
    selector: (parent) => {
      const elementRef = ref<HTMLElement>();
      const getElement = (initial: boolean = false) => {
        const element = parent.querySelector<HTMLElement>(`[data-ref="${refId}"]`) ?? undefined;
        if (isRequired && !element && (initial || elementRef.value !== element)) {
          console.error('Element not found', `[data-ref="${refId}"]`);
        }
        return element;
      };
      elementRef.value = getElement(true);

      // this is the JSX Component function
      const fn = (props: Omit<BindProps<any>, 'ref'>) => {
        return BindElement({
          ref: elementRef,
          ...props,
        });
      };
      // TODO: this is currently not reactive, so is only correct in the setup function, not in async code or callbacks
      fn.value = elementRef.value;
      fn.refreshRefs = () => {
        const element = getElement();
        if (element !== elementRef.value) {
          elementRef.value = element;
        }
      };
      return (fn as unknown) as ElementRef<HTMLElement>;
    },
    isRequired,
  };
}

export function refCollection(
  refId: string,
  { isRequired = true }: { isRequired?: boolean } = {},
): ComponentRefItemCollection {
  return {
    ref: refId,
    type: 'collection',
    selector: (parent) => {
      const getElements = () => {
        const elements = Array.from(parent.querySelectorAll(`[data-ref="${refId}"]`)) as Array<
          HTMLElement
        >;
        if (elements.length === 0) {
          console.error('Elements not found', `[data-ref="${refId}"]`);
        }
        return elements;
      };
      const elementsRef = ref(getElements());

      const fn = (props: Omit<BindProps<any>, 'ref'>) => {
        return BindCollection({ ref: elementsRef, ...props });
      };
      fn.value = elementsRef.value;
      fn.refs = elementsRef.value.map((element) => {
        const fn = (props: Omit<BindProps<any>, 'ref'>) => {
          return BindElement({ ref: ref(element), ...props });
        };
        fn.value = element;
        return (fn as unknown) as ElementRef<HTMLElement>;
      });
      fn.refreshRefs = () => {
        elementsRef.value = getElements();
      };
      return (fn as unknown) as CollectionRef<HTMLElement>;
    },
    isRequired,
  };
}

export function refComponent<T extends ComponentFactory<any>>(
  component: T,
  { ref: refId, isRequired = true }: { ref?: string; isRequired?: boolean } = {},
): ComponentRefItemComponent<T> {
  return {
    ref: refId,
    type: 'component',
    selector: (parent) => {
      const instanceRef = ref() as Ref<ComponentApi<any> | undefined>;

      const getComponent = (initialRender: boolean = false) => {
        const query = refId
          ? `[data-ref="${refId}"]`
          : `[data-component="${component.displayName}"]`;
        const element = parent.querySelector<HTMLElement>(query) ?? undefined;

        if (initialRender && isRequired && !element) {
          console.error('Component not found', query);
        }

        return element === instanceRef.value?.element
          ? instanceRef.value
          : (element && component(element)) ?? undefined;
      };

      instanceRef.value = getComponent(true);

      const fn = (props: ComponentSetPropsParam<ReturnType<T>>) => {
        return BindComponent({ ref: instanceRef, ...props });
      };
      fn.value = instanceRef.value;
      fn.refreshRefs = () => {
        instanceRef.value = getComponent();
      };
      return (fn as unknown) as ComponentRef<T>;
    },
    isRequired,
  };
}

export function refComponents<T extends ComponentFactory<any>>(
  component: T,
  { ref: refId, isRequired = true }: { ref?: string; isRequired?: boolean } = {},
): ComponentRefItemComponents<T> {
  return {
    ref: refId,
    type: 'components',
    selector: (parent) => {
      const instancesRef = ref([]) as Ref<Array<ReturnType<ComponentFactory<any>>>>;

      const getComponents = () => {
        const query = refId
          ? `[data-ref="${refId}"]`
          : `[data-component="${component.displayName}"]`;
        const elements: Array<HTMLElement> = Array.from(parent.querySelectorAll(query));

        return elements.map((element) => {
          const existingInstance = instancesRef.value
            .map((instance) => instance.element)
            .indexOf(element);
          if (existingInstance === -1) {
            return (component as T)(element);
          } else {
            return instancesRef.value[existingInstance];
          }
        });
      };

      instancesRef.value = getComponents();

      const fn = (props: ComponentSetPropsParam<ReturnType<T>>) => {
        return BindComponents({ ref: instancesRef, ...props });
      };
      fn.value = instancesRef.value;
      fn.refs = instancesRef.value.map((instance) => {
        const fn = (props: Omit<BindProps<any>, 'ref'>) => {
          return BindComponent({ ref: ref(instance), ...props });
        };
        fn.value = instance;
        return (fn as unknown) as ComponentRef<T>;
      });
      fn.refreshRefs = () => {
        instancesRef.value = getComponents();
      };
      return (fn as unknown) as ComponentsRef<T>;
    },
    isRequired,
  };
}
