import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { Submit } from './Submit';
import { submitTemplate } from './Submit.template';

export default {
  title: 'bindings/submit',
};

export const Default: Story = () => ({
  component: Submit,
  template: submitTemplate,
});
