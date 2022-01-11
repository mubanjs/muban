/* eslint-disable @typescript-eslint/naming-convention */
import type { Story } from '@muban/storybook/types-6-0';
import { Test, testTemplate } from './Test';

export default {
  title: 'Test',
  argTypes: {},
};

export const Default: Story = () => ({
  template: testTemplate,
  component: Test,
});
Default.args = {
  isExpanded: false,
};
