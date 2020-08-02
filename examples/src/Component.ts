/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyBindingAccessorsToNode, applyBindingsToNode, cleanNode } from 'knockout';
import { BindProps } from './JSX';

export type ComponentFactory<T extends HTMLElement = HTMLElement> = (
  element: T,
) => {
  setProps: (props: Record<string, unknown>) => void;
  dispose: () => void;
};

type Binding = BindProps;

type DefineComponentOptions<T extends HTMLElement> = {
  name: string;
  props?: Record<string, any>;
  refs?: Record<string, string>;
  setup: (
    props: Record<string, unknown>,
    refs: Record<string, HTMLElement>,
    context: { element: T },
  ) => Array<Binding>;
};

// export const bind = (node: Node, bindings: BindingAccessors | (() => BindingAccessors)) => {
//   applyBindingAccessorsToNode(node, bindings, {});
// };

const eventBindings = ['click'];

const applyBindings = (bindings: Array<Binding>) => {
  bindings.forEach((b) => {
    const { ref, ...props } = b;

    const bindingProps = Object.entries(props)
      .filter(([key]) => eventBindings.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);
    applyBindingsToNode(ref, bindingProps, {});

    const bindingAccessorProps = Object.entries(props)
      .filter(([key]) => !eventBindings.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>);
    applyBindingAccessorsToNode(ref, bindingAccessorProps, {});
  });
};

export const defineComponent = <T extends HTMLElement>(
  options: DefineComponentOptions<T>,
): ComponentFactory<T> => {
  return (element) => {
    const resolvedProps =
      Object.entries(options.props).reduce((accumulator, [propName, propType]) => {
        const value = element.dataset[propName];
        accumulator[propName] = [Boolean, Number].includes(propType) ? JSON.parse(value) : value;
        return accumulator;
      }, {} as Record<string, any>) ?? {};

    const resolvedRefs =
      Object.entries(options.refs).reduce((accumulator, [propName, selector]) => {
        accumulator[propName] = element.querySelector(`[data-ref="${selector}"]`);
        return accumulator;
      }, {} as Record<string, any>) ?? {};

    const bindings = options.setup(resolvedProps, resolvedRefs, { element });

    applyBindings(bindings);

    return {
      setProps(props) {
        console.log('new props', props);
      },
      dispose() {
        console.log('dispose');
        cleanNode(element);
      },
    };
  };
};
