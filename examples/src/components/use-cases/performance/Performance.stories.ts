import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, computed, defineComponent, lazy, propType } from '../../../../../src';
import { cfA1Heading } from '../../atom/cf-a1-heading/CfA1Heading';
import { cfA2IconTemplate } from '../../atom/cf-a2-icon/CfA2Icon.template';

export default {
  title: 'use-cases/performance',
};

export const Icons: Story = () => ({
  appComponents: [
    lazy('cf-a2-icon', () => import(/* webpackExports: "lazy" */ '../../atom/cf-a2-icon/CfA2Icon')),
  ],
  component: defineComponent({
    name: 'global-refresh',
    setup() {
      console.log('foo');
      return [];
    },
  }),
  template: () => html` <div data-component="global-refresh">
    <div data-component="child">
      ${cfA1Heading({ title: 'The quick brown fox jumped over the lazy dog', type: 'h1' })}
      ${cfA2IconTemplate({ name: 'loader' })}
      ${Array.from({ length: 1000 }, () => cfA2IconTemplate({ name: 'arrow-up' }))}
    </div>
  </div>`,
});

const TextTest = defineComponent({
  name: 'text-test',
  props: {
    html: propType.string.source({ type: 'html' }),
  },
  setup({ props, refs }) {
    return [bind(refs.self, { html: computed(() => props.html) })];
  },
});

export const Text: Story = () => ({
  appComponents: [
    lazy('cf-a2-icon', () => import(/* webpackExports: "lazy" */ '../../atom/cf-a2-icon/CfA2Icon')),
    TextTest,
  ],
  component: defineComponent({
    name: 'global-refresh',
    setup() {
      console.log('foo');
      return [];
    },
  }),
  template: () => html` <div data-component="global-refresh">
    <div data-component="child">
      ${cfA1Heading({ title: 'The quick brown fox jumped over the lazy dog', type: 'h1' })}
      ${cfA2IconTemplate({ name: 'loader' })}
      ${Array.from(
        { length: 2000 },
        (_, index) => html`<span data-component="text-test">this is line ${index} </span>`,
      )}
    </div>
  </div>`,
});
