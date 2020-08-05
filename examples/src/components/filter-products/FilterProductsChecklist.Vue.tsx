import { refCollection } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, BindCollection } from '../../JSX.Reactive';

type Props = {
  onChange?: (value: Array<string>) => void;
};
type Refs = {
  checkboxes: Array<HTMLInputElement>;
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
        <BindCollection ref={refs.checkboxes} click={() => props.onChange(['foo'])} />
      </>
    );
  },
});
