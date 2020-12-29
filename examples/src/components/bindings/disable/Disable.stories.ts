import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { Disable } from './Disable';
import { disableTemplate } from './Disable.template';

export default {
  title: 'bindings/disable',
};

export const Default: Story = () => ({
  component: Disable,
  template: disableTemplate,
});
