import { defineComponent, html } from '../../../../../src';
import classNames from 'classnames';

import 'lazysizes';
import 'lazysizes/plugins/object-fit/ls.object-fit';

import './cf-a3-image.scss';
import type { CfA3ImageTypes } from './CfA3Image.types';
import { defaultEnableLazyLoading, defaultEnableTransitionIn } from './CfA3Image.config';

export const CfA3Image = defineComponent({
  name: 'cf-a3-image',
  setup({ props, refs }) {
    return [];
  },
});

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
  data-component=${CfA3Image.displayName}
  data-ref=${ref}
  class=${classNames(
    { [`fit-${objectFit}`]: objectFit, 'enable-transition-in': enableTransitionIn },
    className,
  )}
>
  ${sources.map((source) => html`<source ...${source} />`)}
  <img src=${src} alt=${alt} class=${classNames({ lazyload: enableLazyLoading })} />
</picture>`;
