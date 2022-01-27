import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { defineComponent, lazy } from '@muban/muban';
import { LazyComponentTemplate } from './LazyComponent.template';

export default {
  title: 'core/components-array/lazy',
};

export const Default: Story = () => ({
  component: defineComponent({
    components: [lazy('lazy-component', () => import('./LazyComponent'))],
    name: 'components-array',
    setup() {
      return [];
    },
  }),
  template: () => html` <div data-component="components-array">${LazyComponentTemplate()}</div>`,
});
