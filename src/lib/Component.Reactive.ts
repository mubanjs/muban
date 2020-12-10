/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyBindings } from './utils/bindings/applyBindings';
import { getComponentProps } from './utils/props/getComponentProps';
import type { PropTypeDefinition, TypedProps } from './utils/props/propDefinitions.types';
import { createClassListPropertySource } from './utils/props/property-sources/createClassListPropertySource';
import { getComponentRefs } from './utils/refs/getComponentRefs';
import { createDataAttributePropertySource } from './utils/props/property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './utils/props/property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './utils/props/property-sources/createReactivePropertySource';
import type {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
  InternalComponentInstance,
  LazyComponent,
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
    provides: {},
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
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      this.removeBindingsList?.forEach((binding) => binding?.());
      this.ee.emit('unmount');
      this.parent?.children.splice(
        this.parent?.children.findIndex((c) => c.element === this.element),
        1,
      );
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
      const sources = [
        createClassListPropertySource(),
        createDataAttributePropertySource(),
        createJsonScriptPropertySource(),
        createReactivePropertySource(),
      ];

      instance.props = getComponentProps(options.props, element, sources);
      instance.reactiveProps = reactive(instance.props);

      instance.refs = getComponentRefs(options?.refs, instance);

      instance.children.push(
        ...(Object.values(instance.refs).flatMap((refItem) => {
          if (refItem.type === 'component') {
            return refItem.component || [];
          }
          if (refItem.type === 'componentCollection') {
            return refItem.components || [];
          }
          return [];
        }) || []),
      );

      const lazyComponents =
        (options.components?.filter(
          (component) => !isComponentFactory(component),
        ) as Array<LazyComponent>) || [];

      Promise.all(lazyComponents.map((getComponent) => getComponent())).then((components) => {
        components.forEach((component) => {
          Array.from(
            element.querySelectorAll<HTMLElement>(`[data-component="${component.displayName}"]`),
          )
            .filter(
              () => true,
              // TODO: only instantiate direct child components, never children of children
              // TODO: don't init components that have a matching ref above - fix type, add collection
              //typedObjectValues(resolvedRefs).every((ref) => ref.component.element !== componentElement),
            )
            .forEach((componentElement) =>
              component(componentElement, { parent: instance }).setup(),
            );
        });
      });

      const syncComponents =
        (options.components?.filter((component) =>
          isComponentFactory(component),
        ) as Array<ComponentFactory>) ?? [];

      instance.children.push(
        ...(syncComponents.flatMap((component) =>
          Array.from(
            element.querySelectorAll<HTMLElement>(`[data-component="${component.displayName}"]`),
          )
            .filter(
              () => true,
              // TODO: only instantiate direct child components, never children of children
              // TODO: don't init components that have a matching ref above - fix type, add collection
              //typedObjectValues(resolvedRefs).every((ref) => ref.component.element !== componentElement),
            )
            .map((componentElement) => component(componentElement, { parent: instance })),
        ) || []),
      );

      // Keep watching for DOM updates, and update elements whenever they become available or are removed
      // This should happen before applyBindings is called, since that can update the DOM
      if (Object.keys(instance.refs).length > 0) {
        const observer = new MutationObserver(() => {
          Object.values(instance.refs).forEach((refFn) =>
            // this cannot be correctly inferred
            refFn.refreshRefs(),
          );
        });
        observer.observe(element, { attributes: false, childList: true, subtree: true });
        // TODO: should also work for the components Array
      }

      const observer = new MutationObserver((mutations) => {
        const removedNodes = mutations.flatMap((mutation) => Array.from(mutation.removedNodes));
        if (removedNodes.some((node) => node === element || node.contains(element))) {
          instance.unmount();
        }
      });
      observer.observe(document, { attributes: false, childList: true, subtree: true });

      if (!createOptions.parent) {
        setupComponent(instance);
      }
      console.groupEnd();

      return {
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
          return toRaw(instance.reactiveProps);
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
      };
    }) as ComponentReturnValue<TypedProps<P>>,
    { displayName: options.name },
  );
};

function setupComponent(instance: InternalComponentInstance) {
  // has been setup before
  if (instance.isSetup) {
    return;
  }

  currentInstance = instance;
  const bindings = instance.options.setup?.({
    props: instance.reactiveProps,
    refs: instance.refs,
    element: instance.element,
  });
  instance.isSetup = true;
  currentInstance = null;

  instance.children.forEach((component) => component.setup());

  instance.removeBindingsList = applyBindings(bindings, instance);

  instance.mount();
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

function isComponentFactory(component: any): component is ComponentFactory {
  return 'displayName' in component;
}
