/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ComponentFactory,
  ComponentReturnValue,
  ComponentPropTypes,
  ComponentRefTypes,
} from './Component';
import xs, { Stream } from 'xstream';
import run from '@cycle/run';
import { makeRefsDriver } from './lib/cycle/makeRefsDriver';
import { makeBindingDriver, BindProps } from './lib/cycle/makeBindingDriver';

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

    // // TODO: move function once we know what the parent/children pattern to use
    // const ToggleExpand = ({ refs }: Sources) => {
    //   // TODO: fix type
    //   const { expandButton, expandContent } = refs as any;

    //   const expanded$ = expandButton
    //     .events('click')
    //     .map(({ count }: any) => count % 2 === 0)
    //     .startWith(false);

    //   return {
    //     binding: expanded$.map((isExpanded: boolean) => [
    //       {
    //         target: expandButton,
    //         text: isExpanded ? 'read less...' : 'read more...',
    //       },
    //       {
    //         target: expandContent,
    //         style: {
    //           display: isExpanded ? 'block' : 'none',
    //         },
    //       },
    //     ]),
    //   };
    // };

    const dispose = run(
      TabbedContent as any,
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
