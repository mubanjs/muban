import { html } from '@muban/template';
import type { Story } from '@muban/storybook';
import { bind, computed, defineComponent, lazy, propType } from '@muban/muban';
import { cfA1HeadingTemplate } from './cf-a1-heading/CfA1Heading.template';
import { cfA2IconTemplate } from './cf-a2-icon/CfA2Icon.template';
import { screen, queryAllByAttribute } from '@muban/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'use-cases/performance',
};

export const Icons: Story = {
  render() {
    return {
      appComponents: [lazy('cf-a2-icon', () => import('./cf-a2-icon/CfA2Icon'))],
      component: defineComponent({
        name: 'global-refresh',
        setup() {
          console.log('foo');
          return [];
        },
      }),
      template: () => html` <div data-component="global-refresh" data-testid="performance-icons">
        <div data-component="child">
          ${cfA1HeadingTemplate({
            title: 'The quick brown fox jumped over the lazy dog',
            type: 'h1',
          })}
          ${cfA2IconTemplate({ name: 'loader' })}
          ${Array.from({ length: 1000 }, () => cfA2IconTemplate({ name: 'arrow-up' }))}
        </div>
      </div>`,
    };
  },
};

Icons.play = () => {
  const storyContainer = screen.getByTestId('performance-icons');
  const icons = queryAllByAttribute('data-component', storyContainer, 'cf-a2-icon');
  expect(icons.length).toBe(1001);
};

const TextTest = defineComponent({
  name: 'text-test',
  props: {
    html: propType.string.source({ type: 'html' }),
  },
  setup({ props, refs }) {
    return [bind(refs.self, { html: computed(() => props.html) })];
  },
});

export const Text: Story = {
  render() {
    return {
      appComponents: [lazy('cf-a2-icon', () => import('./cf-a2-icon/CfA2Icon')), TextTest],
      component: defineComponent({
        name: 'global-refresh',
        setup() {
          console.log('foo');
          return [];
        },
      }),
      template: () => html` <div data-component="global-refresh" data-testid="performance-text">
        <div data-component="child">
          ${cfA1HeadingTemplate({
            title: 'The quick brown fox jumped over the lazy dog',
            type: 'h1',
          })}
          ${cfA2IconTemplate({ name: 'loader' })}
          ${Array.from(
            { length: 2000 },
            (_, index) => html`<span data-component="text-test">this is line ${index} </span>`,
          )}
        </div>
      </div>`,
    };
  },
};

Text.play = () => {
  const storyContainer = screen.getByTestId('performance-text');
  const texts = queryAllByAttribute('data-component', storyContainer, 'text-test');
  expect(texts.length).toBe(2000);
};
