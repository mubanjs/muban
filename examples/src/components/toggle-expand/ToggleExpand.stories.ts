import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { meta, ToggleExpandProps } from './ToggleExpand';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default: Story<ToggleExpandProps> = () => meta;
Default.args = {
  isExpanded: false,
};

export const Expanded = Default.bind({});
Expanded.args = {
  isExpanded: true,
};
