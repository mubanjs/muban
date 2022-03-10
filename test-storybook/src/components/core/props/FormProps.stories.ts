/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { either, test } from 'isntnt';
import { bind, defineComponent, propType, computed, ref } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';

export default {
  title: 'core/props/form',
};

const getInfoBinding = (refs: any, props: any) => {
  console.log(props);
  return bind(refs.info, {
    text: computed(() => JSON.stringify(props, null, 2)),
  });
};

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

/* string
number
boolean
date
object
array */

export const Form: Story = () => ({
  component: createPropsComponent(
    {
      inputText: propType.string.source({ type: 'form', target: 'inputTextRef' }),
      inputNumber: propType.number.source({ type: 'form', target: 'inputNumberRef' }),
      inputBoolean: propType.boolean.source({ type: 'form', target: 'inputBooleanRef' }),
      inputDate: propType.date.source({ type: 'form', target: 'inputDateRef' }),
      inputObject: propType.object.source({ type: 'form', target: 'inputObjectRef' }),
      inputArray: propType.array.source({ type: 'form', target: 'inputArrayRef' }),
    },
    {
      inputTextRef: 'inputTextRef',
      inputNumberRef: 'inputNumberRef',
      inputBooleanRef: 'inputBooleanRef',
      inputDateRef: 'inputDateRef',
      inputObjectRef: 'inputObjectRef',
      inputArrayRef: 'inputArrayRef',
    },
  ),
  template: () => html`<form data-component="props">
    <h2>Input</h2>
    <input data-ref="inputTextRef" type="email" value="juan.polanco@mediamonks.com" /><br />
    <input data-ref="inputNumberRef" type="number" value="31" /><br />
    <input data-ref="inputBooleanRef" type="text" value="true" /><br />
    <input data-ref="inputDateRef" type="text" value="2022-01-01" /><br />
    <input data-ref="inputObjectRef" type="text" value='{"foo": "bar"}' /><br />
    <input data-ref="inputArrayRef" type="text" value="[1, 2, 3, 4]" /><br />
    <pre data-ref="info"></pre>
  </form>`,
});
