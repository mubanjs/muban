// eslint-disable-next-line import/no-extraneous-dependencies
import classNames from 'clsx';
import { html, unsafeHTML } from '@muban/template';

import type { CFa1HeadingProps } from './CfA1Heading.types';
import {
  defaultHeadingAlignment,
  defaultHeadingClass,
  defaultHeadingType,
} from './CfA1Heading.config';

export const cfA1HeadingTemplate = (
  {
    title,
    eyebrow,
    mustache,
    link,
    headingClass = defaultHeadingClass,
    type = defaultHeadingType,
    alignment = defaultHeadingAlignment,
    className = '',
  }: CFa1HeadingProps,
  ref?: string,
) => {
  const linkTag = link ? 'a' : 'span';

  return html`<${type}
    data-component="cf-a1-heading"
    data-ref=${ref}
    class=${classNames(headingClass, `is-aligned-${alignment}`, className)}
  >
    ${eyebrow &&
    html`<small data-ref="eyebrow" class="heading-eyebrow">${unsafeHTML(eyebrow)}</small>`}
    <${linkTag} ...${link ?? {}} data-ref="title" class="heading-title">${unsafeHTML(title)}<//>
    ${mustache &&
    html`<small data-ref="mustache" class="heading-mustache">${unsafeHTML(mustache)}</small>`}
  <//>`;
};
