/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types,no-console,max-lines */

// see https://github.com/vuejs/vue-next/blob/ca8276d1fa01c06fd63394a2c0d572581618ae3d/packages/reactivity/src/ref.ts#L184-L201
import type { Ref } from '@vue/reactivity';
import { ref, unref } from '@vue/reactivity';
import type { ComponentApi, ComponentFactory, InternalComponentInstance } from '../Component.types';
import {
  bindCollection,
  BindComponent,
  bindComponentCollection,
  bindElement,
} from '../bindings/bindingDefinitions';
import { getParentComponentElement } from '../utils/domUtils';
import {
  getComponentForElement,
  getComponentForElementRef,
  registerComponentForElementRef,
} from '../utils/global';
import type {
  RefElementType,
  ComponentRefItemCollection,
  ComponentRefItemComponent,
  ComponentRefItemComponentCollection,
  ComponentRefItemElement,
  ComponentsRef,
  RefOptions,
} from './refDefinitions.types';

declare module '@vue/reactivity' {
  export interface RefUnwrapBailTypes {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    runtimeDOMBailTypes: Node | Window | HTMLElement;
  }
}

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
      throw new Error(
        `This refComponent does already exist as part of another parent
        ${existingComponent.__instance.parent}`,
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore used before assigned - incorrect
  return refInstance;
}

function getExistingGlobalRefElement(element: RefElementType) {
  const existingComponent = getComponentForElementRef(element);
  if (existingComponent) {
    throw new Error(
      `This refElement does already exist as part of another parent
      ${existingComponent}`,
    );
  }
}

export function refElement<T extends RefElementType = HTMLElement>(
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

      if (typeof refIdOrQuery === 'function') {
        const element: T | null = refIdOrQuery(parent);
        return ensureElementIsComponentChild(parent, element, ignoreGuard);
      }
      try {
        const elementList = parent.querySelectorAll<T>(`[data-ref="${this.ref}"]`);

        return (
          Array.from(elementList).find((elementInList) =>
            ensureElementIsComponentChild(parent, elementInList, ignoreGuard),
          ) || null
        );
      } catch (error) {
        if (error instanceof DOMException) {
          // eslint-disable-next-line no-console
          console.warn(`
[Error querying ref] The first argument of refElement should be the value of a data-ref in the DOM, not a querySelector.
If you want to select a custom target, pass a function like;

  refElement((parent) => parent.querySelector('${this.ref}'));
            `);
        }
        throw error;
      }
    },
    createRef(instance) {
      const elementRef = ref<T>();
      const getElement = (initial: boolean = false) => {
        // when ref is not provided, pick the component element itself
        const element = this.queryRef(instance.element as HTMLElement);

        if (isRequired && !element && (initial || elementRef.value !== element)) {
          // eslint-disable-next-line no-console
          console.error('Element not found', this.ref, instance);
        }
        return element;
      };
      elementRef.value = getElement(true) ?? undefined;

      if (elementRef.value && instance) {
        getExistingGlobalRefElement(elementRef.value);
        registerComponentForElementRef(elementRef.value, instance);
      }

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

export function refCollection<T extends RefElementType = HTMLElement>(
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
            // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
            instance,
          );
        }

        return elements.map((element) => ref(element) as Ref<T>);
      };
      elementsRef.value = getElements();

      return {
        type: 'collection',
        getBindingDefinition(props) {
          return bindCollection(elementsRef, props);
        },
        getElements() {
          return elementsRef.value.map((refItem) => unref(refItem));
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
            !elements.every((elementRef) =>
              elementsRef.value.some((oldRef) => oldRef.value === elementRef.value),
            )
          ) {
            // first, "de-ref" the old array to trigger binding cleanup
            elementsRef.value.forEach((refItem) => {
              // but only if it doesn't exist in the new array
              if (!elements.includes(refItem)) {
                // eslint-disable-next-line no-param-reassign
                (refItem as any).value = undefined;
              }
            });

            elementsRef.value = elements;
          }
        },
      };
    },
  };
}

