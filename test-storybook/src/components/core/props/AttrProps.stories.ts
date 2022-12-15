/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';
import { screen, queryByAttribute } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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
  template: () => html` <div data-component="props" data-testid="props-attr-data-string-story">
    <input data-ref="input" value="success" />
    <pre data-ref="info"></pre>
  </div>`,
});
DataString.play = async () => {
  const storyContainer = screen.getByTestId('props-attr-data-string-story')!;
  const input = queryByAttribute('data-ref', storyContainer, 'input') as HTMLInputElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  const initialValue = input.value;
  const extractedValue = JSON.parse(info.textContent!);
  expect(extractedValue.value).toBe(initialValue.toString());
  expect(extractedValue.namedValue).toBe(initialValue.toString());
};

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
  template: () => html` <div data-component="props" data-testid="props-attr-data-number-story">
    <input type="number" data-ref="input" value="42" />
    <pre data-ref="info"></pre>
  </div>`,
});
DataNumber.play = async () => {
  const storyContainer = screen.getByTestId('props-attr-data-number-story')!;
  const input = queryByAttribute('data-ref', storyContainer, 'input') as HTMLInputElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  const initialValue = input.value;
  const extractedValue = JSON.parse(info.textContent!);
  expect(extractedValue.value).toBe(parseInt(initialValue));
  expect(extractedValue.namedValue).toBe(parseInt(initialValue));
};

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
  template: () => html` <div data-component="props" data-testid="props-attr-data-boolean-story">
    <input type="checkbox" data-ref="input-checked" checked />
    <input type="checkbox" data-ref="input-unchecked" />
    <pre data-ref="info"></pre>
  </div>`,
});
DataBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-attr-data-boolean-story')!;
  const check = queryByAttribute('data-ref', storyContainer, 'input-checked') as HTMLInputElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  const initialCheckedValue = check.checked;
  const extractedValue = JSON.parse(info.textContent!);
  expect(extractedValue.checked).toBe(initialCheckedValue);
  expect(extractedValue.checkedValue).toBe(initialCheckedValue);
};

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
  template: () => html` <div data-component="props" data-testid="props-attr-data-date-story">
    <input type="date" data-ref="input" value="2021-11-24" />
    <pre data-ref="info"></pre>
  </div>`,
});
DataDate.play = async () => {
  const storyContainer = screen.getByTestId('props-attr-data-date-story')!;
  const input = queryByAttribute('data-ref', storyContainer, 'input') as HTMLInputElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  const initialValue = input.value;
  const extractedValue = JSON.parse(info.textContent!);
  expect(new Date(extractedValue.value).getTime()).toBe(new Date(initialValue).getTime());
  expect(new Date(extractedValue.namedValue).getTime()).toBe(new Date(initialValue).getTime());
};
