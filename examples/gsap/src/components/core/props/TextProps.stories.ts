/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html } from '@muban/template';
import { computed } from '@vue/reactivity';
import { bind, defineComponent, propType } from '../../../../../src';
import type { PropTypeDefinition } from '../../../../../src/lib/props/propDefinitions.types';
import type { ComponentRefItem } from '../../../../../src/lib/refs/refDefinitions.types';

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
  template: () => html` <div data-component="props">
    <div data-ref="props">success</div>
    <div data-ref="props2">Hello <strong>world</strong>!</div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const TextNumber: Story = () => ({
  component: createPropsComponent({
    valueValue: propType.number.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props">
    <div data-ref="props">12.34</div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const TextBoolean: Story = () => ({
  component: createPropsComponent({
    statusValue: propType.boolean.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props">
    <div data-ref="props">true</div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const TextDate: Story = () => ({
  component: createPropsComponent({
    createdValue: propType.date.source({ type: 'text', target: 'props' }),
  }),
  template: () => html` <div data-component="props">
    <div data-ref="props">${new Date().toISOString()}</div>
    <pre data-ref="info"></pre>
  </div>`,
});
