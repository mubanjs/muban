/* eslint-disable @typescript-eslint/naming-convention */
import { Test, testTemplate } from './Test';

export default {
  title: 'Test',
  argTypes: {},
};

export const Default = () => ({
  template: testTemplate,
  component: Test,
});
Default.args = {
  isExpanded: false,
};
