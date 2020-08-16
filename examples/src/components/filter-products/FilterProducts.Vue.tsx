/* eslint-disable @typescript-eslint/no-explicit-any */
import { refCollection, refComponent } from '../../Component';
import { defineComponent } from '../../Component.Vue';
import { createElement, Fragment } from '../../JSX.Vue';
import { useTransitionController } from '../../useTransitionController';
import FilterProductsChecklist from './FilterProductsChecklist.Vue';

// const Container = <T extends any>(props: { ref: any; data: T; children: (data: T) => any }) => {
//   return props;
// };

export default defineComponent({
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
        timeline.fromTo(element, 2, { opacity: 0 }, { opacity: 1 });
      },
      setupTransitionOutTimeline(timeline) {
        timeline.fromTo(element, 2, { opacity: 1 }, { opacity: 0 });
      },
    });

    refs.categories({ onChange: (value) => console.log(value) });

    return (
      <>
        <refs.categories onChange={(value) => console.log('CHANGED', value)} />

        {/*<Container ref={refs.cards} data={[] as Array<{ title: string }>}>
          {(data) => data.map((item) => <div>{item.title}</div>)}
        </Container>*/}
      </>
    );
  },
});
