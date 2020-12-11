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
      defaultValue: Array.from({ length: 10 }).map((_, index) => ({
        label: `Label for option ${index + 1}`,
        value: `option-${index}`,
      })),
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
