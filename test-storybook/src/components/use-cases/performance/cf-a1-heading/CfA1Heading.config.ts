import type { HeadingAlignment, HeadingClass, HeadingType } from './CfA1Heading.types';

// Define all of the available options.
export const headingAlignments = ['left', 'center', 'right'] as const;
export const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export const headingClasses = [
  'heading-01',
  'heading-02',
  'heading-03',
  'heading-04',
  'heading-05',
  'heading-06',
  'custom-heading',
] as const;

// Define the default values so we can re-use them in the stories.
export const defaultHeadingClass: HeadingClass = 'heading-01';
export const defaultHeadingType: HeadingType = 'h1';
export const defaultHeadingAlignment: HeadingAlignment = 'left';
