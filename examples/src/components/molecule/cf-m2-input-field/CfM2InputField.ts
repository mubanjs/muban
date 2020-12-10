import {
  bind,
  defineComponent,
  html,
  propType,
  refComponent,
  refElement,
} from '../../../../../src';
import classNames from 'classnames';

import './cf-m2-input-field.scss';
import type { CfM2InputFieldTypes } from './CfM2InputField.types';
import { useToggle } from '../../../hooks/useToggle';
import { computed } from '@vue/reactivity';
import { CfM1Button, cfM1Button } from '../cf-m1-button/CfM1Button';
import { defaultInputTypeOption } from './CfM2InputField.config';

export const CfM2InputField = defineComponent({
  name: 'cf-m2-input-field',
  props: {
    isVisible: propType.boolean.optional.defaultValue(false),
    inputType: propType.string,
  },
  refs: {
    viewPasswordButton: refComponent(CfM1Button, {
      ref: 'view-password-button',
      isRequired: false,
    }),
    inputField: refElement('input-field', {
      isRequired: true,
    }),
  },
  setup({ props, refs }) {
    const [isVisible, toggleIsVisible] = useToggle(props.isVisible);

    return [
      bind(refs.inputField, {
        attr: {
          type: computed(() => (isVisible.value ? 'text' : props.inputType)),
        },
      }),
      bind(refs.viewPasswordButton, {
        onClick: () => toggleIsVisible(),
        icon: computed(() => (isVisible.value ? 'eye-open' : 'eye-closed')),
      }),
    ];
  },
});

export const cfM2InputField = (
  { className, label, note, value, type = defaultInputTypeOption, ...props }: CfM2InputFieldTypes,
  ref?: string,
) => {
  const notes = Array.isArray(note) ? note : [note];

  return html`<div
    data-component=${CfM2InputField.displayName}
    data-ref=${ref}
    data-input-type=${type}
    ...${{ class: className ? classNames(className) : null }}
  >
    <label>
      <span class="input-label">${label}</span>
      <div class="input-field-wrapper">
        ${type === 'textarea'
          ? html` <textarea class="input-field" data-ref="input-field" ...${props}>
${value}</textarea
            >`
          : html`<input
              class="input-field"
              data-ref="input-field"
              value=${value}
              type=${type}
              ...${props}
            />`}
        ${type === 'password' &&
        cfM1Button(
          {
            icon: 'eye-open',
            ariaLabel: 'Toggle password visibility',
            className: 'view-password-button',
            size: 'small',
          },
          'view-password-button',
        )}
      </div>
      ${notes.map((note) => html`<small class="input-note">${note}</small>`)}
    </label>
  </div>`;
};
