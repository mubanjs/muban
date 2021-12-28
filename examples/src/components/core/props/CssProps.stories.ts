/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { computed } from '@vue/reactivity';
import { either, test } from 'isntnt';
import { bind, defineComponent, propType } from '../../../../../src';
import type { PropTypeDefinition } from '../../../../../src/lib/props/propDefinitions.types';
import type { ComponentRefItem } from '../../../../../src/lib/refs/refDefinitions.types';

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
  template: () => html` <div data-component="props">
    <div data-ref="props1" class="isActive is-expanded"></div>
    <div data-ref="props2" class="isActive is-expanded"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

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
  template: () => html` <div data-component="props">
    <div data-ref="props" class="item item-recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const CssArray: Story = () => ({
  component: createPropsComponent(
    {
      valuesValue: propType.array.source({ type: 'css', target: 'props' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" class="item recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const CssObject: Story = () => ({
  component: createPropsComponent(
    {
      resultValue: propType.object.source({ type: 'css', target: 'props' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" class="item recipe"></div>
    <pre data-ref="info"></pre>
  </div>`,
});
