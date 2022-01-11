import type { Story } from '@muban/storybook/types-6-0';
import { cfA2IconTemplate } from './CfA2Icon.template';

import type { CfA2IconTypes } from './CfA2Icon.types';
import { CfA2Icon } from './CfA2Icon';
import { className, icon } from '../../../storybook/argTypes';

export default {
  title: 'Atom/cf-a2-icon',
  argTypes: {
    className,
    name: {
      ...icon,
      type: {
        required: true,
      },
    },
  },
};

export const Default: Story<CfA2IconTypes> = () => ({
  template: cfA2IconTemplate,
  component: CfA2Icon,
});
