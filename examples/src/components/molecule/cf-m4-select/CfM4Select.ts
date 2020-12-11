import {
  bind,
  bindMap,
  computed,
  defineComponent,
  propType,
  refCollection,
  refComponent,
  refElement,
} from '../../../../../src';

import './cf-m4-select.scss';

import { CfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';
import type { SelectOption } from './CfM4Select.types';
import { CfM1Button } from '../cf-m1-button/CfM1Button';

import { ref } from '@vue/reactivity';
import { useSelectExpanding } from './CfM4Select.hooks';
import { extractFromHTML } from 'html-extract-data';
import { selectOptionExtractConfig } from './CfM4Select.config';

/**
 * This component is dependant on the following 3rd party libraries:
 * - gsap
 * - ts-key-enum
 * -
 */
export const CfM4Select = defineComponent({
  name: 'cf-m4-select',
  components: [CfA2Icon],
  props: {
    selectedValue: propType.string.optional.defaultValue(undefined),
    placeholder: propType.string.optional,
    multiple: propType.boolean.optional,
  },
  refs: {
    selectElement: refElement<HTMLSelectElement>('select-element'),
    selectElementOptions: refCollection<HTMLOptionElement>('select-element-option'),

    customSelectButton: refComponent(CfM1Button, { ref: 'custom-select-button' }),
    customSelectOptions: refCollection<HTMLButtonElement>('custom-select-option'),
    customSelectOptionsWrapper: refElement('custom-select-options-wrapper'),
  },
  setup({ props, refs, element }) {
    const [isExpanded, toggleIsExpanded] = useSelectExpanding(refs.customSelectOptionsWrapper);

    const selectedOptions = ref<Array<SelectOption>>(
      extractFromHTML(element, selectOptionExtractConfig),
    );

    const selectedValue = ref<string | undefined>(props.selectedValue);
    const selectedOption = computed(() =>
      selectedOptions.value.find((option) => option.value === selectedValue.value),
    );

    return [
      // bind(refs.selectElement, {
      //   event: {
      //     change: (event) => {
      //       console.log('changeEvent', event);
      //     },
      //   },
      // }),
      bind(refs.customSelectButton, {
        onClick: () => toggleIsExpanded(),
        label: computed(() => selectedOption?.value?.label ?? props.placeholder),
        css: computed(() => ({
          'is-expanded': isExpanded.value,
        })),
      }),
      ...bindMap(refs.customSelectOptions, (ref) => ({
        click: () => {
          refs.selectElementOptions.elements.forEach((option) => {
            if (props.multiple) {
              option.selected =
                (option.selected && option.value !== ref.element?.value) ||
                (option.value === ref.element?.value && !option.selected);
            } else {
              option.selected = option.value === ref.element?.value;
            }
            // Make sure we dispatch a change event on the select element so we can still add native event listeners.
            refs.selectElement.element?.dispatchEvent(new Event('change'));
          });
        },
        attr: {
          'aria-selected': computed(() => selectedValue.value === ref.element?.value),
        },
      })),
    ];
  },
});
