import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfM4SelectTypes } from './CfM4Select.types';
import { className, disabled, placeholder } from '../../../storybook/argTypes';
import { cfM4Select } from './CfM4Select.template';
import { CfM4Select } from './CfM4Select';

export default {
  title: 'Molecule/cf-m4-select',
  argTypes: {
    className,
    placeholder,
    disabled,
    multiple: {
      description: 'Whether the user can select multiple values',
      control: 'boolean',
      type: {
        required: false,
      },
      table: {
        category: 'Native',
        type: {
          summary: 'boolean',
        },
      },
    },
    options: {
      defaultValue: [
        {
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          value: 'option-01',
        },
        {
          label: 'Duis non sapien mollis, posuere enim quis, finibus lacus.',
          value: 'option-02',
        },
        {
          label: 'Curabitur fermentum turpis a purus rutrum tempus.',
          value: 'option-03',
        },
        {
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          value: 'option-04',
        },
        {
          label: 'Duis non sapien mollis, posuere enim quis, finibus lacus.',
          value: 'option-05',
        },
        {
          label: 'Curabitur fermentum turpis a purus rutrum tempus.',
          value: 'option-06',
        },
        {
          label: 'Curabitur fermentum turpis a purus rutrum tempus.',
          value: 'option-07',
        },
        {
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          value: 'option-08',
        },
        {
          label: 'Duis non sapien mollis, posuere enim quis, finibus lacus.',
          value: 'option-09',
        },
        {
          label: 'Curabitur fermentum turpis a purus rutrum tempus.',
          value: 'option-10',
        },
      ],
      description: 'The options that can be selected in the select component',
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'Array<{label:string; value:string; selected?:boolean}>',
        },
      },
    },
  },
};

export const Single: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});

export const Multiple: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});

Multiple.args = {
  multiple: true,
};
