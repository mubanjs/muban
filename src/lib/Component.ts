/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ComponentCreateOptions,
  InternalNodeInstance,
  LazyComponent,
} from './Component.types';
import { createAppContext } from './api/apiCreateApp';
import { applyBindings } from './bindings/applyBindings';
import type { Binding } from './bindings/bindings.types';
import {
  devtoolsComponentAdded,
  devtoolsComponentRemoved,
  devtoolsComponentUpdated,
} from './utils/devtools';
import { getDirectChildComponents } from './utils/domUtils';
import {
  getComponentForElement,
  getGlobalMubanInstance,
  initGlobalComponents,
  registerComponentForElement,
  setComponentElementLoadingState,
} from './utils/global';
import { isLazyComponent } from './api/apiLazy';
import { LifecycleHooks } from './api/apiLifecycle';
import { getComponentProps } from './props/getComponentProps';
import type { PropTypeDefinition, TypedProps } from './props/propDefinitions.types';
import { createComponentRefs } from './refs/createComponentRefs';
import type {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
  InternalComponentInstance,
} from './Component.types';
import { reactive, toRaw, watchEffect, readonly } from '@vue/runtime-core';
import type { ComponentRefItem } from './refs/refDefinitions.types';
import { recursiveUnref } from './utils/utils';

let currentInstance: InternalComponentInstance | null = null;

export function getCurrentComponentInstance(): InternalComponentInstance | null {
  return currentInstance;
}
export function setCurrentComponentInstance(instance: InternalComponentInstance | null): void {
  currentInstance = instance;
}

let componentId = 0;

const emptyAppContext = createAppContext();

export function createComponentInstance(
  createOptions: ComponentCreateOptions,
  element: HTMLElement,
  options: DefineComponentOptions<any, any, string>,
): InternalComponentInstance {
  const parent = createOptions.parent;
  const appContext = createOptions.app?._context ?? parent?.appContext ?? emptyAppContext;

  const instance: InternalComponentInstance = {
    uid: componentId++,
    type: 'component',
    name: options.name,
    parent: parent ?? null,
    appContext,
    element,
    api: null,
    subTree: [],
    props: {},
    reactiveProps: reactive({}),
    refs: {} as any,
    // Always create an inherited clone to allow setting context values
    // It differs from Vue because of the component and setup creation order
    provides: Object.create(parent?.provides ?? Object.create(appContext.provides)),
    options,
    bindings: [],
    children: [],
    refChildren: [],
    removeBindingsList: [],
    mount() {
      // console.log('[mount]', options.name);
      this[LifecycleHooks.Mounted]?.forEach((hook) => hook());
      // this.ee.emit('mount');
      this.isMounted = true;
      devtoolsComponentAdded(this);
    },
    unmount() {
      // console.log('[unmount]', options.name);
      this.removeBindingsList?.forEach((binding) => binding?.());
      this[LifecycleHooks.Unmounted]?.forEach((hook) => hook());

      // unregister itself from its parent
      this.parent?.children.splice(
        this.parent?.children.findIndex((c) => c.element === this.element),
        1,
      );
      this.parent?.subTree.splice(
        this.parent?.subTree.findIndex((c) => c.element === this.element),
        1,
      );
      this.isUnmounted = true;
      devtoolsComponentRemoved(this);
    },

    // lifecycle hooks
    // not using enums here because it results in computed properties
    isSetup: false,
    isMounted: false,
    isUnmounted: false,
    // isDeactivated: false,
    m: null,
    um: null,
  };
  if (parent) {
    parent.subTree.push(instance);
  }

  return instance;
}

export const defineComponent = <
  R extends Record<string, ComponentRefItem>,
  N extends string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends Record<string, PropTypeDefinition> = {}
