import type { headingAlignments, headingClasses, headingTypes } from './CfA1Heading.config';

export type HeadingAlignment = typeof headingAlignments[number];
export type HeadingType = typeof headingTypes[number];
export type HeadingClass = typeof headingClasses[number];

export type CFa1HeadingProps = {
  eyebrow?: string;
  mustache?: string;
  title: string;
  type: HeadingType;
  headingClass?: HeadingClass;
  alignment?: HeadingAlignment;
  className?: Array<string> | string;
  link?: {
    href: string;
    target: string;
  };
};
