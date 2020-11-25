import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { meta, ButtonProps } from './Button';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
  },
};

export const Default: Story<ButtonProps> = () => meta;
Default.args = {
  label: 'Click me',
};
