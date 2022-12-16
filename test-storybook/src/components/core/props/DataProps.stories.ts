/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';
import { screen, queryByAttribute } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import isValidJson from '../../../utils/isValidJson';

export default {
  title: 'core/props/data',
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
      statusValue: propType.string.source({ type: 'data', target: 'props', name: 'status' }),
      missingValue: propType.string.optional.source({ type: 'data', target: 'props' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-string-story">
    <div data-ref="props" data-status="success"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataString.play = async () => {
  const storyContainer = screen.getByTestId('props-data-string-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.status).not.toBe(undefined);
  expect(parsedInfo.statusValue).toBe(props.dataset.status);
};

export const DataNumber: Story = () => ({
  component: createPropsComponent(
    {
      valueValue: propType.number.source({ type: 'data', target: 'props', name: 'value' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-number-story">
    <div data-ref="props" data-value="12.34"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataNumber.play = async () => {
  const storyContainer = screen.getByTestId('props-data-number-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.value).not.toBe(undefined);
  expect(parsedInfo.valueValue).toBe(+props.dataset.value!);
};

export const DataBoolean: Story = () => ({
  component: createPropsComponent(
    {
      activeValue: propType.boolean.source({ type: 'data', target: 'props', name: 'active' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-boolean-story">
    <div data-ref="props" data-active="true"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-data-boolean-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.active).not.toBe(undefined);
  expect(parsedInfo.activeValue).toBe(!!props.dataset.active!);
};

export const DataDate: Story = () => ({
  component: createPropsComponent(
    {
      createdValue: propType.date.source({ type: 'data', target: 'props', name: 'created' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-date-story">
    <div data-ref="props" data-created=${new Date().toISOString()}></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataDate.play = async () => {
  const storyContainer = screen.getByTestId('props-data-date-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.created).not.toBe(undefined);
  expect(parsedInfo.createdValue).toBe(props.dataset.created!);
};

export const DataArray: Story = () => ({
  component: createPropsComponent(
    {
      valuesValue: propType.array.source({ type: 'data', target: 'props', name: 'values' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-array-story">
    <div data-ref="props" data-values=${JSON.stringify(['success', 12.34, true, new Date()])}></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataArray.play = async () => {
  const storyContainer = screen.getByTestId('props-data-array-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.values).not.toBe(undefined);
  expect(isValidJson(props.dataset.values!)).toBe(true);
  expect(parsedInfo.valuesValue).toStrictEqual(JSON.parse(props.dataset.values!));
};

export const DataObject: Story = () => ({
  component: createPropsComponent(
    {
      resultValue: propType.object.source({ type: 'data', target: 'props', name: 'result' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-data-object-story">
    <div
      data-ref="props"
      data-result=${JSON.stringify({
        status: 'success',
        value: 12.34,
        active: true,
        created: new Date(),
      })}
    ></div>
    <pre data-ref="info"></pre>
  </div>`,
});
DataObject.play = async () => {
  const storyContainer = screen.getByTestId('props-data-object-story')!;
  const props = queryByAttribute('data-ref', storyContainer, 'props') as HTMLDivElement;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(props.dataset.result).not.toBe(undefined);
  expect(isValidJson(props.dataset.result!)).toBe(true);
  expect(parsedInfo.resultValue).toStrictEqual(JSON.parse(props.dataset.result!));
};

export const DataAny: Story = () => ({
  component: createPropsComponent({
    str: propType.any,
    strDefault: propType.any.defaultValue('default-value'),
    int: propType.any,
    intDefault: propType.any.defaultValue(42),
    bool: propType.any,
    boolDefault: propType.any.defaultValue(true),
  }),
  template: () => html` <div
    data-component="props"
    data-str="value"
    data-int="1"
    data-bool="true"
    data-testid="props-data-any-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataAny.play = async () => {
  const storyContainer = screen.getByTestId('props-data-any-story')!;
  const info = queryByAttribute('data-ref', storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.str).not.toBe(undefined);
  expect(parsedInfo.str).toBe(storyContainer.dataset.str);
  expect(parsedInfo.strDefault).toBe('default-value');
  expect(storyContainer.dataset.int).not.toBe(undefined);
  expect(parsedInfo.int).toBe(storyContainer.dataset.int);
  expect(parsedInfo.intDefault).toBe(42);
  expect(storyContainer.dataset.bool).not.toBe(undefined);
  expect(parsedInfo.bool).toBe(storyContainer.dataset.bool);
  expect(parsedInfo.boolDefault).toBe(true);
};
