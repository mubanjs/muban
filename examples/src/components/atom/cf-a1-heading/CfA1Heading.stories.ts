import { cfA1Heading } from './CfA1Heading';
import {
  defaultHeadingAlignment,
  defaultHeadingClass,
  defaultHeadingType,
  headingAlignments,
  headingClasses,
  headingTypes,
} from './CfA1Heading.config';
import type { CFa1HeadingProps } from './CfA1Heading.types';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { className } from '../../../storybook/argTypes';

export default {
  title: 'Atom/cf-a1-heading',
  argTypes: {
    eyebrow: {
      control: 'text',
      description: 'The text that is rendered above the main title (can contain HTML)',
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
      control: 'text',
      description: 'The main title that is rendered (can contain HTML).',
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
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
    mustache: {
      control: 'text',
      description: 'The text that is rendered below the main title (can contain HTML)',
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
    alignment: {
      description: 'The alignment of the heading within the container.',
      defaultValue: defaultHeadingAlignment,
      type: {
        required: false,
      },
      control: {
        type: 'select',
        options: headingAlignments,
      },
      table: {
        category: 'Visual',
        type: {
          summary: headingAlignments.join('|'),
        },
        defaultValue: {
          summary: defaultHeadingAlignment,
        },
      },
    },
    headingClass: {
      description: 'The heading class that is applied on the component.',
      defaultValue: defaultHeadingClass,
      type: {
        required: false,
      },
      control: {
        type: 'select',
        options: headingClasses,
      },
      table: {
        category: 'Visual',
        type: {
          summary: headingClasses.join(' | '),
        },
        defaultValue: {
          summary: defaultHeadingClass,
        },
      },
    },
    className,
    type: {
      description: 'The tag that is used to render out the component',
      type: {
        required: false,
      },
      defaultValue: defaultHeadingType,
      control: {
        type: 'select',
        options: headingTypes,
      },
      table: {
        category: 'Structural',
        type: {
          summary: headingTypes.join('|'),
        },
        defaultValue: {
          summary: defaultHeadingType,
        },
      },
    },
    link: {
      description: 'This prop can be used to render out the heading as a link',
      type: {
        required: false,
      },
      control: {
        type: 'object',
      },
      table: {
        category: 'Structural',
        type: {
          summary: 'object',
          detail: '{ href: "string", target: "string" }',
        },
      },
    },
  },
};

export const Default: Story<CFa1HeadingProps> = () => ({
  template: cfA1Heading,
});

export const Link = Default.bind({});

Link.args = {
  link: {
    href: '#',
    target: '_blank',
  },
};

export const Eyebrow = Default.bind({});

Eyebrow.args = {
  eyebrow: 'The quick brown fox jumps over the lazy dog.',
};

export const Mustache = Default.bind({});

Mustache.args = {
  mustache: 'The quick brown fox jumps over the lazy dog.',
};

export const EyebrowAndMustache = Default.bind({});

EyebrowAndMustache.args = {
  eyebrow: 'The quick brown fox jumps over the lazy dog.',
  mustache: 'The quick brown fox jumps over the lazy dog.',
};

export const CustomTitles = Default.bind({});

CustomTitles.args = {
  eyebrow: 'The <u>quick</u> brown <strong>fox jumps</strong> over <i>the lazy</i> dog.',
  title: 'The <u>quick</u> brown <strong>fox jumps</strong> over <i>the lazy</i> dog.',
  mustache: 'The <u>quick</u> brown <strong>fox jumps</strong> over <i>the lazy</i> dog.',
};
