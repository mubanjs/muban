import { icons } from '../components/atom/cf-a2-icon/CfA2Icon.config';

export const className = {
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
};

export const placeholder = {
  control: 'string',
  defaultValue: 'Please select a value',
  description: 'The default value that is displayed when no value has been selected.',
  type: {
    required: false,
  },
  table: {
    category: 'Data',
    type: {
      summary: 'string',
    },
  },
};

export const icon = {
  defaultValue: 'arrow-right',
  description: 'The name of the icon that needs to be rendered',
  control: {
    type: 'select',
    options: icons,
  },
  type: {
    required: false,
  },
  table: {
    category: 'Data',
    type: {
      summary: 'string',
    },
  },
};

export const disabled = {
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
};

export const inputNote = {
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
};

export const inputLabel = {
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
};
