import { refCollection, refComponent } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, BindComponent } from '../../JSX.Reactive';
import FilterProductsChecklist from './FilterProductsChecklist.Vue';

type X = ReturnType<typeof FilterProductsChecklist>;

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type Refs = {
  categories: ReturnType<typeof FilterProductsChecklist>;
  colors: ReturnType<typeof FilterProductsChecklist>;
  cards: Array<HTMLDivElement>;
};

export default defineComponent<Props, Refs>({
  name: 'filter-products',
  props: {},
  refs: {
    categories: refComponent(FilterProductsChecklist, { ref: 'checklist-categories' }),
    colors: refComponent(FilterProductsChecklist, { ref: 'checklist-colors' }),
    cards: refCollection('card'),
  },
  setup(props, refs) {
    return (
      <>
        <BindComponent
          ref={refs.categories}
          onChange={(value: Array<string>) => console.log('CHANGED', value)}
        />
      </>
    );
  },
});
