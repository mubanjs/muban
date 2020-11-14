/* eslint-disable @typescript-eslint/naming-convention */
import { computed, ref } from '@vue/reactivity';
import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';
import { refComponents } from '../../../../src/lib/utils/refs/refDefinitions';

import './accordion.css';

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
  setup(props, refs) {
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
      bind(refs.slideWrapper, { css: computed(() => ({ expanded: !!props.expanded })) }),
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
  setup(props, refs) {
    const activeIndex = ref<null | number>(
      refs.slides.components.findIndex((instance) => !!instance.props.expanded),
    );
    return [
      ...refs.slides.refs.map((Ref, index) =>
        bind(Ref, {
          onChange: (isExpanded) => {
            activeIndex.value = isExpanded ? index : null;
          },
          expanded: computed(() => activeIndex.value === index),
        }),
      ),
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
    data-ref=${ifDefined(ref)}
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

export function accordion({ slides, activeIndex }: AccordionProps) {
  return html`<div data-component=${Accordion.displayName}>
    ${slides.map(
      (slide, index) => accordionSlide({ ...slide, expanded: index === activeIndex }),
      'accordion-slide',
    )}
  </div>`;
}
