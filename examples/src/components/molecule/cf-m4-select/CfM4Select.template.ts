import { defaultSelectMultiple } from './CfM4Select.config';
import type { CfM4SelectTypes } from './CfM4Select.types';
import { html } from '../../../../../src';
import classNames from 'classnames';
import { cfM1Button } from '../cf-m1-button/CfM1Button';
import { cfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';
import { CfM4Select } from './CfM4Select';

export const cfM4Select = (
  {
    className,
    placeholder,
    name,
    multiple = defaultSelectMultiple,
    options,
    ...props
  }: CfM4SelectTypes,
  ref?: string,
) => {
  return html`<div
    data-component=${CfM4Select.displayName}
    data-ref=${ref}
    data-multiple=${multiple}
    data-placeholder=${placeholder}
    ...${{ class: className ? classNames(className) : null }}
  >
    <select data-ref="select-element" ...${props} name=${name} multiple=${multiple} inert>
      <option>${placeholder}</option>
      ${options.map(
        ({ value, label, selected }) =>
          html`<option data-ref="select-element-option" value=${value} ...${{ selected }}>
            ${label}
          </option>`,
      )}
    </select>
    <div class="custom-select">
      ${cfM1Button(
        {
          label: placeholder,
          size: 'medium',
          icon: 'arrow-down',
          iconAlignment: 'right',
          className: 'select-button',
        },
        'custom-select-button',
      )}
      <div class="options-wrapper" data-ref="custom-select-options-wrapper">
        <div class="scroll-container">
          <ul class="select-options">
            ${options.map(
              ({ label, value, selected }) => html`<li class="select-option">
                <button
                  data-ref="custom-select-option"
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
