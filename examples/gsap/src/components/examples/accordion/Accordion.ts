/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import { defineComponent } from '../../../../../../src/lib/Component';
import { bindMap } from '../../../../../../src/lib/bindings/bindingDefinitions';
import { refComponents } from '../../../../../../src/lib/refs/refDefinitions';

import './accordion.scss';
import { AccordionSlide } from './AccordionSlide';

export const Accordion = defineComponent({
  name: 'accordion',
  refs: {
    slides: refComponents(AccordionSlide),
  },
  setup({ refs }) {
    const activeIndex = ref<null | number>(
      refs.slides.getComponents().findIndex((instance) => !!instance.props.expanded),
    );

    return [
      ...bindMap(refs.slides, (ref, index) => ({
        onChange: (isExpanded) => {
          activeIndex.value = isExpanded ? index : null;
        },
        expanded: computed(() => activeIndex.value === index),
      })),
    ];
  },
});
