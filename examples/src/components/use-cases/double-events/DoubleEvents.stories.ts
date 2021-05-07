import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { computed } from '@vue/reactivity';
import {
  bind,
  bindMap,
  defineComponent,
  propType,
  refCollection,
  refComponent,
} from '../../../../../src';

export default {
  title: 'use-cases/double-events',
};

const TextComponent = defineComponent({
  name: 'text-component',
  props: {
    copy: propType.string.optional.source({ type: 'html', target: 'self' }),
  },
  setup({ props, refs }) {
    return [
      bind(refs.self, {
        html: computed(() => props.copy ?? ''),
      }),
    ];
  },
});

export const DoubleEventsStories: Story = () => ({
  component: defineComponent({
    name: 'double-events',
    refs: {
      button: refCollection('button', { minimumItemsRequired: 1 }),
      textComponent: refComponent(TextComponent),
    },
    setup({ refs }) {
      return [
        // It only happens when applying the click binding on a `bindMap`
        ...bindMap(refs.button, () => ({
          event: {
            click: () => {
              // Notice that this log is triggered twice when clicking on the button
              console.log('Clicked on the button!');
            },
          },
        })),
      ];
    },
  }),
  template: () => html`<div data-component="double-events">
    <button data-ref="button">
      <span data-component="text-component">Click me!</span>
    </button>
  </div>`,
});
