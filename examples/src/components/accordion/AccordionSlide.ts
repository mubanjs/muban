/* eslint-disable @typescript-eslint/naming-convention */
import { computed } from '@vue/reactivity';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';

export const AccordionSlide = defineComponent({
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
      bind(refs.slideHeading, {
        click: () => {
          props.onChange?.(!props.expanded);
        },
      }),
      bind(refs.slideWrapper, { css: computed(() => ({ expanded: props.expanded })) }),
    ];
  },
});
