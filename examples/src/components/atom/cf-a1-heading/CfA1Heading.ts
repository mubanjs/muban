import { html, unsafeHTML } from '../../../../../src';

import './cf-a1-heading.scss';
import type { CFa1HeadingProps } from './CfA1Heading.types';
import {
  defaultHeadingAlignment,
  defaultHeadingClass,
  defaultHeadingType,
} from './CfA1Heading.config';

export const cfA1Heading = (
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
    class=${[
      headingClass,
      `is-aligned-${alignment}`,
      ...(Array.isArray(className) ? className : [className]),
    ].join(' ')}
  >
    ${eyebrow &&
    html`<small data-ref="eyebrow" class="heading-eyebrow">${unsafeHTML(eyebrow)}</small>`}
    <${linkTag} ...${link ?? {}} data-ref="title" class="heading-title">${unsafeHTML(title)}<//>
    ${mustache &&
    html`<small data-ref="mustache" class="heading-mustache">${unsafeHTML(mustache)}</small>`}
  <//>`;
};
