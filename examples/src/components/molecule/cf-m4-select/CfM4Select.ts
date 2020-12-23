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
import { getSelectedValues } from './CfM4Select.utils';
import { useClickedOutside } from '../../../hooks/useClickedOutside';

/**
 * This component is dependant on the following 3rd party libraries:
 * - gsap
 * - ts-key-enum
 * - dom-focus-lock
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
    const [isExpanded, toggleIsExpanded] = useSelectExpanding(
      refs.customSelectOptionsWrapper,
      refs.customSelectButton,
    );

    useClickedOutside(element, () => toggleIsExpanded(false));

    const selectOptionsData = ref<Array<Omit<SelectOption, 'selected'>>>(
      extractFromHTML(element, selectOptionExtractConfig),
    );

    const selectedOptionsValue = ref<Array<string>>(
      getSelectedValues(refs.selectElementOptions.elements),
    );

    const selectedOptions = computed(() =>
      selectOptionsData.value.filter((option) => selectedOptionsValue.value.includes(option.value)),
    );

    return [
      bind(refs.selectElement, {
        event: {
          change: () => {
            selectedOptionsValue.value = getSelectedValues(refs.selectElementOptions.elements);
          },
        },
      }),
      bind(refs.customSelectButton, {
        onClick: () => toggleIsExpanded(),
        label: computed(() => {
          if (props.multiple) {
            const selectedOptionsCount = selectedOptions.value.length;

            return `${props.placeholder} ${
              selectedOptionsCount > 0 ? `(${selectedOptionsCount})` : ''
            }`;
          }

          // By default only one value can be selected so use that one as the label
          return selectedOptions.value[0]?.label ?? props.placeholder;
        }),
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
              // Just like a native select we close it once a user clicks on a value.
              toggleIsExpanded(false);
            }
          });

          // Make sure we dispatch a change event on the select element so we can still add native event listeners.
          refs.selectElement.element?.dispatchEvent(new Event('change'));
        },
        attr: {
          'aria-selected': computed(() =>
            selectedOptionsValue.value.includes(ref.element?.value ?? ''),
          ),
        },
      })),
    ];
  },
});
