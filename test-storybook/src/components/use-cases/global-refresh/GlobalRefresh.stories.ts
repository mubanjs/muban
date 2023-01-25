// eslint-disable-next-line import/no-extraneous-dependencies
import { createDecoratorComponent } from '@muban/storybook';
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { computed, ref } from '@vue/reactivity';
import { bind, defineComponent, propType, refComponent } from '@muban/muban';
import { screen, queryAllByAttribute } from '@muban/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'use-cases/global-refresh',
};

const Tooltip = defineComponent({
  name: 'tooltip',
  props: {
    content: propType.string.defaultValue('').source({ type: 'text', target: 'self' }),
  },
  setup({ props }) {
    console.log('Tooltip init', props.content);
    return [];
  },
});
const Child = defineComponent({
  name: 'child',
  refs: {
    content: 'content',
  },
  props: {
    content: propType.string.source({ type: 'html', target: 'content' }),
  },
  setup({ refs, props }) {
    return [bind(refs.content, { html: computed(() => props.content) })];
  },
});

export const GlobalRefresh: Story = () => ({
  appComponents: [Tooltip],
  component: defineComponent({
    name: 'global-refresh',
    refs: {
      child: refComponent(Child),
    },
    setup({ refs }) {
      const updatedContent = ref(
        refs.child.component?.props.content?.replace(
          /##([a-z\d]+)##/gi,
          (match, content) => `<span data-component="tooltip"><strong>${content}</strong></span>`,
        ) ?? '',
      );

      return [bind(refs.child, { content: updatedContent })];
    },
  }),
  template: () => html` <div data-component="global-refresh" data-testid="global-refresh">
    <div data-component="child">
      <h1>Test</h1>
      <div data-ref="content">Foo ##tooltip1## bar ##tooltip2##.</div>
    </div>
  </div>`,
});

const globalRefreshPlayFunction = async () => {
  const storyContainer = screen.getByTestId('global-refresh');
  const tooltips = queryAllByAttribute('data-component', storyContainer, 'tooltip');
  expect(tooltips.length).toBe(2);
  expect(tooltips[0]).toHaveTextContent('tooltip1');
  expect(tooltips[1]).toHaveTextContent('tooltip2');
};
GlobalRefresh.play = globalRefreshPlayFunction;

export const GlobalRefreshDecorator = GlobalRefresh.bind({});
GlobalRefreshDecorator.decorators = [
  createDecoratorComponent(({ template }) => ({
    template: () => html`<div data-foo="bar">${template}</div>`,
  })),
];
GlobalRefreshDecorator.play = globalRefreshPlayFunction;
