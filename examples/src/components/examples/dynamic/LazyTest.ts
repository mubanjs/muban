import { html } from '@muban/template';
import {
  supportLazy,
  computed,
  ref,
  bind,
  defineComponent,
  refComponent,
} from '../../../../../src';
import { SomeChildComponent, someChildComponentTemplate } from './SomeChildComponent';

export const displayName = 'lazy-test';

export const LazyTest = defineComponent({
  name: 'lazy-test',
  refs: {
    // Adding the SomeChildComponent as a ref here causes it to be initialized twice!
    someChildComponent: refComponent(SomeChildComponent, { ref: 'child' }),
  },
  setup({ refs }) {
    const count = ref(0);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const label = refs.self.element!.innerText;
    return [
      bind(refs.self, {
        text: computed(() => `${label} - ${count.value}`),
        click: () => count.value++,
      }),
    ];
  },
});

export type LazyTestTemplateProps = {
  label: string;
};

export function lazyTestTemplate({ label }: LazyTestTemplateProps): string {
  return html`<button data-component="lazy-test" class="btn btn-primary">
    ${label} Test ${someChildComponentTemplate()}
  </button>`;
}

export const lazy = supportLazy(LazyTest);
