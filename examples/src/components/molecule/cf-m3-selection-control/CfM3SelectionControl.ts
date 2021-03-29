import { html } from '@muban/template';
import { defineComponent } from '../../../../../src';
import classNames from 'classnames';

import './cf-m3-selection-control.scss';

import { CfA2Icon, cfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';
import type { CfM3SelectionControlTypes } from './CfM3SelectionControl.types';

export const CfM3SelectionControl = defineComponent({
  name: 'cf-m3-selection-control',
  components: [CfA2Icon],
  setup() {
    return [];
  },
});

/**
 * Google uses the same name for this component: https://material.io/components/selection-controls
 */
export const cfM3SelectionControl = (
  { className, label, note, type, ...props }: CfM3SelectionControlTypes,
  ref?: string,
) => {
  const notes = Array.isArray(note) ? note : [note];
  const inputType = type === 'toggle' ? 'checkbox' : type;

  return html`<div
    data-component=${CfM3SelectionControl.displayName}
    data-ref=${ref}
    data-input-type=${type}
    ...${{ class: className ? classNames(className) : null }}
  >
    <label class="input-wrapper">
      <input class="input-element" data-ref="input-field" type=${inputType} ...${props} />
      <div class="custom-input-element">
        ${type !== 'toggle' && cfA2Icon({ name: 'checkmark', className: 'custom-input-icon' })}
      </div>
      <span class="input-label">${label}</span>
    </label>
    ${notes.map((note) => html`<small class="input-note">${note}</small>`)}
  </div>`;
};
