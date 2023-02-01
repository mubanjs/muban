/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';
import isValidJson from '../../../utils/isValidJson';

export default {
  title: 'core/props/text',
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
      props: 'props',
      ...refs,
    },
    props,
    setup({ props, refs }) {
      return [getInfoBinding(refs, props)];
    },
  });
};

export const TextString: Story = () => ({
  component: createPropsComponent(
    {
      statusValue: propType.string.source({ type: 'text', target: 'props' }),
      statusValue2: propType.string.source({ type: 'text', target: 'props2' }),
    },
    {
      props2: 'props2',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-text-string-story">
    <div data-ref="props">success</div>
    <div data-ref="props2">Hello <strong>world</strong>!</div>
    <pre data-ref="info"></pre>
  </div>`,
});
TextString.play = async () => {
  const storyContainer = screen.getByTestId('props-text-string-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const props2 = queryByRef(storyContainer, 'props2') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.statusValue).toBe(props.textContent);
  expect(parsedInfo.statusValue2).toBe(props2.textContent);
};

export const TextNumber: Story = () => ({
  component: createPropsComponent({
    valueValue: propType.number.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props" data-testid="props-text-number-story">
    <div data-ref="props">12.34</div>
    <pre data-ref="info"></pre>
  </div>`,
});
TextNumber.play = async () => {
  const storyContainer = screen.getByTestId('props-text-number-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.valueValue).toBe(+props.textContent!);
};

export const TextBoolean: Story = () => ({
  component: createPropsComponent({
    statusValue: propType.boolean.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props" data-testid="props-text-boolean-story">
    <div data-ref="props">true</div>
    <pre data-ref="info"></pre>
  </div>`,
});
TextBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-text-boolean-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.statusValue).toBe(!!props.textContent!);
};

export const TextDate: Story = () => ({
  component: createPropsComponent({
    createdValue: propType.date.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props" data-testid="props-text-date-story">
    <div data-ref="props">${new Date().toISOString()}</div>
    <pre data-ref="info"></pre>
  </div>`,
});
TextDate.play = async () => {
  const storyContainer = screen.getByTestId('props-text-date-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  expect(info.textContent).not.toBe(undefined);
  expect(isValidJson(info.textContent!)).toBe(true);
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.createdValue).toBe(props.textContent!);
};
