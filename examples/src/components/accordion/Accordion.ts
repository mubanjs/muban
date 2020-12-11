/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bindMap } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { refComponents } from '../../../../src/lib/utils/refs/refDefinitions';

import './accordion.scss';
import { AccordionSlide } from './AccordionSlide';

export const Accordion = defineComponent({
  name: 'accordion',
  refs: {
    slides: refComponents(AccordionSlide),
  },
  setup({ refs }) {
    const activeIndex = ref<null | number>(
      refs.slides.components.findIndex((instance) => !!instance.props.expanded),
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
