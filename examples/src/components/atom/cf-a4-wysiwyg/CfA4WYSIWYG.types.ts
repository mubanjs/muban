import type { contentAlignments } from './CfA4WYSIWYG.config';

export type ContentAlignment = typeof contentAlignments[number];

export type CfA4WYSIWYGTypes = {
  content: string;
  className?: Array<string> | string;
  alignment?: ContentAlignment;
};
