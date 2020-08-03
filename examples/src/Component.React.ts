/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNG } from 'tng-hooks';
import {
  Binding,
  ComponentFactory,
  DefineComponentOptionsReact,
  getProps,
  getRefs,
} from './Component';
// TODO: not sure how much vue-specific stuff gets included in the bundle by this

const applyBindings = (bindings: Array<Binding>) => {
  bindings.forEach((b) => {
    console.log('binding', b);
  });
};

export const defineComponent = <T extends HTMLElement>(
  options: DefineComponentOptionsReact<T>,
): ComponentFactory<T> => {
  return (element) => {
    const resolvedProps = getProps(options.props, element);
    const resolvedRefs = getRefs(options.refs, element);

    const render = TNG(options.render);

    const bindings = render(resolvedProps, resolvedRefs, { element });

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
