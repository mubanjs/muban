import { ToggleExpand, toggleExpand } from './ToggleExpand';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default = () => ({
  template: toggleExpand,
  component: ToggleExpand,
});
Default.args = {
  isExpanded: false,
};

export const Expanded = Default.bind({});
Expanded.args = {
  isExpanded: true,
};
