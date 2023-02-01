/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html, jsonScriptTemplate } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';
import isValidJson from '../../../utils/isValidJson';

export default {
  title: 'core/props/default',
};

const getInfoBinding = (refs: any, props: any) =>
  bind(refs.info, {
    text: computed(() => JSON.stringify(props, null, 2)),
  });

const createPropsComponent = (props: Record<string, PropTypeDefinition>) => {
  return defineComponent({
    name: 'props',
    refs: {
      info: 'info',
    },
    props,
    setup({ props, refs }) {
      console.log('props', props);
      return [getInfoBinding(refs, props)];
    },
  });
};

export const DataString: Story = () => ({
  component: createPropsComponent({
    status: propType.string,
    statusMissing: propType.string,
    statusMissingWithDefault: propType.string.defaultValue('stringDefault'),
  }),
  template: () => html` <div
    data-component="props"
    data-status="success"
    data-testid="props-default-data-string-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataString.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-string-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.status).not.toBe(undefined);
  expect(parsedInfo.status).toBe(storyContainer.dataset.status);
  expect(parsedInfo.statusMissingWithDefault).toBe('stringDefault');
};

export const DataNumber: Story = () => ({
  component: createPropsComponent({
    value: propType.number,
  }),
  template: () => html` <div
    data-component="props"
    data-value="12.34"
    data-testid="props-default-data-number-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataNumber.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-number-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.value).not.toBe(undefined);
  expect(parsedInfo.value).toBe(+storyContainer.dataset.value!);
};

export const DataBoolean: Story = () => ({
  component: createPropsComponent({
    active: propType.boolean,
    isMissing: propType.boolean,
    isMissingWithDefault: propType.boolean.defaultValue(true),
    isPresentWithDefault: propType.boolean.defaultValue(true),
    isPresentWithDefaultDynamic: propType.boolean.defaultValue(true),
  }),
  template: () => html` <div
    data-component="props"
    data-active="true"
    data-is-present-with-default="false"
    data-is-present-with-default-dynamic=${false}
    data-testid="props-default-data-boolean-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-boolean-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.active).not.toBe(undefined);
  expect(storyContainer.dataset.isPresentWithDefault).not.toBe(undefined);
  expect(storyContainer.dataset.isPresentWithDefaultDynamic).toBe(undefined);
  expect(parsedInfo.active).toBe(!!storyContainer.dataset.active!);
  expect(parsedInfo.isMissing).toBe(undefined);
  expect(parsedInfo.isMissingWithDefault).toBe(true);
  expect(parsedInfo.isPresentWithDefault).toBe(false);
  expect(parsedInfo.isPresentWithDefaultDynamic).toBe(true);
};

export const DataArray: Story = () => ({
  component: createPropsComponent({
    values: propType.array,
  }),
  template: () => html` <div
    data-component="props"
    data-values=${JSON.stringify(['success', 12.34, true, new Date()])}
    data-testid="props-default-data-array-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataArray.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-array-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.values).not.toBe(undefined);
  expect(isValidJson(storyContainer.dataset.values!)).toBe(true);
  expect(parsedInfo.values).toStrictEqual(JSON.parse(storyContainer.dataset.values!));
};

export const DataObject: Story = () => ({
  component: createPropsComponent({
    result: propType.object,
  }),
  template: () => html` <div
    data-component="props"
    data-result=${JSON.stringify({
      status: 'success',
      value: 12.34,
      active: true,
      created: new Date(),
    })}
    data-testid="props-default-data-object-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataObject.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-object-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.result).not.toBe(undefined);
  expect(isValidJson(storyContainer.dataset.result!)).toBe(true);
  expect(parsedInfo.result).toStrictEqual(JSON.parse(storyContainer.dataset.result!));
};

export const DataDate: Story = () => ({
  component: createPropsComponent({
    date: propType.date,
  }),
  template: () => html` <div
    data-component="props"
    data-date=${new Date().toISOString()}
    data-testid="props-default-data-date-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
DataDate.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-date-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(storyContainer.dataset.date).not.toBe(undefined);
  expect(parsedInfo.date).toBe(storyContainer.dataset.date!);
};

export const JsonData: Story = () => ({
  component: createPropsComponent({
    status: propType.string,
    value: propType.number,
    active: propType.boolean,
    created: propType.date,
    values: propType.array,
    result: propType.object,
  }),
  template: () => html` <div data-component="props" data-testid="props-default-data-json-story">
    ${jsonScriptTemplate({
      status: 'success',
      value: 12.45,
      active: true,
      values: ['success', 12.34, true],
      result: { status: 'success', value: 12.34, active: true, created: new Date() },
      created: new Date(),
    })}
    <pre data-ref="info"></pre>
  </div>`,
});
JsonData.play = async () => {
  const storyContainer = screen.getByTestId('props-default-data-json-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  const script = storyContainer.querySelector('script');
  expect(script).not.toBe(undefined);
  expect(script?.textContent).not.toBe(undefined);
  expect(isValidJson(script?.textContent!)).toBe(true);
  expect(parsedInfo).toStrictEqual(JSON.parse(script?.textContent!));
};

export const CssBoolean: Story = () => ({
  component: createPropsComponent({
    isActive: propType.boolean,
    isExpanded: propType.boolean,
    isMissing: propType.boolean,
    isMissingWithDefault: propType.boolean.defaultValue(true),
    isMissingWithDefaultData: propType.boolean.defaultValue(true).source({ type: 'data' }),
  }),
  template: () => html` <div
    data-component="props"
    class="is-active isExpanded"
    data-testid="props-default-css-boolean-story"
  >
    <pre data-ref="info"></pre>
  </div>`,
});
CssBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-default-css-boolean-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.isActive).toBe(true);
  expect(parsedInfo.isExpanded).toBe(true);
  expect(parsedInfo.isMissingWithDefault).toBe(true);
  expect(parsedInfo.isMissingWithDefaultData).toBe(true);
};
