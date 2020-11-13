import Button, { button } from './Button';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
  },
};

export const Default = () => ({
  template: button,
});
Default.args = {
  label: 'Click me',
};
