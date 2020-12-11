import {
  bind,
  computed,
  defineComponent,
  html,
  refComponent,
  refElement,
} from '../../../../../src';
import classNames from 'classnames';

import './cf-m4-select.scss';

import { CfA2Icon, cfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';
import type { CfM4SelectTypes } from './CfM4Select.types';
import { CfM1Button, cfM1Button } from '../cf-m1-button/CfM1Button';
import { useToggle } from '../../../hooks/useToggle';
import { watch } from '@vue/runtime-core';

import { selectExpandDuration, selectExpandEase } from './CfM4Select.config';
import gsap from 'gsap';

/**
 * This component is dependant on the following 3rd party libraries:
 * - gsap
 * - ts-key-enum
 * -
 */
export const CfM4Select = defineComponent({
  name: 'cf-m4-select',
  components: [CfA2Icon],
  refs: {
    selectButton: refComponent(CfM1Button, { ref: 'select-button' }),
    optionsWrapper: refElement<HTMLDivElement>('options-wrapper'),
  },
  setup({ refs }) {
    const [isExpanded, toggleIsExpanded] = useToggle(false);

    watch(
      () => isExpanded.value,
      (value) => {
        if (refs.optionsWrapper.element === undefined) {
          throw new Error('The options wrapper cannot be found');
        }

        if (value) {
          gsap.set(refs.optionsWrapper.element, {
            height: 'auto',
          });

          // Then animate from 0
          gsap.from(refs.optionsWrapper.element, {
            height: 0,
            duration: selectExpandDuration,
            ease: selectExpandEase,
          });
        } else {
          gsap.to(refs.optionsWrapper.element, {
            height: 0,
            duration: selectExpandDuration,
            ease: selectExpandEase,
          });
        }
      },
      {
        immediate: true,
      },
    );

    return [
      bind(refs.selectButton, {
        onClick: () => toggleIsExpanded(),
        css: computed(() => ({
          'is-expanded': isExpanded.value,
        })),
      }),
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
        <div data-ref="scroll-container">
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
