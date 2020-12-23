/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LazyComponent } from './Component.types';
import { applyBindings } from './utils/bindings/applyBindings';
import { getDirectChildComponents } from './utils/getDirectChildComponents';
import {
  getComponentForElement,
  getGlobalMubanInstance,
  initGlobalComponents,
  registerComponentForElement,
  setComponentElementLoadingState,
} from './utils/global';
import { isLazyComponent } from './utils/lazy';
import { getComponentProps } from './utils/props/getComponentProps';
import type { PropTypeDefinition, TypedProps } from './utils/props/propDefinitions.types';
import { createClassListPropertySource } from './utils/props/property-sources/createClassListPropertySource';
import { createComponentRefs } from './utils/refs/createComponentRefs';
import { createDataAttributePropertySource } from './utils/props/property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './utils/props/property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './utils/props/property-sources/createReactivePropertySource';
import type {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
  InternalComponentInstance,
} from './Component.types';
import { reactive, toRaw } from '@vue/runtime-core';
import EventEmitter from 'eventemitter3';
import type { ComponentRefItem } from './utils/refs/refDefinitions.types';

let currentInstance: InternalComponentInstance | null;

export function getCurrentComponentInstance(): InternalComponentInstance | null {
  // TODO validation
  return currentInstance;
}

export function createComponentInstance(
  parent: InternalComponentInstance | undefined,
  element: HTMLElement,
  options: DefineComponentOptions<any, any, string>,
): InternalComponentInstance {
  return {
    parent: parent ?? null,
    element,
    props: {},
    reactiveProps: reactive({}),
    refs: {} as any,
    provides: parent?.provides || {},
    options,
    children: [],
    removeBindingsList: [],
    isSetup: false,
    isMounted: false,
    isUnmounted: false,
    ee: new EventEmitter(),
    on(type: string, fn: () => void) {
      this.ee.on(type, fn);
    },
    mount() {
      console.log('[mount]', options.name);
      this.ee.emit('mount');
      this.isMounted = true;
    },
    unmount() {
      console.group(`[Destroy ${options.name}]`);
      console.log('[unmount]', options.name);
      this.removeBindingsList?.forEach((binding) => binding?.());
      this.ee.emit('unmount');

      // unregister itself from its parent
      this.parent?.children.splice(
        this.parent?.children.findIndex((c) => c.element === this.element),
        1,
      );
      console.log('[/Destroy]');
      console.groupEnd();
      this.isUnmounted = true;
    },
  };
}

export const defineComponent = <
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>,
  N extends string
