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
import { screen, queryByRef } from '@muban/testing-library';
import { CfA2Icon } from '../performance/cf-a2-icon/CfA2Icon';
import { cfA2IconTemplate } from '../performance/cf-a2-icon/CfA2Icon.template';
import { userEvent } from '@storybook/testing-library';
import { wait } from '../../../utils/timers';
import { jest, expect } from '@storybook/jest';

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

const clickFunction = jest.fn();
const DoubleEventsComponent = defineComponent({
  name: 'double-events',
  components: [CfA2Icon],
  refs: {
    button: refCollection('button', { minimumItemsRequired: 1 }),
    textComponent: refComponent(TextComponent, { isRequired: false }),
  },
  setup({ refs }) {
    return [
      // It only happens when applying the click binding on a `bindMap`
      ...bindMap(refs.button, () => ({
        event: {
          click: () => {
            clickFunction();
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
  template: () => html`<div data-component="double-events" data-testid="double-events-self">
    <button data-ref="button">
      <span data-component="text-component">Click me!</span>
    </button>
  </div>`,
});
DoubleEventsSelf.play = async () => {
  const storyContainer = screen.getByTestId('double-events-self');
  const button = queryByRef(storyContainer, 'button')!;
  userEvent.click(button);
  await wait();
  expect(clickFunction).toBeCalledTimes(1);
};

export const DoubleEventsIcon: Story = () => ({
  component: DoubleEventsComponent,
  template: () => html`<div data-component="double-events" data-testid="double-events-icon">
    <button data-ref="button">Check! ${cfA2IconTemplate({ name: 'arrow-up' })}</button>
  </div>`,
});
DoubleEventsIcon.play = async () => {
  const storyContainer = screen.getByTestId('double-events-icon');
  const button = queryByRef(storyContainer, 'button')!;
  userEvent.click(button);
  await wait();
  expect(clickFunction).toBeCalledTimes(1);
};
