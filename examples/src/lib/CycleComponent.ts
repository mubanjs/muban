/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ComponentFactory,
  ComponentReturnValue,
  ComponentPropTypes,
  ComponentRefTypes,
} from './Component';
import xs from 'xstream';
import run from '@cycle/run';
import { makeRefBindingDriver, bindingsDriver, RefSelectorSource } from './makeRefBindingDriver';

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
    type Sources = {
      refs: RefSelectorSource;
      // DOM: MainDOMSource;
    };

    const TabbedContent = ({ refs }: Sources) => {
      console.log(refs);
      // const { expandButton, expandContent } = refs as any;

      // const expanded$ = expandButton
      //   .map(({ count }: any) => count % 2 === 0)
      //   .startWith(false);

      return {
        binding: xs.periodic(1000).map((stuff) => [
          // {
          //   target: expandButton,
          //   text: stuff ? 'read less...' : 'read more...',
          // },
          // {
          //   target: expandContent,
          //   style: {
          //     display: isExpanded ? 'block' : 'none',
          //   },
          // },
        ]),
      };
    };

    // TODO: get children as source and pass back on the return
    const ToggleExpand = ({ refs }: Sources) => {
      const expandButton$ = refs.select('expandButton');
      const expandContent$ = refs.select('expandContent');

      const isExpanded$ = expandButton$
        .events('click')
        .map(({ count }) => count % 2 === 0)
        .startWith(false);

      return {
        refs: [
          expandButton$.bind({
            text: isExpanded$.map((isExpanded) => (isExpanded ? 'read less...' : 'read more...')),
          }),
          expandContent$.bind({
            style: {
              display: isExpanded$.map((isExpanded) => (isExpanded ? 'block' : 'none')),
            },
          }),
        ],
      };
    };

    const dispose = run(ToggleExpand, {
      refs: makeRefBindingDriver(element),
    });

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
