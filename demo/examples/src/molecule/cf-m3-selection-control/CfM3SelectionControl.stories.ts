import type { Story } from '@muban/storybook/types-6-0';

import { CfM3SelectionControl, cfM3SelectionControl } from './CfM3SelectionControl';
import { selectionControlInputTypes } from './CfM3SelectionControl.config';
import type { CfM3SelectionControlTypes } from './CfM3SelectionControl.types';
import { className, disabled, inputLabel, inputNote } from '../../../storybook/argTypes';

export default {
  title: 'Molecule/cf-m3-selection-control',
  argTypes: {
    className,
    disabled,
    label: inputLabel,
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
    note: inputNote,
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
