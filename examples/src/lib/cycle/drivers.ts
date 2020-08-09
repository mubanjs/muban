import { getRefs, ComponentRefTypes } from '../../Component';
import { Stream } from 'xstream';
import { castArray, mapValues } from 'lodash';

const xs = Stream;

export const makeRefsDriver = <R extends Record<string, any>>(
  refsSelection: ComponentRefTypes<R>,
  element: HTMLElement,
) => {
  return () => {
    const refs = getRefs(refsSelection, element) as R;
    return mapValues(refs, (element) => {
      return {
        element: element.value,
        events: (eventType: string) => {
          const event$ = xs.create();
          let count = 0;
          element.value.addEventListener(eventType, function (event: any) {
            // lol
            event$.shamefullySendNext({ event, count: count++ });
          });
          return event$;
        },
      };
    });
  };
};

type BindingValue<T> = T;

export type BindProps<T> = {
  target: T | undefined;
  text?: BindingValue<string>;
  html?: BindingValue<string>;
  click?: (event: HTMLElementEventMap['click']) => void;
  style?: BindingValue<Record<string, string>>;
  css?: BindingValue<Record<string, string>>;
};

export const makeBindingDriver = () => {
  return (binding$: Stream<BindProps<HTMLElement>>, key: string) => {
    binding$.addListener({
      next: (binding) => {
        castArray(binding).forEach((binding) => {
          const el = (binding.target as any).element as HTMLElement;
          if (binding.text) {
            el.innerText = binding.text;
          }
          if (binding.style) {
            Object.entries(binding.style).forEach(([key, val]) => {
              (el.style as any)[key] = val;
            });
          }
        });
      },
      error: (err) => console.error(err),
      complete: () => console.log('completed'),
    });

    return binding$;
  };
};
