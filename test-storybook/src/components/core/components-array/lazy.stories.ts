import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { defineComponent, lazy } from '@muban/muban';
import { LazyComponentTemplate } from './LazyComponent.template';
import { queryByAttribute, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';

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
  template: () =>
    html` <div data-component="components-array" data-testid="lazy-components-story">
      ${LazyComponentTemplate()}
    </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('lazy-components-story');
  const lazyComponent = queryByAttribute('data-component', storyContainer, 'lazy-component');
  expect(lazyComponent).not.toBe(null);
};
