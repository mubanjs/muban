import { bind, defineComponent, ref, refElement } from '@muban/muban';

export const LazyComponent = defineComponent({
  name: 'lazy-component',
  refs: {
    text: refElement('text'),
  },
  setup({ refs }) {
    const text = ref('I am lazy 🛌');

    return [
      bind(refs.text, {
        html: text,
      }),
    ];
  },
});
