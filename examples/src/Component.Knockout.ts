/* eslint-disable @typescript-eslint/no-explicit-any */

// export const bind = (node: Node, bindings: BindingAccessors | (() => BindingAccessors)) => {
//   applyBindingAccessorsToNode(node, bindings, {});
// };

import { applyBindingAccessorsToNode, applyBindingsToNode, cleanNode } from 'knockout';
import { Binding, ComponentFactory, DefineComponentOptions, getProps, getRefs } from './Component';

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
        cleanNode(element);
      },
    };
  };
};
