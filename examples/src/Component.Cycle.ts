/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ComponentFactory,
  ComponentReturnValue,
  ComponentPropTypes,
  ComponentRefTypes,
} from './Component';
import type { BindProps } from './JSX.Reactive';
import type { Stream } from 'xstream';
import run from '@cycle/run';
import { makeBindingDriver, makeRefsDriver } from './lib/cycle/drivers';

type Sources = {
  refs: Stream<Record<string, any>>;
  binding: Stream<BindProps<HTMLElement>>; // TODO: type
  // DOM: MainDOMSource;
};

export type DefineComponentOptionsCycle<
  P extends Record<string, any>,
  R extends Record<string, any>
> = {
  name: string;
  props?: ComponentPropTypes<P>;
  refs?: ComponentRefTypes<R>;
};

export const defineComponent = <P extends Record<string, any>, R extends Record<string, any>>(
  options: DefineComponentOptionsCycle<P, R>,
): ComponentFactory<P> => {
  const fn: ComponentReturnValue<P> = (element) => {
    // TODO: move function once we know what the parent/children pattern to use
    const Component = ({ refs }: Sources) => {
      // TODO: fix type
      const { expandButton, expandContent } = refs as any;
      const expanded$ = expandButton
        .events('click')
        .map(({ count }: any) => count % 2 === 0)
        .startWith(false);

      return {
        binding: expanded$.map((isExpanded: boolean) => [
          {
            target: expandButton,
            text: isExpanded ? 'read less...' : 'read more...',
          },
          {
            target: expandContent,
            style: {
              display: isExpanded ? 'block' : 'none',
            },
          },
        ]),
      };
    };

    const dispose = run(
      Component as any,
      {
        // could/should these be a single driver? we also need to account for props and children
        refs: makeRefsDriver(options.refs!, element),
        binding: makeBindingDriver(),
      } as any,
    );

    return {
      name: options.name,
      // TODO: hook up with drivers
      setProps(props) {
        console.log('emit', props);
      },
      dispose,
    };
  };
  (fn as ComponentFactory<P>).displayName = options.name;
  return fn as ComponentFactory<P>;
};
