// eslint-disable-next-line import/no-extraneous-dependencies
import { createDecoratorComponent } from '@muban/storybook';
import type { Story } from '@muban/storybook/types-6-0';

import { html } from '@muban/template';
import type { CfA3ImageTypes } from './CfA3Image.types';
import { cfA3Image } from './CfA3Image';
import {
  defaultEnableLazyLoading,
  defaultEnableTransitionIn,
  imageObjectFitOptions,
} from './CfA3Image.config';
import { className } from '../../../storybook/argTypes';

export default {
  title: 'Atom/cf-a3-image',
  argTypes: {
    className,
    src: {
      description: 'The source of default image that needs to be displayed.',
      control: 'text',
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'string',
        },
      },
    },
    alt: {
      description: 'The alt value that describes the image.',
      control: 'text',
      type: {
        required: true,
      },
      table: {
        category: 'Data',
        type: {
          summary: 'string',
        },
      },
    },
    sources: {
      defaultValue: [
        {
          srcset: 'https://via.placeholder.com/1280x720?text=Large+image',
          media: '(min-width:768px)',
        },
      ],
      description:
        'An array of sources that can be used to change the image based on media queries',
      control: 'object',
      type: {
        required: false,
      },
      table: {
        category: 'Data',
        defaultValue: {
          summary: '[]',
        },
        type: {
          summary: 'Array<{ srcset: string; media: string; }>',
        },
      },
    },
    objectFit: {
      description:
        'The object-fit property sets how the content of a replaced element, such as an `<img>` or `<video>`, should be resized to fit its container.\n\n Note: When providing the `objectFit` property the element no longer has any dimensions.',
      control: {
        type: 'select',
        options: [undefined, ...imageObjectFitOptions],
      },
      table: {
        category: 'Data',
        type: {
          summary: imageObjectFitOptions.join('|'),
        },
      },
    },
    enableLazyLoading: {
      defaultValue: defaultEnableLazyLoading,
      description: 'Whether or not you want to enable the lazy-loading of images',
      control: 'boolean',
      table: {
        category: 'Data',
        defaultValue: {
          summary: defaultEnableLazyLoading,
        },
        type: {
          summary: 'boolean',
        },
      },
    },
    enableTransitionIn: {
      defaultValue: defaultEnableTransitionIn,
      description: 'Whether or not you want to enable the transition-in of images when loaded.',
      control: 'boolean',
      table: {
        category: 'Data',
        defaultValue: {
          summary: defaultEnableTransitionIn,
        },
        type: {
          summary: 'boolean',
        },
      },
    },
  },
};

export const Default: Story<CfA3ImageTypes> = () => ({
  template: cfA3Image,
});
Default.decorators = [
  createDecoratorComponent(({ template }) => ({
    template: () =>
      html`<div style="width: calc(100vw - 2rem); height: calc(100vh - 2rem)">${template}</div>`,
  })),
];

Default.args = {
  src: 'https://via.placeholder.com/640x480?text=Default+image',
  alt: 'The quick brown fox jumps over the lazy dog.',
};
