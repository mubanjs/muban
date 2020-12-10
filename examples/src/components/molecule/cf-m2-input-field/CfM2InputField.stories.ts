import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfM2InputFieldTypes } from './CfM2InputField.types';
import { cfM2InputField, CfM2InputField } from './CfM2InputField';
import { defaultInputTypeOption, inputTypeOptions } from './CfM2InputField.config';

export default {
  title: 'Molecule/cf-m2-input-field',
  argTypes: {
    label: {
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      description: 'The label associated with the input element',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'string',
        },
      },
    },
    note: {
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      description: 'You can add a note beneath the input element.',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        type: {
          summary: ['string', 'Array<string>'].join(' | '),
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
    placeholder: {
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      description: 'Text that appears in the form control when it has no value set.',
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
    disabled: {
      description: 'Whether the form control is disabled.',
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
  },
};

export const Default: Story<CfM2InputFieldTypes> = () => ({
  template: cfM2InputField,
  component: CfM2InputField,
});

export const Password: Story<CfM2InputFieldTypes> = () => ({
  template: cfM2InputField,
  component: CfM2InputField,
});

Password.args = {
  type: 'password',
};
