import type { Story } from '@muban/storybook/types-6-0';

import type { CfM2InputFieldTypes } from './CfM2InputField.types';
import { cfM2InputField, CfM2InputField } from './CfM2InputField';
import { defaultInputTypeOption, inputTypeOptions } from './CfM2InputField.config';
import {
  className,
  disabled,
  inputLabel,
  inputNote,
  placeholder,
} from '../../../storybook/argTypes';

export default {
  title: 'Molecule/cf-m2-input-field',
  argTypes: {
    className,
    placeholder,
    disabled,
    label: inputLabel,
    note: inputNote,
    type: {
      defaultValue: defaultInputTypeOption,
      description: 'Type of form control.',
      control: {
        type: 'select',
        options: inputTypeOptions,
      },
      type: {
        required: false,
      },
      table: {
        category: 'Native',
        type: {
          summary: inputTypeOptions.join('|'),
        },
      },
    },
    value: {
      description:
        'At first, the initial value if specified explicitly in HTML. More generally, the current value of the form control. Submitted with the form as part of a name/value pair.',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Native',
        type: {
          summary: 'string',
        },
      },
    },
  },
};

export const Default: Story<CfM2InputFieldTypes> = () => ({
  template: cfM2InputField,
  component: CfM2InputField,
});

export const Textarea: Story<CfM2InputFieldTypes> = () => ({
  template: cfM2InputField,
  component: CfM2InputField,
});

Textarea.args = {
  type: 'textarea',
};

export const Password: Story<CfM2InputFieldTypes> = () => ({
  template: cfM2InputField,
  component: CfM2InputField,
});

Password.args = {
  type: 'password',
};
