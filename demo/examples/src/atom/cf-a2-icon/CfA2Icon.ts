import { computed } from '@vue/reactivity';
import { bind, defineComponent, propType } from '../../../../../src';
import { isIcon, svgContext } from './CfA2Icon.config';

import './cf-a2-icon.scss';

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
