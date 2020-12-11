import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import { cfM4Select, CfM4Select } from './CfM4Select';
import type { CfM4SelectTypes } from './CfM4Select.types';
import { className, disabled, placeholder } from '../../../storybook/argTypes';

export default {
  title: 'Molecule/cf-m4-select',
  argTypes: {
    className,
    placeholder,
    disabled,
    options: {
      control: 'object',
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

export const Default: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});
