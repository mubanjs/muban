/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed, ref } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';
import { screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'core/props/form',
};

const getInfoBinding = (refs: any, props: any) =>
  bind(refs.info, {
    text: computed(() => JSON.stringify(props, null, 2)),
  });

const createPropsComponent = (
  props: Record<string, PropTypeDefinition>,
  refs: Record<string, ComponentRefItem> = {},
) => {
  return defineComponent({
    name: 'props',
    refs: {
      info: 'info',
      ...refs,
    },
    props,
    setup({ props, refs }) {
      return [getInfoBinding(refs, props)];
    },
  });
};

export const Form: Story = () => ({
  component: createPropsComponent(
    {
      inputText: propType.string.source({ type: 'form', target: 'inputTextRef' }),
      inputNumber: propType.number.source({ type: 'form', target: 'inputNumberRef' }),
      inputBoolean: propType.boolean.source({ type: 'form', target: 'inputBooleanRef' }),
      inputDate: propType.date.source({ type: 'form', target: 'inputDateRef' }),
      inputObject: propType.object.source({ type: 'form', target: 'inputObjectRef' }),
      inputArray: propType.array.source({ type: 'form', target: 'inputArrayRef' }),
      checkboxOnBoolean: propType.boolean.source({ type: 'form', target: 'checkboxOnBooleanRef' }),
      checkboxOnString: propType.string.source({ type: 'form', target: 'checkboxOnStringRef' }),
      checkboxOnValueString: propType.string.source({
        type: 'form',
        target: 'checkboxOnValueStringRef',
      }),
      checkboxOffBoolean: propType.boolean.source({
        type: 'form',
        target: 'checkboxOffBooleanRef',
      }),
      checkboxOffString: propType.string.source({ type: 'form', target: 'checkboxOffStringRef' }),
      checkboxOffValueString: propType.string.source({
        type: 'form',
        target: 'checkboxOffValueStringRef',
      }),
      selectText: propType.string.source({ type: 'form', target: 'selectRef' }),
      multiSelectText: propType.number.source({ type: 'form', target: 'multiSelectRef' }),
      radio: propType.string.source({ type: 'form', target: 'radioRef' }),
    },
    {
      inputTextRef: 'inputTextRef',
      inputNumberRef: 'inputNumberRef',
      inputBooleanRef: 'inputBooleanRef',
      inputDateRef: 'inputDateRef',
      inputObjectRef: 'inputObjectRef',
      inputArrayRef: 'inputArrayRef',
      checkboxOnBooleanRef: 'checkboxOnBooleanRef',
      checkboxOnStringRef: 'checkboxOnStringRef',
      checkboxOnValueStringRef: 'checkboxOnValueStringRef',
      checkboxOffBooleanRef: 'checkboxOffBooleanRef',
      checkboxOffStringRef: 'checkboxOffStringRef', // This won't show up in the info as it's undefined
      checkboxOffValueStringRef: 'checkboxOffValueStringRef', // This won't show up in the info as it's undefined
      selectRef: 'selectRef',
      multiSelectRef: 'multiSelectRef',
      formRef: 'formRef',
      radioRef: 'radioRef',
    },
  ),
  template: () => html`<div data-component="props">
    <form data-ref="formRef" style="max-width: 500px">
      <fieldset class="form-group">
        <legend class="mt-4">Text Inputs</legend>
        ${inputTemplate('inputTextRef', 'Email', {
          layout: 'column',
          value: 'juan.polanco@mediamonks.com',
          type: 'email',
        })}
        ${inputTemplate('inputNumberRef', 'Age', {
          layout: 'column',
          value: '31',
          type: 'number',
        })}
        ${inputTemplate('inputBooleanRef', 'Boolean', {
          layout: 'column',
          value: 'true',
        })}
        ${inputTemplate('inputDateRef', 'Date', {
          layout: 'column',
          value: '2022-01-01',
        })}
        ${inputTemplate('inputObjectRef', 'Object', {
          layout: 'column',
          type: 'textarea',
          value: '{"foo": "bar"}',
        })}
        ${inputTemplate('inputArrayRef', 'Array', {
          layout: 'column',
          type: 'textarea',
          value: '[1, 2, 3, 4]',
        })}
      </fieldset>
      <fieldset class="form-group">
        <legend class="mt-4">Checkboxes</legend>
        ${inputTemplate('checkboxOnBooleanRef', 'Checkbox On Boolean', {
          type: 'checkbox',
          checked: true,
        })}
        ${inputTemplate('checkboxOnStringRef', 'Checkbox On String', {
          type: 'checkbox',
          checked: true,
        })}
        ${inputTemplate('checkboxOnValueStringRef', 'Checkbox On String Value', {
          type: 'checkbox',
          checked: true,
          value: 'foo',
        })}
        ${inputTemplate('checkboxOffBooleanRef', 'Checkbox Off Boolean', {
          type: 'checkbox',
        })}
        ${inputTemplate('checkboxOffStringRef', 'Checkbox Off String', {
          type: 'checkbox',
        })}
        ${inputTemplate('checkboxOffValueStringRef', 'Checkbox Off String Value', {
          type: 'checkbox',
          value: 'foo',
        })}
      </fieldset>
      ${inputTemplate('selectRef', 'Single Select', {
        type: 'select',
        options: [
          ['foo', 'foo', true],
          ['bar', 'bar'],
        ],
      })}
      ${inputTemplate('multiSelectRef', 'Multiple Select', {
        type: 'select',
        multiple: true,
        options: [
          ['foo', 'foo', true],
          ['bar', 'bar'],
          ['bax', 'bax'],
          ['fox', 'fox', true],
        ],
      })}
      <fieldset class="form-group">
        <legend class="mt-4">Radio button</legend>
        ${inputTemplate('radioRef', 'Radio button', {
          layout: 'row',
          type: 'radio',
          value: 'foo',
          checked: true,
        })}
      </fieldset>
      <div class="alert alert-secondary mt-4">
        <pre data-ref="info" data-testid="infoJson"></pre>
      </div>
    </form>
  </div>`,
});

