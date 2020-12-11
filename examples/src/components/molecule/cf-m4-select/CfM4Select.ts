import {
  bind,
  bindMap,
  computed,
  defineComponent,
  html,
  propType,
  refCollection,
  refComponent,
  refElement,
} from '../../../../../src';
import classNames from 'classnames';

import './cf-m4-select.scss';

import { CfA2Icon, cfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';
import type { CfM4SelectTypes, SelectOption } from './CfM4Select.types';
import { CfM1Button, cfM1Button } from '../cf-m1-button/CfM1Button';

import { reactive, ref } from '@vue/reactivity';
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
  },
  refs: {
    selectButton: refComponent(CfM1Button, { ref: 'select-button' }),
    selectOptions: refCollection<HTMLButtonElement>('select-option'),
    optionsWrapper: refElement('options-wrapper'),
  },
  setup({ props, refs, element }) {
    const [isExpanded, toggleIsExpanded] = useSelectExpanding(refs.optionsWrapper);
    const selectedOptions = ref<Array<SelectOption>>(
      extractFromHTML(element, selectOptionExtractConfig),
    );

    const selectedValue = ref<string | undefined>(props.selectedValue);
    const selectedOption = computed(() =>
      selectedOptions.value.find((option) => option.value === selectedValue.value),
    );

    return [
      bind(refs.selectButton, {
        onClick: () => toggleIsExpanded(),
        label: computed(() => selectedOption?.value?.label ?? props.placeholder),
        css: computed(() => ({
          'is-expanded': isExpanded.value,
        })),
      }),
      ...bindMap(refs.selectOptions, (ref) => ({
        click: () => {
          selectedValue.value = (ref.element as HTMLButtonElement)?.value;
        },
        attr: {
          'aria-selected': computed(
            () => selectedValue.value === (ref.element as HTMLButtonElement)?.value,
          ),
        },
      })),
    ];
  },
});

export const cfM4Select = (
  { className, placeholder, name, options, ...props }: CfM4SelectTypes,
  ref?: string,
) => {
  return html`<div
    data-component=${CfM4Select.displayName}
    data-ref=${ref}
    data-placeholder=${placeholder}
    ...${{ class: className ? classNames(className) : null }}
  >
    <select ...${props} name=${name} inert>
      <option value="">${placeholder}</option>
      ${options.map(
        ({ value, label, selected }) =>
          html`<option value=${value} ...${{ selected }}>${label}</option>`,
      )}
    </select>
    <div class="select-wrapper">
      ${cfM1Button(
        {
          label: placeholder,
          size: 'medium',
          icon: 'arrow-down',
          iconAlignment: 'right',
          className: 'select-button',
        },
        'select-button',
      )}
      <div class="options-wrapper" data-ref="options-wrapper">
        <div class="scroll-container" data-ref="scroll-container">
          <ul class="select-options">
            ${options.map(
              ({ label, value, selected }) => html`<li class="select-option">
                <button
                  data-ref="select-option"
                  type="button"
                  value=${value}
                  role="option"
                  id="${name}-${value}"
                  aria-selected=${selected}
                >
                  <span class="copy-01 button-label">${label}</span>
                  ${cfA2Icon({ name: 'checkmark', className: 'option-checkmark' }, 'checkmark')}
                </button>
              </li>`,
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>`;
};
