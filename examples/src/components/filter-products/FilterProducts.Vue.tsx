/* eslint-disable @typescript-eslint/no-explicit-any */
import { refCollection, refComponent } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment, ComponentRef } from '../../JSX.Reactive';
import { useTransitionController } from '../../useTransitionController';
import FilterProductsChecklist from './FilterProductsChecklist.Vue';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
type Refs = {
  categories: ComponentRef<typeof FilterProductsChecklist>;
  colors: ComponentRef<typeof FilterProductsChecklist>;
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
  setup(props, refs, { element }) {
    useTransitionController(refs, {
      setupTransitionInTimeline(timeline) {
        timeline.fromTo(element, 0.2, { opacity: 0 }, { opacity: 1 });
      },
      setupTransitionOutTimeline(timeline) {
        timeline.fromTo(element, 0.2, { opacity: 1 }, { opacity: 0 });
      },
    });

    return (
      <>
        <refs.categories onChange={(value) => console.log('CHANGED', value)} />
      </>
    );
  },
});
