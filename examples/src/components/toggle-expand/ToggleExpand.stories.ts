import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { ToggleExpand } from './ToggleExpand';
import { toggleExpandTemplate, ToggleExpandTemplateProps } from './ToggleExpand.template';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default: Story<ToggleExpandTemplateProps> = () => ({
  component: ToggleExpand,
  template: toggleExpandTemplate,
});
Default.args = {
  isExpanded: false,
};

export const Expanded = Default.bind({});
Expanded.args = {
  isExpanded: true,
};
