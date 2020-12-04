import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfA3IconTypes } from './CfA3Icon.types';
import { CfA3Icon, cfA3Icon } from './CfA3Icon';
import { icons } from './CfA3Icon.config';

export default {
  title: 'Atom/cf-a3-icon',
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

export const Default: Story<CfA3IconTypes> = () => ({
  template: cfA3Icon,
  component: CfA3Icon,
});
