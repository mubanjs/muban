import { bind, defineComponent, propType, supportLazy } from '../../../../../src';

import './cf-a2-icon.scss';
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

export const lazy = supportLazy(CfA2Icon);
