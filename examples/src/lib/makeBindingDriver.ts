import type { Stream } from 'xstream';
import { castArray } from 'lodash';

type BindingValue<T> = T;

export type BindSource = {
  click?: (event: HTMLElementEventMap['click']) => void;
};

export type BindProps<T> = {
  target: T | undefined;
  text?: BindingValue<string>;
  html?: BindingValue<string>;
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
