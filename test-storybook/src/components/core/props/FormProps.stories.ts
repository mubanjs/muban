/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { either, test } from 'isntnt';
import { bind, defineComponent, propType, computed, ref } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';

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
      formData: propType.object.source({ type: 'form', target: 'formRef' }),
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
      checkboxOffStringRef: 'checkboxOffStringRef', // This wont show up in the info as it's undefined
      checkboxOffValueStringRef: 'checkboxOffValueStringRef', // This wont show up in the info as it's undefined
      selectRef: 'selectRef',
      multiSelectRef: 'multiSelectRef',
      formRef: 'formRef',
    },
  ),
  template: () => html`<div data-component="props">
    <form data-ref="formRef">
      <input
        data-ref="inputTextRef"
        name="email"
        type="email"
        value="juan.polanco@mediamonks.com"
      /><br />
      <input data-ref="inputNumberRef" name="age" type="number" value="31" /><br />
      <input data-ref="inputBooleanRef" type="text" value="true" /><br />
      <input data-ref="inputDateRef" type="text" value="2022-01-01" /><br />
      <input data-ref="inputObjectRef" type="text" value='{"foo": "bar"}' /><br />
      <input data-ref="inputArrayRef" type="text" value="[1, 2, 3, 4]" /><br />
      <input data-ref="checkboxOnBooleanRef" type="checkbox" checked /><br />
      <input data-ref="checkboxOnStringRef" type="checkbox" checked /><br />
      <input data-ref="checkboxOnValueStringRef" type="checkbox" value="foo" checked /><br />
      <input data-ref="checkboxOffBooleanRef" type="checkbox" /><br />
      <input data-ref="checkboxOffStringRef" type="checkbox" /><br />
      <input data-ref="checkboxOffValueStringRef" type="checkbox" value="foo" /><br />
      <select data-ref="selectRef">
        <option value="foo" selected>foo</option>
        <option value="bar">bar</option>
      </select>
      <select data-ref="multiSelectRef" multiple>
        <option value="foo" selected>foo</option>
        <option value="bar">bar</option>
      </select>
      <pre data-ref="info"></pre>
    </form>
  </div>`,
});
