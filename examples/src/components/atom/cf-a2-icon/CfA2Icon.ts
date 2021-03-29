import { html } from '@muban/template';
import { bind, defineComponent, propType } from '../../../../../src';
import classNames from 'classnames';

import './cf-a2-icon.scss';
import type { CfA2IconTypes } from './CfA2Icon.types';
import { isIcon, svgContext } from './CfA2Icon.config';
import { computed } from '@vue/reactivity';

export const CfA2Icon = defineComponent({
  name: 'cf-a2-icon',
  props: {
    name: propType.string.validate(isIcon),
  },
  setup({ props, refs }) {
    return [
      bind(refs.self, {
        html: computed(() => (props.name ? svgContext(`./${props.name}.svg`) : '')),
      }),
    ];
  },
});

export const cfA2Icon = ({ name, className }: CfA2IconTypes, ref?: string) => html`<span
  data-component=${CfA2Icon.displayName}
  data-name=${name}
  data-ref=${ref}
  ...${{ class: className ? classNames(className) : null }}
/>`;
