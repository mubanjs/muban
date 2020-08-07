import { refCollection } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, CollectionRef } from '../../JSX.Reactive';

type Props = {
  onChange?: (value: Array<string>) => void;
};
type Refs = {
  checkboxes: CollectionRef<HTMLInputElement>;
};

export default defineComponent<Props, Refs>({
  name: 'filter-products-checklist',
  props: {
    onChange: Function,
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
