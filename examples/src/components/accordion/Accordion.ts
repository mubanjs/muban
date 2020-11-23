/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bind, bindMap } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';
import { refComponents } from '../../../../src/lib/utils/refs/refDefinitions';

import './accordion.css';
import { classMap } from '../../../../src/lib/utils/template/classMap';
import { html } from '../../../../src/lib/utils/template/mhtml';

const AccordionSlide = defineComponent({
  name: 'accordion-slide',
  props: {
    expanded: propType.boolean.defaultValue(false),
    onChange: propType.func.shape<(isExpanded: boolean) => void>(),
  },
  refs: {
    slideWrapper: 'slide-wrapper',
    slideHeading: 'slide-heading',
    slideContent: 'slide-content',
  },
  setup({ props, refs }) {
    // const [isToggled, toggle] = useToggle(false);
    //
    // watch(
    //   () => props.expanded,
    //   (isExpanded) => {
    //     toggle(isExpanded);
    //   },
    // );
    //
    // watch(
    //   () => isToggled.value,
    //   (isExpanded) => {
    //     props.onChange?.(isExpanded);
    //   },
    // );
    return [
      bind(refs.slideWrapper, { css: computed(() => ({ expanded: props.expanded })) }),
      bind(refs.slideHeading, {
        click: () => {
          props.onChange?.(!props.expanded);
        },
      }),
    ];
  },
});

const Accordion = defineComponent({
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

export default Accordion;

// eslint-disable-next-line @typescript-eslint/ban-types
type AccordionSlideProps = {
  heading: string;
  content: string;
  expanded?: boolean;
};

export function accordionSlide({ heading, content, expanded }: AccordionSlideProps, ref?: string) {
  return html`<div
    data-component=${AccordionSlide.displayName}
    data-ref=${ref}
    data-expanded=${expanded}
  >
    <div data-ref="slide-wrapper" class=${classMap({ expanded: !!expanded })}>
      <h4 data-ref="slide-heading">${heading}</h4>
      <p data-ref="slide-content">${content}</p>
    </div>
  </div>`;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type AccordionProps = {
  slides: Array<AccordionSlideProps>;
  activeIndex?: number;
};

export function accordion({ slides, activeIndex }: AccordionProps, ref?: string) {
  return html`<div data-component=${Accordion.displayName} data-ref=${ref}>
    ${slides.map((slide, index) =>
      accordionSlide({ ...slide, expanded: index === activeIndex }, 'accordion-slide'),
    )}
  </div>`;
}
