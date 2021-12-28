/* eslint-disable import/no-extraneous-dependencies */
import classNames from 'classnames';
import { html } from '@muban/template';

import 'lazysizes';
import 'lazysizes/plugins/object-fit/ls.object-fit';

import './cf-a3-image.scss';
import type { CfA3ImageTypes } from './CfA3Image.types';
import { defaultEnableLazyLoading, defaultEnableTransitionIn } from './CfA3Image.config';

/**
 * This component is dependant on the following libraries:
 * - https://www.npmjs.com/package/lazysizes
 */
export const cfA3Image = (
  {
    src,
    alt,
    sources = [],
    enableLazyLoading = defaultEnableLazyLoading,
    enableTransitionIn = defaultEnableTransitionIn,
    objectFit,
    className,
  }: CfA3ImageTypes,
  ref?: string,
) => html`<picture
  data-component="cf-a3-image"
  data-ref=${ref}
  class=${classNames(
    { [`fit-${objectFit}`]: objectFit, 'enable-transition-in': enableTransitionIn },
    className,
  )}
>
  ${sources.map((source) => html`<source ...${source} />`)}
  <img src=${src} alt=${alt} class=${classNames({ lazyload: enableLazyLoading })} />
</picture>`;
