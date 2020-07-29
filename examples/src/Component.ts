import { applyBindingAccessorsToNode, BindingAccessors } from 'knockout';

type ComponentFactory<T extends HTMLElement> = (
  element: T,
) => {
  setProps: (props: Record<string, unknown>) => void;
  dispose: () => void;
};

type DefineComponentOptions<T extends HTMLElement> = {
  name: string;
  props?: Record<string, any>;
  refs?: Record<string, string>;
  setup: (
    props: Record<string, unknown>,
    refs: Record<string, HTMLElement>,
    context: { element: T },
  ) => void;
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

    options.setup(resolvedProps, resolvedRefs, { element });

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

export const bind = (node: Node, bindings: BindingAccessors | (() => BindingAccessors)) => {
  applyBindingAccessorsToNode(node, bindings, {});
};
