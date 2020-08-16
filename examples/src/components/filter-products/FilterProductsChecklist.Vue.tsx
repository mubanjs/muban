import { refCollection } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment } from '../../JSX.Vue';
import { propType } from '../../prop-types';

export default defineComponent({
  name: 'filter-products-checklist',
  props: {
    onChange: propType.func.shape<(value: Array<string>) => void>().optional,
  },
  refs: {
    checkboxes: refCollection('checkbox'),
  },
  setup(props, refs) {
    return (
      <>
        <refs.checkboxes click={() => props?.onChange?.(['foo'])} />
      </>
    );
  },
});
