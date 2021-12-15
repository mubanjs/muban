/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

// see https://github.com/vuejs/vue-next/blob/ca8276d1fa01c06fd63394a2c0d572581618ae3d/packages/reactivity/src/ref.ts#L184-L201
declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    runtimeDOMBailTypes: Node | Window | HTMLElement;
  }
}

import { Ref, ref, unref } from '@vue/reactivity';
import type { ComponentApi, ComponentFactory, InternalComponentInstance } from '../Component.types';
import {
  bindCollection,
  BindComponent,
  bindComponentCollection,
  bindElement,
} from '../bindings/bindingDefinitions';
import { getParentComponentElement } from '../utils/domUtils';
import { getComponentForElement } from '../utils/global';
import type { RefElementType } from './refDefinitions.types';
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
export function ensureElementIsComponentChild<T extends RefElementType>(
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

/**
 * Checks if a child component instance for a Ref, that is about to be created
 * already exists as a globally created component, and re-parents it
 * @param element
 * @param instance
 */
function getExistingGlobalRefComponent<T extends ComponentApi>(
  element: HTMLElement,
  instance: InternalComponentInstance,
): T {
  const existingComponent = getComponentForElement(element);
  let refInstance: T;
  if (existingComponent) {
    // only if the component currently links to the app root
    // in that case, it was initialized globally already
    if (existingComponent.__instance.parent?.uid === 0) {
      // relink this component to it's proper parent
      existingComponent.__instance.parent = instance;
      refInstance = existingComponent as T;
    } else {
      // TODO: not sure what to do here, for now we just let the component be
      //  re-created, which shows additional warnings
      console.error(
        'This refComponent does already exist as part of another parent',
        existingComponent.__instance.parent,
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore used before assigned - incorrect
  return refInstance;
}

export function refElement<T extends RefElementType = RefElementType>(
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
        try {
          element = (parent.querySelector<T>(`[data-ref="${this.ref}"]`) ?? null) as T | null;
        } catch (error) {
          if (error instanceof DOMException) {
            console.warn(`
[Error querying ref] The first argument of refElement should be the value of a data-ref in the DOM, not a querySelector.
If you want to select a custom target, pass a function like;

  refElement((parent) => parent.querySelector('${this.ref}'));
            `);
          }
          throw error;
        }
      }
      return ensureElementIsComponentChild(parent, element, ignoreGuard);
    },
    createRef(instance) {
      const elementRef = ref<T>();
      const getElement = (initial: boolean = false) => {
        // when ref is not provided, pick the component element itself
        const element = this.queryRef(instance.element as HTMLElement);

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

export function refCollection<T extends RefElementType = RefElementType>(
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
        try {
          elements = Array.from(parent.querySelectorAll<T>(`[data-ref="${refIdOrQuery}"]`));
        } catch (error) {
          if (error instanceof DOMException) {
            console.warn(`
[Error querying ref] The first argument of refElement should be the value of a data-ref in the DOM, not a querySelector.
If you want to select a custom target, pass a function like;

  refElement((parent) => parent.querySelector('${refIdOrQuery}'));
            `);
          }
          throw error;
        }
      }
      return elements.filter((element) =>
        Boolean(ensureElementIsComponentChild(parent, element, ignoreGuard)),
      );
    },
    createRef(instance) {
      const elementsRef = ref([]) as Ref<ReadonlyArray<Ref<T>>>;
      const getElements = () => {
        const elements = this.queryRef(instance.element as HTMLElement);
        if (elements.length < minimumItemsRequired) {
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
          );
        }

        return elements.map((e) => ref(e) as Ref<T>);
      };
      elementsRef.value = getElements();

      return {
        type: 'collection',
        getBindingDefinition(props) {
          return bindCollection(elementsRef, props);
        },
        getElements() {
          return elementsRef.value.map((ref) => unref(ref));
        },
        // elements: elementsRef.value,
        getRefs() {
          return elementsRef.value.map((elementRef) => {
            return {
              type: 'element',
              getBindingDefinition(props) {
                return bindElement(elementRef, props);
              },
              // TODO: this is currently not reactive, so is only correct in the setup function, not in async code or callbacks
              element: elementRef.value,
            };
          });
        },
        refreshRefs() {
          const elements = getElements();
          // only re-assign if some refs are actually different
          if (
            elements.length !== elementsRef.value.length ||
            !elements.every((elRef) =>
              elementsRef.value.some((oldRef) => oldRef.value === elRef.value),
            )
          ) {
            // first, "de-ref" the old array to trigger binding cleanup
            elementsRef.value.forEach((ref) => ((ref.value as any) = undefined));

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
        const element = this.queryRef(instance.element as HTMLElement);

        if (initialRender && isRequired && !element) {
          console.error('Component not found in DOM', getQuery());
        }

        if (element === instanceRef.value?.element) {
          return instanceRef.value;
        }
        if (element) {
          const newComponentFactory = (Array.isArray(component) ? component : [component]).find(
            (c) => c.displayName === element.dataset.component,
          );
          if (newComponentFactory) {
            let refInstance = getExistingGlobalRefComponent<ReturnType<T>>(element, instance);

            if (!refInstance) {
              // create new component instance
              // TODO: This component only gets "set up" when HTML is updated through `bindTemplate`.
              //  If not, this is just an empty component that doesn't do anything.
              //  Would be nice if we could improve this
              refInstance = newComponentFactory(element, { parent: instance }) as ReturnType<T>;
            }
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
      const instancesRef = ref([]) as Ref<ReadonlyArray<Ref<ReturnType<T>>>>;

      const getComponents = () => {
        const elements = this.queryRef(instance.element as HTMLElement);

        if (elements.length < minimumItemsRequired) {
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
          );
        }

        return elements.map((element) => {
          const existingInstance = instancesRef.value
            .map((instanceRef) => instanceRef.value.element)
            .indexOf(element);
          if (existingInstance === -1) {
            let refInstance = getExistingGlobalRefComponent<ReturnType<T>>(element, instance);

            if (!refInstance) {
              // create new component instance
              refInstance = component(element, { parent: instance }) as ReturnType<T>;
            }
            instance.children.push(refInstance);
            return ref(refInstance) as Ref<ReturnType<T>>;
          } else {
            return ref(instancesRef.value[existingInstance]) as Ref<ReturnType<T>>;
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
          return instancesRef.value.map((ref) => unref(ref));
        },
        getRefs() {
          return instancesRef.value.map((instanceRef) => {
            return {
              type: 'component',
              getBindingDefinition(props) {
                return BindComponent(instanceRef, props);
              },
              component: instanceRef.value,
            };
          }) as ReturnType<ComponentsRef<T>['getRefs']>;
        },
        refreshRefs() {
          const components = getComponents();
          // only re-assign if some refs are actually different
          if (
            components.length !== instancesRef.value.length ||
            !components.every((elRef) =>
              instancesRef.value.some((oldRef) => oldRef.value === elRef.value),
            )
          ) {
            // first, "de-ref" the old array to trigger binding cleanup
            instancesRef.value.forEach((ref) => ((ref.value as any) = undefined));

            instancesRef.value = components;
          }
        },
      };
    },
  };
}
