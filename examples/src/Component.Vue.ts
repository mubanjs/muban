/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
  getProps,
  getRefs,
} from './Component';
// TODO: not sure how much vue-specific stuff gets included in the bundle by this
import { reactive, unref, watchEffect } from '@vue/runtime-core';
import { Binding, BindProps } from './JSX.Reactive';
import typedObjectEntries from './type-utils/typedObjectEntries';

type BindingMap<T> = { [P in keyof T]: (target: HTMLElement, value: T[P]) => void };
// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types
const bindingsMap: BindingMap<Omit<BindProps<any>, 'ref'>> = {
  click: (target, fn) => {
    target.addEventListener('click', fn);
  },
  text: (target, value) => {
    watchEffect(() => (target.innerText = unref(value)));
  },
  style: (target, value) => {
    watchEffect(() => {
      const styles = unref(value);
      Object.entries(styles).forEach(([name, value]) => {
        target.style[name as any] = value as string;
      });
    });
  },
};

const applyBindings = (bindings: Array<Binding> | null | undefined) => {
  if (bindings) {
    bindings.forEach((binding) => {
      if (binding.type === 'element') {
        const { ref, ...bindingProps } = binding.props;

        typedObjectEntries(bindingProps).forEach(([bindingName, bindingValue]) => {
          if (bindingName in bindingsMap) {
            bindingsMap[bindingName](ref, bindingValue as any);
          } else {
            console.warn(`No binding for "${bindingName}`);
          }
        });
      } else if (binding.type === 'collection') {
        const { ref: refs, ...bindingProps } = binding.props;

        typedObjectEntries(bindingProps).forEach(([bindingName, bindingValue]) => {
          if (bindingName in bindingsMap) {
            refs.forEach((ref) => {
              bindingsMap[bindingName](ref, bindingValue as any);
            });
          } else {
            console.warn(`No binding for "${bindingName}`);
          }
        });
      } else if (binding.type === 'component') {
        const { ref, ...componentProps } = binding.props;
        typedObjectEntries(componentProps).forEach(([propName, bindingValue]) => {
          watchEffect(() => {
            console.log('update prop', propName);
            // TODO prop validation
            ref.setProps({
              [propName]: unref(bindingValue),
            });
          });
        });
      }
    });
  }
};

export const defineComponent = <P extends Record<string, any>, R extends Record<string, any>>(
  options: DefineComponentOptions<P, R>,
): ComponentFactory<P> => {
  // TODO: this function doesn't expose the component name, which is something we might want
  return Object.assign(
    ((element) => {
      const resolvedProps = getProps(options.props, element);
      const resolvedRefs = getRefs(options.refs, element);

      const reactiveProps = reactive(resolvedProps);

      const bindings = options.setup(reactiveProps as any, resolvedRefs as any, { element });
      console.log('bindings', bindings);

      applyBindings(bindings);

      return {
        name: options.name,
        setProps(props) {
          console.log('new props', props);
          Object.entries(props).forEach(([name, value]) => {
            // todo check existence and validation
            reactiveProps[name] = value;
          });
        },
        dispose() {
          console.log('dispose');
        },
      };
    }) as ComponentReturnValue<P>,
    { displayName: options.name },
  );
};