export function refComponent<T extends ComponentFactory<any>>(
  component: T | ReadonlyArray<T>,
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
        const elementList = parent.querySelectorAll<HTMLElement>(getQuery());

        element =
          Array.from(elementList).find((elementInList) =>
            ensureElementIsComponentChild(parent, elementInList, ignoreGuard),
          ) || null;
      }
      if (element && !components.some((c) => c.displayName === element?.dataset.component)) {
        console.error(
          `[refComponent] Selected element that doesn't match any of the passed components`,
          element,
          components.map((c) => c.displayName),
        );
        return null;
      }
      return ensureElementIsComponentChild(parent, element, ignoreGuard);
    },
    createRef(instance) {
      const instanceRef = ref() as Ref<ReturnType<T> | undefined>;

      // eslint-disable-next-line consistent-return
      const getComponent = (initialRender: boolean = false) => {
        const element = this.queryRef(instance.element as HTMLElement);

        if (initialRender && isRequired && !element) {
          // eslint-disable-next-line no-console
          console.error('Component not found in DOM', getQuery(), instance);
        }

        // return if instance was already created for this element
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
  component: T | ReadonlyArray<T>,
  {
    ref: refIdOrQuery,
    minimumItemsRequired = 0,
    ignoreGuard,
  }: RefOptions<{
    ref?: string | ComponentRefItemComponentCollection<T>['queryRef'];
    minimumItemsRequired?: number;
  }> = {},
): ComponentRefItemComponentCollection<T> {
  const components = Array.isArray(component) ? component : [component];
  const getQuery = () => {
    return refIdOrQuery
      ? `[data-ref="${refIdOrQuery}"]`
      : components.map((c) => `[data-component="${c.displayName}"]`).join(', ');
  };
  return {
    ref: typeof refIdOrQuery === 'function' ? '[custom]' : refIdOrQuery,
    componentRef: components[0].displayName,
    type: 'componentCollection',
    queryRef(parent) {
      let elements: Array<HTMLElement>;
      if (typeof refIdOrQuery === 'function') {
        elements = refIdOrQuery(parent);
      } else {
        elements = Array.from(parent.querySelectorAll(getQuery()));
      }

      return elements
        .filter((element) => Boolean(ensureElementIsComponentChild(parent, element, ignoreGuard)))
        .filter((element) => {
          if (!components.some((c) => c.displayName === element?.dataset.component)) {
            // eslint-disable-next-line no-console
            console.error(
              `[refComponent] Selected element that doesn't match any of the passed components`,
              element,
              components.map((c) => c.displayName),
            );
            return false;
          }
          return true;
        });
    },
    createRef(instance) {
      const instancesRef = ref([]) as Ref<ReadonlyArray<Ref<ReturnType<T>>>>;

      const getComponents = () => {
        const elements = this.queryRef(instance.element as HTMLElement);

        if (elements.length < minimumItemsRequired) {
          // eslint-disable-next-line no-console
          console.error(
            `Expected at least "${minimumItemsRequired}" elements, but found "${elements.length}"`,
            `[data-ref="${this.ref}"]`,
            instance
          );
        }

        return elements.map((element) => {
          const existingInstance = instancesRef.value
            .map((instanceRef) => instanceRef.value.element)
            .indexOf(element);
          if (existingInstance === -1) {
            const newComponentFactory = (Array.isArray(component) ? component : [component]).find(
              (c) => c.displayName === element.dataset.component,
            );
            if (newComponentFactory) {
              let refInstance = getExistingGlobalRefComponent<ReturnType<T>>(element, instance);

              if (!refInstance) {
                // create new component instance
                refInstance = newComponentFactory(element, { parent: instance }) as ReturnType<T>;
              }
              instance.children.push(refInstance);
              return ref(refInstance) as Ref<ReturnType<T>>;
            }
          }
          return instancesRef.value[existingInstance];
        });
      };

      instancesRef.value = getComponents();

      return {
        type: 'componentCollection',
        getBindingDefinition(props) {
          return bindComponentCollection(instancesRef, props);
        },
        getComponents() {
          return instancesRef.value.map((refItem) => unref(refItem));
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
          // eslint-disable-next-line no-shadow
          const components = getComponents();
          // only re-assign if some refs are actually different
          if (
            components.length !== instancesRef.value.length ||
            !components.every((elementRef) =>
              instancesRef.value.some((oldRef) => oldRef.value === elementRef.value),
            )
          ) {
            // first, "de-ref" the old array to trigger binding cleanup
            instancesRef.value.forEach((refItem) => {
              // but only if it doesn't exist in the new array
              if (!components.includes(refItem)) {
                // eslint-disable-next-line no-param-reassign
                (refItem as any).value = undefined;
              }
            });

            instancesRef.value = components;
          }
        },
      };
    },
  };
}
