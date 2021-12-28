/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { computed } from '@vue/reactivity';
import { bind, defineComponent, propType } from '../../../../../src';
import type { PropTypeDefinition } from '../../../../../src/lib/props/propDefinitions.types';
import type { ComponentRefItem } from '../../../../../src/lib/refs/refDefinitions.types';

export default {
  title: 'core/props/attr',
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

export const DataString: Story = () => ({
  component: createPropsComponent(
    {
      value: propType.string.source({ type: 'attr', target: 'input', name: 'value' }),
      namedValue: propType.string.source({ type: 'attr', target: 'input', name: 'value' }),
    },
    {
      input: 'input',
    },
  ),
  template: () => html` <div data-component="props">
    <input data-ref="input" value="success" />
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataNumber: Story = () => ({
  component: createPropsComponent(
    {
      value: propType.number.source({ type: 'attr', target: 'input', name: 'value' }),
      namedValue: propType.number.source({ type: 'attr', target: 'input', name: 'value' }),
    },
    {
      input: 'input',
    },
  ),
  template: () => html` <div data-component="props">
    <input type="number" data-ref="input" value="42" />
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataBoolean: Story = () => ({
  component: createPropsComponent(
    {
      checked: propType.boolean.source({ type: 'attr', target: 'inputChecked', name: 'checked' }),
      checkedValue: propType.boolean.source({
        type: 'attr',
        target: 'inputChecked',
        name: 'checked',
      }),
      uncheckedValue: propType.boolean.source({
        type: 'attr',
        target: 'inputUnchecked',
        name: 'checked',
      }),
    },
    {
      inputChecked: 'input-checked',
      inputUnchecked: 'input-unchecked',
    },
  ),
  template: () => html` <div data-component="props">
    <input type="checkbox" data-ref="input-checked" checked />
    <input type="checkbox" data-ref="input-unchecked" />
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataDate: Story = () => ({
  component: createPropsComponent(
    {
      value: propType.date.source({ type: 'attr', target: 'input', name: 'value' }),
      namedValue: propType.date.source({ type: 'attr', target: 'input', name: 'value' }),
    },
    {
      input: 'input',
    },
  ),
  template: () => html` <div data-component="props">
    <input type="date" data-ref="input" value="2021-11-24" />
    <pre data-ref="info"></pre>
  </div>`,
});
