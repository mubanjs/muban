import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfA2IconTypes } from './CfA2Icon.types';
import { CfA2Icon, cfA2Icon } from './CfA2Icon';
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
  template: cfA2Icon,
  component: CfA2Icon,
});
