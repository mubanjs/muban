import type { Story } from '@muban/storybook/types-6-0';

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

Single.args = {
  options: Array.from({ length: 3 }).map((_, index) => ({
    label: `Label for option ${index + 1}`,
    value: `option-${index}`,
  })),
};

export const Multiple: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});

Multiple.args = {
  multiple: true,
  options: Array.from({ length: 10 }).map((_, index) => ({
    label: `Label for option ${index + 1}`,
    value: `option-${index}`,
  })),
};

export const SelectedValue: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});

SelectedValue.args = {
  options: Array.from({ length: 10 }).map((_, index) => ({
    label: `Label for option ${index + 1}`,
    value: `option-${index}`,
    selected: index === 3,
  })),
};

export const SelectedValues: Story<CfM4SelectTypes> = () => ({
  template: cfM4Select,
  component: CfM4Select,
});

SelectedValues.args = {
  multiple: true,
  options: Array.from({ length: 10 }).map((_, index) => ({
    label: `Label for option ${index + 1}`,
    value: `option-${index}`,
    selected: index < 4,
  })),
};
