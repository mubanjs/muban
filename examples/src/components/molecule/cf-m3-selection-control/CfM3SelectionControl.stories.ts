import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import { CfM3SelectionControl, cfM3SelectionControl } from './CfM3SelectionControl';
import { selectionControlInputTypes } from './CfM3SelectionControl.config';
import type { CfM3SelectionControlTypes } from './CfM3SelectionControl.types';

export default {
  title: 'Molecule/cf-m3-selection-control',
  argTypes: {
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
      control: {
        type: 'select',
        options: selectionControlInputTypes,
      },
      description: 'The type of toggle input you want to render',
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: selectionControlInputTypes.join(' | '),
        },
      },
    },
    label: {
      control: 'text',
      description: 'The label displayed next to the input field',
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'text',
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

export const Checkbox: Story<CfM3SelectionControlTypes> = () => ({
  template: cfM3SelectionControl,
  component: CfM3SelectionControl,
});

Checkbox.args = {
  type: 'checkbox',
  label: 'The quick brown fox jumps over the lazy dog.',
};

export const Radio: Story<CfM3SelectionControlTypes> = () => ({
  template: cfM3SelectionControl,
  component: CfM3SelectionControl,
});

Radio.args = {
  type: 'radio',
  label: 'The quick brown fox jumps over the lazy dog.',
};

export const Toggle: Story<CfM3SelectionControlTypes> = () => ({
  template: cfM3SelectionControl,
  component: CfM3SelectionControl,
});

Toggle.args = {
  type: 'toggle',
  label: 'The quick brown fox jumps over the lazy dog.',
};
