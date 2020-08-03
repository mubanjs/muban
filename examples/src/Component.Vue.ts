/* eslint-disable @typescript-eslint/no-explicit-any */
import { Binding, ComponentFactory, DefineComponentOptions, getProps, getRefs } from './Component';
// TODO: not sure how much vue-specific stuff gets included in the bundle by this
import { watchEffect } from '@vue/runtime-core';

// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types
const bindingsMap: Record<string, Function> = {
  click: (target: HTMLElement, fn: any) => {
    target.addEventListener('click', fn);
  },
  text: (target: HTMLElement, fn: any) => {
    watchEffect(() => (target.innerText = fn()));
  },
  style: (target: HTMLElement, fn: any) => {
    watchEffect(() => {
      const styles = fn();
      Object.entries(styles).forEach(([name, value]) => {
        target.style[name as any] = value as string;
      });
    });
  },
};

const applyBindings = (bindings: Array<Binding>) => {
  bindings.forEach((b) => {
    const { ref, ...props } = b;

    Object.entries(props).forEach(([bindingName, bindingFn]) => {
      if (bindingName in bindingsMap) {
        bindingsMap[bindingName](ref, bindingFn);
      } else {
        console.warn(`No binding for "${bindingName}`);
      }
    });
  });
};

export const defineComponent = <T extends HTMLElement>(
  options: DefineComponentOptions<T>,
): ComponentFactory<T> => {
  return (element) => {
    const resolvedProps = getProps(options.props, element);
    const resolvedRefs = getRefs(options.refs, element);

    const bindings = options.setup(resolvedProps, resolvedRefs, { element });

    applyBindings(bindings);

    return {
      setProps(props) {
        console.log('new props', props);
      },
      dispose() {
        console.log('dispose');
      },
    };
  };
};
