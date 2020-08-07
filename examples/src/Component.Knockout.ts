/* eslint-disable @typescript-eslint/no-explicit-any */

// export const bind = (node: Node, bindings: BindingAccessors | (() => BindingAccessors)) => {
//   applyBindingAccessorsToNode(node, bindings, {});
// };

import { applyBindingAccessorsToNode, applyBindingsToNode, cleanNode } from 'knockout';
import {
  ComponentFactory,
  ComponentReturnValue,
  DefineComponentOptions,
  getProps,
  refElement,
} from './Component';
import type { Binding } from './JSX.Reactive';
import typedObjectEntries from './type-utils/typedObjectEntries';

export function getRefs<T extends HTMLElement, R extends Record<string, any>>(
  refs: R | undefined,
  element: T,
): any {
  return (
    (refs &&
      typedObjectEntries(refs).reduce((accumulator, [propName, selector]) => {
        (accumulator as any)[propName] = (typeof selector === 'string'
          ? refElement(selector)
          : selector
        ).selector(element);
        return accumulator;
      }, {} as any)) ??
    {}
  );
}

const eventBindings = ['click'];

const applyBindings = (bindings: Array<Binding> | undefined | null) => {
  bindings &&
    bindings.forEach((b) => {
      if (b.type === 'element') {
        const { ref, ...props } = b.props;

        const bindingProps = Object.entries(props)
          .filter(([key]) => eventBindings.includes(key))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as Record<string, any>);
        if (ref) applyBindingsToNode(ref, bindingProps, {});

        const bindingAccessorProps = Object.entries(props)
          .filter(([key]) => !eventBindings.includes(key))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as Record<string, any>);
        if (ref) applyBindingAccessorsToNode(ref, bindingAccessorProps, {});
      }
    });
};

export const defineComponent = <P extends Record<string, any>, R extends Record<string, any>>(
  options: DefineComponentOptions<P, R>,
): ComponentFactory<P> => {
  const fn: ComponentReturnValue<P> = (element) => {
    const resolvedProps = getProps(options.props, element);
    const resolvedRefs = getRefs(options.refs, element);

    const bindings = options.setup(resolvedProps as any, resolvedRefs as any, { element });

    applyBindings(bindings);

    return {
      name: options.name,
      setProps(props) {
        console.log('new props', props);
      },
      dispose() {
        console.log('dispose');
        cleanNode(element);
      },
    };
  };
  (fn as ComponentFactory<P>).displayName = options.name;
  return fn as ComponentFactory<P>;
};