>(
  options: DefineComponentOptions<P, R, N>,
): ComponentFactory<P, N> => {
  // TODO: this function doesn't expose the component name, which is something we might want
  return Object.assign(
    ((element, createOptions = {}) => {
      if (!element) {
        throw new Error(`No element found for component "${options.name}"`);
      }

      const instance = createComponentInstance(createOptions, element, options);

      // TODO: Devtools only
      if (typeof (element as any).__mubanInstance === 'undefined') {
        // TODO: an element can be part of multiple parent refs
        Object.defineProperty(element, '__mubanInstance', {
          value: instance,
          enumerable: false,
        });
      } else {
        // console.error(
        //   `This element is already initialized for another component:`,
        //   (element as any).__mubanInstance.name,
        //   element,
        //   (element as any).__mubanInstance,
        // );
      }

      // console.log(`[Create ${options.name}]`);

      // retrieve and create refs, will instantiate child components
      instance.refs = createComponentRefs(options?.refs, instance);

      // process props
      const sources = getGlobalMubanInstance().propertySources;
      instance.props = getComponentProps(options.props, element, sources, instance.refs);
      instance.reactiveProps = reactive(instance.props);

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
            if (!(name in (instance.options.props ?? {}))) {
              console.warn(
                `Prop "${name}" does not exist on component "${
                  instance.name
                }", only supported props are [${Object.keys(instance.options.props ?? {})}]`,
              );
            } else {
              instance.reactiveProps[name] = value;
            }
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
          // console.log('dispose');
          instance.unmount();
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __instance: instance,
      };

      instance.api = componentApiInstance;
      registerComponentForElement(instance.element as HTMLElement, componentApiInstance);

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
  // TODO: only add this once
  documentObserver.observe(document, { attributes: false, childList: true, subtree: true });
}

/**
 * Retrieve all child [data-component] elements, and filter them to exclude "nested" components.
 * @param instance
 */
function processNonRefChildComponents(instance: InternalComponentInstance) {
  // get all direct child data-component elements to see what we need to load and/or instantiate
  getDirectChildComponents(instance.element as HTMLElement).forEach((childElement) =>
    instantiateChildComponent(instance, childElement),
  );

  queueMicrotask(() => {
    // init globally registered components for anything that's not picked up in this component
    initGlobalComponents(instance.element as HTMLElement);
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
  // console.log('[setup]', instance.options.name);
  const bindings = instance.options.setup?.({
    props: readonly(instance.reactiveProps) as any,
    refs: instance.refs,
    element: instance.element as HTMLElement,
  });
  instance.bindings = bindings || [];

  // TODO: Devtools only
  instance.refChildren =
    bindings?.map((binding) => createRefComponentInstance(instance, binding)) || [];

  instance.isSetup = true;
  currentInstance = null;

  instance.children.forEach((component) => component.setup());

  instance.removeBindingsList = applyBindings(bindings, instance);

  instance.mount();

  // console.log('[/Create]');
}

// filter out
// - empty refs/collections, as they don't have any current effect
// - bindings that also apply on "self" or any "child components"
// - so this will only show pure refs
function shouldRefInstanceBeIncludedInSubtree(
  instance: InternalComponentInstance,
  component: InternalNodeInstance,
): boolean {
  const elements = component.binding?.getElements() || [];
  return (
    elements.length > 0 &&
    [instance, ...instance.children].every((child) => !elements.includes(child.element))
  );
}

/**
 * Create a "component instance" for all ref-bindings that exist in this component
 * These are showed in devtools as "grey nodes" with their bindings and the "owner" component
 * @param instance
 * @param binding
 */
function createRefComponentInstance(
  instance: InternalComponentInstance,
  binding: Binding,
): InternalNodeInstance {
  // TODO: if devtools
  const refInstance = {
    uid: componentId++,
    type: 'ref' as const,
    get name() {
      return binding.getElements()[0]?.dataset.ref ?? '[unknown]';
    },
    parent: instance,
    appContext: instance.appContext,
    get element() {
      return binding.getElements()[0];
    },
    binding: binding,
  };

  // update devtools if the DOM changes and bindings become (in)active
  watchEffect(() => {
    const elements = binding.getElements();
    if (elements.length === 0) {
      const index = instance.subTree.indexOf(refInstance);
      if (index !== -1) {
        instance.subTree.splice(index, 1);
        devtoolsComponentRemoved(refInstance);
      }
      // remove from subTree
    } else {
      // add to subTree
      if (
        shouldRefInstanceBeIncludedInSubtree(instance, refInstance) &&
        !instance.subTree.includes(refInstance)
      ) {
        instance.subTree.push(refInstance);
        devtoolsComponentAdded(refInstance);
      }
    }
  });

  // update devtools if any of the reactive binding values update
  watchEffect(() => {
    // "trigger" all observables for this binding by unwrapping it
    recursiveUnref(binding.props);

    // only trigger if this ref is relevant at this point
    if (shouldRefInstanceBeIncludedInSubtree(instance, refInstance)) {
      devtoolsComponentUpdated(refInstance);
    }
  });

  return refInstance;
}
