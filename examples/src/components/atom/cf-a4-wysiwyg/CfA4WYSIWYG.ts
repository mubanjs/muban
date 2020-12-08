import { html, unsafeHTML } from '../../../../../src';
import classNames from 'classnames';

import './cf-a4-wysiwyg.scss';
import type { CfA4WYSIWYGTypes } from './CfA4WYSIWYG.types';
import { defaultContentAlignment } from './CfA4WYSIWYG.config';

export const cfA4WYSIWYG = (
  { className, alignment = defaultContentAlignment, content }: CfA4WYSIWYGTypes,
  ref?: string,
) => html`<div
  data-component="cf-a4-wysiwyg"
  data-ref=${ref}
  class=${classNames(`${alignment}-alignment`, className)}
>
  ${unsafeHTML(content)}
</div>`;
