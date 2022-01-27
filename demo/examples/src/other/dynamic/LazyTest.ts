import { html } from '@muban/template';
import { computed, ref } from '@vue/reactivity';
import { bind, defineComponent } from '../../../../../src';

export const displayName = 'lazy-test';

export const LazyTest = defineComponent({
  name: 'lazy-test',
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
  return html`<button data-component=${LazyTest.displayName} class="btn btn-primary">
    ${label}
  </button>`;
}
