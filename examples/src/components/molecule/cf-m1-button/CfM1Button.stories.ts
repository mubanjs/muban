import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfM1ButtonTypes } from './CfM1Button.types';
import { CfM1Button, cfM1Button } from './CfM1Button';
import {
  buttonSizes,
  defaultButtonSize,
  defaultDisabled,
  defaultIconAlignment,
  defaultLoading,
  defaultTarget,
  iconAlignments,
} from './CfM1Button.config';
import { icons } from '../../atom/cf-a2-icon/CfA2Icon.config';

export default {
  title: 'Molecule/cf-m1-button',
  argTypes: {
    label: {
      defaultValue: 'Click me!',
      description: 'The label displayed within the button',
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
    title: {
      defaultValue: '',
      description: 'The title attribute that will be added to the button',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether or not you want to disable the button.',
      defaultValue: defaultDisabled,
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        defaultValue: {
          summary: defaultDisabled,
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether or not you want to mark the button as loading and show a spinner.',
      defaultValue: defaultLoading,
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        defaultValue: {
          summary: defaultLoading,
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    ariaLabel: {
      description: 'Any aria-label that you want to add to the button.',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    ariaControls: {
      description: 'Any aria-controls that you want to add to the button.',
      control: 'text',
      type: {
        required: false,
      },
      table: {
        category: 'Accessibility',
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      description: 'An optional icon that can be rendered in the button',
      control: {
        type: 'select',
        options: [undefined, ...icons],
      },
      type: {
        required: false,
      },
      table: {
        category: 'Icon',
        type: {
          summary: 'string',
        },
      },
    },
    iconAlignment: {
      description: 'The position where you want to have the icon rendered',
      defaultValue: defaultIconAlignment,
      control: {
        type: 'select',
        options: iconAlignments,
      },
      type: {
        required: false,
      },
      table: {
        category: 'Icon',
        defaultValue: {
          summary: defaultIconAlignment,
        },
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
    size: {
      defaultValue: defaultButtonSize,
      control: {
        type: 'select',
        options: buttonSizes,
      },
      description: 'The size of the button',
      type: {
        required: false,
      },
      table: {
        category: 'Visual',
        defaultValue: {
          summary: defaultButtonSize,
        },
        type: {
          summary: buttonSizes.join('|'),
        },
      },
    },
    href: {
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
    target: {
      control: 'text',
      defaultValue: defaultTarget,
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'string',
        },
        defaultValue: {
          summary: defaultTarget,
        },
      },
    },
  },
};

export const Button: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

export const Anchor: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

Anchor.args = {
  href: 'https://github.com/mubanjs',
};

export const WithIcon: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

WithIcon.args = {
  icon: 'arrow-right',
};

export const IconOnly: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

IconOnly.args = {
  icon: 'arrow-right',
  label: '',
  title: 'Click me!',
};

export const Loading: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

Loading.args = {
  loading: true,
};

export const Small: Story<CfM1ButtonTypes> = () => ({
  template: cfM1Button,
  component: CfM1Button,
});

Small.args = {
  size: 'small',
  icon: 'arrow-right',
};
