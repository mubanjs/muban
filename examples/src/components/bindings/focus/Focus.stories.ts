import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { Focus } from './Focus';
import { focusTemplate } from './Focus.template';

export default {
  title: 'bindings/focus',
};

export const Default: Story = () => ({
  component: Focus,
  template: focusTemplate,
});
