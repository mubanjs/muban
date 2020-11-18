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
} from './Component.types';
import { reactive, toRaw } from '@vue/runtime-core';
import EventEmitter from 'eventemitter3';
import type { ComponentRefItem } from './utils/refs/refDefinitions.types';

const componentStack: Array<any> = [];
function getCurrentComponentInstance() {
  // TODO validation
  return componentStack[componentStack.length - 1];
}

export const defineComponent = <
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>
>(
  options: DefineComponentOptions<P, R>,
): ComponentFactory<P> => {
  // TODO: this function doesn't expose the component name, which is something we might want
  return Object.assign(
    ((element) => {
      console.groupCollapsed(`[Create ${options.name}]`);
      const sources = [
        createClassListPropertySource(),
        createDataAttributePropertySource(),
        createJsonScriptPropertySource(),
        createReactivePropertySource(),
      ];

      const resolvedProps = getComponentProps(options.props, element, sources);
      const resolvedRefs = getComponentRefs(options?.refs, element);

      options.components?.forEach((component) => {
        Array.from(
          element.querySelectorAll<HTMLElement>(`[data-component="${component.displayName}"]`),
        )
          .filter(
            () => true,
            // TODO: only instantiate direct child components, never children of children
            // TODO: don't init components that have a matching ref above - fix type, add collection
            //typedObjectValues(resolvedRefs).every((ref) => ref.component.element !== componentElement),
          )
          .forEach((componentElement) => component(componentElement));
      });

      // Keep watching for DOM updates, and update elements whenever they become available or are removed
      // This should happen before applyBindings is called, since that can update the DOM
      if (Object.keys(resolvedRefs).length > 0) {
        const observer = new MutationObserver(() => {
          Object.values(resolvedRefs).forEach((refFn) =>
            // this cannot be correctly inferred
            refFn.refreshRefs(),
          );
        });
        observer.observe(element, { attributes: false, childList: true, subtree: true });
        // TODO: detect for own element DOM removal to auto-unmount?
      }

      const reactiveProps = reactive(resolvedProps);

      const lifecycle = {
        ee: new EventEmitter(),
        on(type: string, fn: () => void) {
          this.ee.on(type, fn);
        },
        mount() {
          console.log('[mount]', options.name);
          this.ee.emit('mount');
        },
        unmount() {
          console.groupCollapsed(`[Destroy ${options.name}]`);
          console.log('[unmount]', options.name);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          removeBindingMap?.forEach((binding) => binding?.());
          this.ee.emit('unmount');
          console.groupEnd();
        },
      };

      const observer = new MutationObserver((mutations) => {
        const removedNodes = mutations.flatMap((mutation) => Array.from(mutation.removedNodes));
        if (removedNodes.some((node) => node === element || node.contains(element))) {
          lifecycle.unmount();
        }
      });
      observer.observe(document, { attributes: false, childList: true, subtree: true });

      componentStack.push(lifecycle);
      const bindings = options.setup(reactiveProps as any, resolvedRefs, { element });
      componentStack.pop();

      const removeBindingMap = applyBindings(bindings);

      lifecycle.mount();

      console.groupEnd();
      return {
        get name() {
          return options.name;
        },
        setProps(props) {
          // console.log('new props', props);
          Object.entries(props).forEach(([name, value]) => {
            // todo check existence and validation
            reactiveProps[name] = value;
          });
        },
        get props() {
          return toRaw(reactiveProps);
        },
        get element() {
          return element;
        },
        dispose() {
          console.log('dispose');
          lifecycle.unmount();
          lifecycle.ee.removeAllListeners();
        },
      };
    }) as ComponentReturnValue<TypedProps<P>>,
    { displayName: options.name },
  );
};

export function onMount(fn: () => void) {
  const componentInstance = getCurrentComponentInstance();
  componentInstance.on('mount', () => {
    fn();
  });
}
export function onUnmount(fn: () => void) {
  const componentInstance = getCurrentComponentInstance();
  componentInstance.on('unmount', () => {
    fn();
  });
}
