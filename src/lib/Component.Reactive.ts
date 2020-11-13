/* eslint-disable @typescript-eslint/no-explicit-any */
import typedObjectValues from '../../examples/src/type-utils/typedObjectValues';
import { applyBindings } from './utils/bindings/applyBindings';
import { getComponentProps } from './utils/props/getComponentProps';
import type { PropTypeDefinition, TypedProps } from './utils/props/propDefinitions.types';
import { getComponentRefs } from './utils/refs/getComponentRefs';
import { createDataAttributePropertySource } from './utils/props/property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './utils/props/property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './utils/props/property-sources/createReactivePropertySource';
import type {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
} from './Component.types';
// TODO: not sure how much vue-specific stuff gets included in the bundle by this
import { reactive, toRaw } from '@vue/runtime-core';
import EventEmitter from 'eventemitter3';
import type { ElementRef } from './utils/refs/refDefinitions.types';
import type { ComponentRefItem } from './utils/refs/refDefinitions.types';

// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types

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
        createDataAttributePropertySource(),
        createJsonScriptPropertySource(),
        createReactivePropertySource(),
      ];

      const resolvedProps = getComponentProps(options.props, element, sources);
      const resolvedRefs = getComponentRefs(options?.refs, element);

      // Keep watching for DOM updates, and update elements whenever they become available or are removed
      // This should happen before applyBindings is called, since that can update the DOM
      if (Object.keys(resolvedRefs).length > 0) {
        const observer = new MutationObserver(() => {
          typedObjectValues(resolvedRefs).forEach((refFn) =>
            // this cannot be correctly inferred
            (refFn as ElementRef<HTMLElement>).refreshRefs(),
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
      console.log('removeBindingMap', removeBindingMap);

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
            console.log('[set prop]', name, value);
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
