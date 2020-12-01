import {
  cfA1Heading,
  defaultHeadingAlignment, defaultHeadingClass,
  defaultHeadingType,
  headingAlignments, headingClasses,
  headingTypes,
} from './CfA1Heading';

export default {
  title: 'Atom/cf-a1-heading',
  argTypes: {
    eyebrow: {
      control: 'text',
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      table: {
        category: 'Data',
      },
    },
    title: {
      control: 'text',
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      table: {
        category: 'Data',
      },
    },
    mustache: {
      control: 'text',
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
      table: {
        category: 'Data',
      },
    },
    alignment: {
      description: 'The alignment of the heading within the container',
      defaultValue: defaultHeadingAlignment,
      control: {
        type: 'select',
        options: headingAlignments,
      },
      table: {
        category: 'Visual',
        type: 'select',
        defaultValue: {
          summary: defaultHeadingAlignment,
        },
      },
    },
    headingClass: {
      description: 'The heading class that is applied on the component.',
      defaultValue: defaultHeadingClass,
      control: {
        type: 'select',
        options: headingClasses,
      },
      table: {
        category: 'Visual',
        type: 'select',
        defaultValue: {
          summary: defaultHeadingClass,
        },
      },
    },
    className: {
      description: 'Any custom css classes that you might want to add to the component.',
      control: {
        type: 'array',
      },
      table: {
        category: 'Visual',
        type: 'text',
      },
    },
    type: {
      description: 'The tag that is used to render out the component',
      defaultValue: defaultHeadingType,
      control: {
        type: 'select',
        options: headingTypes,
      },
      table: {
        category: 'Structural',
        type: 'text',
        defaultValue: {
          summary: defaultHeadingType,
        },
      },
    },
  },
};

export const Default = () => ({
  template: cfA1Heading,
});

Default.args = {};