>(
  options: DefineComponentOptions<P, R, N>,
): ComponentFactory<P, N> => {
  // TODO: this function doesn't expose the component name, which is something we might want
  return Object.assign(
    ((element, createOptions = {}) => {
      if (!element) {
        throw new Error(`No element found for component "${options.name}"`);
      }

      const instance = createComponentInstance(createOptions.parent, element, options);

      console.group(`[Create ${options.name}]`);

      // process props
      const sources = getGlobalMubanInstance().propertySources;
      instance.props = getComponentProps(options.props, element, sources);
      instance.reactiveProps = reactive(instance.props);

      // retrieve and create refs, will instantiate child components
      instance.refs = createComponentRefs(options?.refs, instance);

      // this will instantiate all registered "components" that are non-refs
      processNonRefChildComponents(instance);

      // listen for DOM removal and child component DOM updates
      createObservers(instance);

      // only initialize itself when it's a "root" component
      // otherwise it's initialized by its parent
      if (!createOptions.parent) {
        setupComponent(instance);
      }

      const componentApiInstance: ReturnType<ComponentReturnValue<TypedProps<P>>> = {
        get name() {
          return options.name as any;
        },
        setProps(props) {
          // console.log('new props', props);
          Object.entries(props).forEach(([name, value]) => {
            // todo check existence and validation
            instance.reactiveProps[name] = value;
          });
        },
        get props() {
          return toRaw(instance.reactiveProps) as any;
        },
        get element() {
          return element;
        },
        setup() {
          setupComponent(instance);
        },
        dispose() {
          console.log('dispose');
          instance.unmount();
          instance.ee.removeAllListeners();
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __instance: instance,
      };

      registerComponentForElement(instance.element, componentApiInstance);

      return componentApiInstance;
    }) as ComponentReturnValue<TypedProps<P>>,
    { displayName: options.name },
  );
};

/**
 * Create MutationObservers for:
 * - the document to detect the deletion of this component
 * - this element to detect new "child component elements" that need to be created
 * @param instance
 */
function createObservers(instance: InternalComponentInstance) {
  // Keep watching for DOM updates, and update elements whenever they become available or are removed
  // This should happen before applyBindings is called, since that can update the DOM
  const elementObserver = new MutationObserver(() => {
    // check refs
    Object.values(instance.refs).forEach((refFn) => refFn.refreshRefs());
    // check non-ref components
    processNonRefChildComponents(instance);
  });
  elementObserver.observe(instance.element, { attributes: false, childList: true, subtree: true });

  // each component will detect its own DOM removal and unmount itself
  const documentObserver = new MutationObserver((mutations) => {
    const removedNodes = mutations.flatMap((mutation) => Array.from(mutation.removedNodes));
    if (removedNodes.some((node) => node === instance.element || node.contains(instance.element))) {
      instance.unmount();
    }
  });
  documentObserver.observe(document, { attributes: false, childList: true, subtree: true });
}

/**
 * Retrieve all child [data-component] elements, and filter them to exclude "nested" components.
 * @param instance
 */
function processNonRefChildComponents(instance: InternalComponentInstance) {
  // get all direct child data-component elements to see what we need to load and/or instantiate
  getDirectChildComponents(instance.element).forEach((childElement) =>
    instantiateChildComponent(instance, childElement),
  );

  queueMicrotask(() => {
    // init globally registered components for anything that's not picked up in this component
    initGlobalComponents(instance.element);
  });
}

/**
 * Instantiate a child component if a list of conditions are met:
 * - it doesn't already have an instance on that element
 * - it isn't already created as part of a explicit refComponent
 * @param instance
 * @param element
 */
export function instantiateChildComponent(
  instance: InternalComponentInstance,
  element: HTMLElement,
): void {
  // ignore if already part of current registered children
  // with this in place, we can also call this function after DOM updates
  if (!!getComponentForElement(element)) {
    return;
  }

  const initComponent = (
    component: ComponentFactory | LazyComponent,
    componentElement: HTMLElement,
  ) => {
    if (isLazyComponent(component)) {
      setComponentElementLoadingState(componentElement, true);
      component().then((factory) => {
        if (!getComponentForElement(componentElement)) {
          const childInstance = factory(componentElement, { parent: instance });

          // since this is async, we'll set this up as soon as it's loaded
          // which is later than anything else anyway
          childInstance.setup();
          instance.children.push(childInstance);
          setComponentElementLoadingState(componentElement, false);
        }
      });
    } else {
      if (!getComponentForElement(componentElement)) {
        const childInstance = component(componentElement, { parent: instance });

        // this will be "setup" later with the other ref-components
        instance.children.push(childInstance);
      }
    }
  };

  // check locally or globally registered components
  const componentName = element.dataset.component;
  const factory = instance.options.components?.find(
    (component) => component.displayName === componentName,
  );

  if (factory) {
    initComponent(factory, element);
  }
}

/**
 * The "setup" phase of a component is split up to allow correct timing between
 * "creation" and "setup" when dealing with parent/child components and refs
 *
 * This will:
 * - call the setup function of this component
 * - call the setup function of all the child components (except the lazy loaded ones)
 *    - which applies bindings of child components
 * - apply all bindings of this component
 * - call the mount hook (after everything for itself and its children are finished)
 *
 * @param instance
 */
function setupComponent(instance: InternalComponentInstance) {
  // has been setup before
  if (instance.isSetup) {
    return;
  }

  currentInstance = instance;
  console.group('[setup]', instance.options.name);
  const bindings = instance.options.setup?.({
    props: instance.reactiveProps,
    refs: instance.refs,
    element: instance.element,
  });
  instance.isSetup = true;
  currentInstance = null;
  console.groupEnd();

  instance.children.forEach((component) => component.setup());

  instance.removeBindingsList = applyBindings(bindings, instance);

  instance.mount();

  console.log('[/Create]');
  console.groupEnd();
}

export function onMount(fn: () => void) {
  const componentInstance = getCurrentComponentInstance();
  if (!componentInstance) {
    console.error(`onMount() can only be used inside setup().`);
    return;
  }
  componentInstance.on('mount', () => {
    fn();
  });
}
export function onUnmount(fn: () => void) {
  const componentInstance = getCurrentComponentInstance();
  if (!componentInstance) {
    console.error(`onUnmount() can only be used inside setup().`);
    return;
  }
  componentInstance.on('unmount', () => {
    fn();
  });
}
