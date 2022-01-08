import type { Story } from '@muban/storybook/types-6-0';
import type { ButtonTemplateProps } from './Button.template';
import { buttonTemplate } from './Button.template';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
  },
};

export const Default: Story<ButtonTemplateProps> = () => ({ template: buttonTemplate });
Default.args = {
  label: 'Click me',
};
