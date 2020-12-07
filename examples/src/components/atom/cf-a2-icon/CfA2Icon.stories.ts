import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfA2IconTypes } from './CfA2Icon.types';
import { CfA2Icon, cfA2Icon } from './CfA2Icon';
import { icons } from './CfA2Icon.config';

export default {
  title: 'Atom/cf-a2-icon',
  argTypes: {
    name: {
      defaultValue: 'arrow-right',
      description: 'The name of the icon that needs to be rendered',
      control: {
        type: 'select',
        options: icons,
      },
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'string',
        },
      },
    },
    className: {
      control: 'array',
      description: 'Any custom css classes that you might want to add to the component.',
      type: {
        required: false,
      },
      table: {
        category: 'Visual',
        type: {
          summary: ['string', 'Array<string>'].join(' | '),
        },
      },
    },
  },
};

export const Default: Story<CfA2IconTypes> = () => ({
  template: cfA2Icon,
  component: CfA2Icon,
});
