import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import {
  computed,
  bind,
  bindMap,
  defineComponent,
  propType,
  refCollection,
  refComponent,
} from '@muban/muban';
import { CfA2Icon } from '../performance/cf-a2-icon/CfA2Icon';
import { cfA2IconTemplate } from '../performance/cf-a2-icon/CfA2Icon.template';

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

const DoubleEventsComponent = defineComponent({
  name: 'double-events',
  components: [CfA2Icon],
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
});

export const DoubleEventsSelf: Story = () => ({
  component: DoubleEventsComponent,
  template: () => html`<div data-component="double-events">
    <button data-ref="button">
      <span data-component="text-component">Click me!</span>
    </button>
  </div>`,
});

export const DoubleEventsIcon: Story = () => ({
  component: DoubleEventsComponent,
  template: () => html`<div data-component="double-events">
    <button data-ref="button">Check! ${cfA2IconTemplate({ name: 'checkmark' })}</button>
  </div>`,
});
