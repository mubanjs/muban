import { bind, defineComponent, html, propType } from '../../../../../src';
import classNames from 'classnames';

import './cf-a3-icon.scss';
import type { CfA3IconTypes } from './CfA3Icon.types';
import { isIcon, svgContext } from './CfA3Icon.config';

export const CfA3Icon = defineComponent({
  name: 'cf-a3-icon',
  props: {
    name: propType.string.validate(isIcon),
  },
  setup({ props, refs }) {
    return [
      bind(refs.self, {
        html: svgContext(`./${props.name}.svg`),
      }),
    ];
  },
});

export const cfA3Icon = ({ name, className }: CfA3IconTypes, ref?: string) => html`<span
  data-component=${CfA3Icon.displayName}
  data-name=${name}
  data-ref=${ref}
  ...${{ class: className ? classNames(className) : null }}
/>`;
