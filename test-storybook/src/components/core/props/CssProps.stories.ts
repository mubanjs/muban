/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { either, test } from 'isntnt';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'core/props/css',
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

export const CssBoolean: Story = () => ({
  component: createPropsComponent(
    {
      isActive: propType.boolean.source({ type: 'css', target: 'props1' }),
      isExpanded: propType.boolean.source({ type: 'css', target: 'props1' }),
      isActive2: propType.boolean.source({ type: 'css', target: 'props2', name: 'isActive' }),
      isExpanded2: propType.boolean.source({ type: 'css', target: 'props2', name: 'isExpanded' }),
    },
    {
      props1: 'props1',
      props2: 'props2',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-css-boolean-story">
    <div data-ref="props1" class="isActive is-expanded"></div>
    <div data-ref="props2" class="isActive is-expanded"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
CssBoolean.play = async () => {
  const storyContainer = screen.getByTestId('props-css-boolean-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.isActive).toBe(true);
  expect(parsedInfo.isExpanded).toBe(true);
  expect(parsedInfo.isActive2).toBe(true);
  expect(parsedInfo.isExpanded2).toBe(true);
};

export const CssString: Story = () => ({
  component: createPropsComponent(
    {
      itemTypeArray: propType.string.source({
        type: 'css',
        target: 'props',
        options: { cssPredicate: either('item-recipe', 'item-article') },
      }),
      itemTypeRegexp: propType.string.source({
        type: 'css',
        target: 'props',
        options: { cssPredicate: test(/^item-/) },
      }),
      // console.warning will be shown
      itemTypeEmpty: propType.string.source({
        type: 'css',
        target: 'props',
      }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-css-string-story">
    <div data-ref="props" class="item item-recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
CssString.play = async () => {
  const storyContainer = screen.getByTestId('props-css-string-story')!;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.itemTypeArray).toBe('item-recipe');
  expect(parsedInfo.itemTypeRegexp).toBe('item-recipe');
};

export const CssArray: Story = () => ({
  component: createPropsComponent(
    {
      valuesValue: propType.array.source({ type: 'css', target: 'props' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-css-array-story">
    <div data-ref="props" class="item recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
CssArray.play = async () => {
  const storyContainer = screen.getByTestId('props-css-array-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  const parsedInfo = JSON.parse(info.textContent!);
  expect(parsedInfo.valuesValue).toStrictEqual(Array.from(props.classList));
};

export const CssObject: Story = () => ({
  component: createPropsComponent(
    {
      resultValue: propType.object.source({ type: 'css', target: 'props' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props" data-testid="props-css-object-story">
    <div data-ref="props" class="item recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
CssObject.play = async () => {
  const storyContainer = screen.getByTestId('props-css-object-story')!;
  const props = queryByRef(storyContainer, 'props') as HTMLDivElement;
  const info = queryByRef(storyContainer, 'info') as HTMLPreElement;
  const parsedInfo = JSON.parse(info.textContent!);
  const classesObject = Array.from(props.classList).reduce(
    (prev, className) => ({ ...prev, [className]: true }),
    {},
  );
  console.log(parsedInfo.resultValue, classesObject);
  expect(parsedInfo.resultValue).toStrictEqual(classesObject);
};
