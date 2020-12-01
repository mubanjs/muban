import { html } from '../../../../../src';

import './cf-a1-heading.scss';

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

export const defaultHeadingClass: typeof headingClasses[number] = 'heading-01';
export const defaultHeadingType: typeof headingTypes[number] = 'h1';
export const defaultHeadingAlignment: typeof headingAlignments[number] = 'left';

type CFa1HeadingProps = {
  eyebrow?: string;
  mustache?: string;
  title: string;
  type: typeof headingTypes[number];
  headingClass?: typeof headingClasses[number];
  alignment?: typeof headingAlignments[number];
  className?: Array<string> | string;
};

export const cfA1Heading = (
  {
    title,
    eyebrow,
    mustache,
    headingClass = defaultHeadingClass,
    type = defaultHeadingType,
    alignment = defaultHeadingAlignment,
    className = '',
  }: CFa1HeadingProps,
  ref?: string,
) => {
  return html`<${type}
    data-component="cf-a1-heading"
    data-alignment=${alignment}
    data-ref=${ref}
    class=${[headingClass, ...(Array.isArray(className) ? className : [className])].join(' ')}
  >
    ${eyebrow && html`<small data-ref="eyebrow">${eyebrow}</small>`}
    <span data-ref="title">${title}</span>
    ${mustache && html`<small data-ref="mustache">${mustache}</small>`}
  </${type}>`;
};