Form.play = async () => {
  const extractedJson = JSON.parse(screen.getByTestId('infoJson').innerText);
  await expect(screen.getByTestId('inputTextRef')).toHaveValue('juan.polanco@mediamonks.com');
  await expect(extractedJson.inputText).toBe('juan.polanco@mediamonks.com');
  await expect(screen.getByTestId('inputNumberRef')).toHaveValue(31);
  await expect(extractedJson.inputNumber).toBe(31);
  await expect(screen.getByTestId('inputBooleanRef')).toHaveValue('true');
  await expect(extractedJson.inputBoolean).toBe(true);
  await expect(screen.getByTestId('inputDateRef')).toHaveValue('2022-01-01');
  await expect(extractedJson.inputDate).toBe('2022-01-01T00:00:00.000Z');
  await expect(screen.getByTestId('inputObjectRef')).toHaveValue('{"foo": "bar"}');
  await expect(extractedJson.inputObject).toEqual({ foo: 'bar' });
  await expect(screen.getByTestId('inputArrayRef')).toHaveValue('[1, 2, 3, 4]');
  await expect(extractedJson.inputArray).toEqual([1, 2, 3, 4]);
  await expect(screen.getByTestId('checkboxOnBooleanRef')).toBeChecked();
  await expect(extractedJson.checkboxOnBoolean).toBe(true);
  await expect(screen.getByTestId('checkboxOnStringRef')).toBeChecked();
  await expect(extractedJson.checkboxOnString).toBe('on');
  await expect(screen.getByTestId('checkboxOnValueStringRef')).toBeChecked();
  await expect(extractedJson.checkboxOnValueString).toBe('foo');
  await expect(screen.getByTestId('checkboxOffBooleanRef')).not.toBeChecked();
  await expect(extractedJson.checkboxOffBoolean).toBe(false);
  await expect(screen.getByTestId('checkboxOffStringRef')).not.toBeChecked();
  await expect(extractedJson.checkboxOffString).toBe(undefined);
  await expect(screen.getByTestId('checkboxOffValueStringRef')).not.toBeChecked();
  await expect(extractedJson.checkboxOffValueString).toBe(undefined);
  await expect(screen.getByTestId('selectRef')).toHaveValue('foo');
  await expect(extractedJson.selectText).toBe('foo');
  await expect(screen.getByTestId('multiSelectRef')).toHaveValue(['foo', 'fox']);
  await expect(extractedJson.multiSelectText).toEqual(['foo', 'fox']);
  await expect(screen.getByTestId('radioRef')).toBeChecked();
  await expect(extractedJson.radio).toBe('foo');
};

type InputTemplateProps = {
  name?: string;
  type?: string;
  value?: string;
  layout?: 'row' | 'column';
  input?: string;
  checked?: boolean;
  options?: Array<[value: string, label: string, selected?: true]>;
  multiple?: boolean;
};
function inputTemplate(
  ref: string,
  label: string,
  { layout, name, type, value, checked, options, multiple }: InputTemplateProps,
) {
  if (type === 'checkbox' || type === 'radio') {
    return html`<div class="form-check">
      <input
        data-ref=${ref}
        data-testid=${ref}
        class="form-check-input"
        type="checkbox"
        id=${ref}
        name=${ref}
        checked=${checked}
        value=${value}
      />
      <label class="form-check-label" for=${ref}>${label}</label>
    </div> `;
  }
  if (type === 'select') {
    // TODO: select in row/column mode
    return html`<div class="form-group">
      <label for=${ref} class="form-label mt-4">${label}</label>
      <select data-ref=${ref} data-testid=${ref} class="form-select" id=${ref} multiple=${multiple}>
        ${(options ?? []).map(
          ([value, label, selected]) =>
            html`<option value=${value} selected=${selected}>${label}</option>`,
        )}
      </select>
    </div>`;
  }
  if (layout === 'column') {
    if (type === 'textarea') {
      return html`<div class="form-group row">
        <label for=${ref} class="col-sm-2 col-form-label">${label}</label>
        <div class="col-sm-10">
          <textarea
            data-ref=${ref}
            data-testid=${ref}
            class="form-control"
            id=${ref}
            name=${name ?? ref}
          >
            ${value}
          </textarea
          >
        </div>
      </div>`;
    }
    return html`<div class="form-group row">
      <label for=${ref} class="col-sm-2 col-form-label">${label}</label>
      <div class="col-sm-10">
        <input
          data-ref=${ref}
          data-testid=${ref}
          class="form-control"
          id=${ref}
          name=${name ?? ref}
          type=${type ?? 'text'}
          value=${value}
        />
      </div>
    </div>`;
  }
  if (layout === 'row') {
    return html`<div class="form-group">
      <label for=${ref} class="form-label mt-4">${label}</label>
      <input
        data-ref=${ref}
        data-testid=${ref}
        class="form-control"
        id=${ref}
        name=${name ?? ref}
        type=${type ?? 'text'}
        value=${value}
      />
    </div>`;
  }
  return html``;
}
