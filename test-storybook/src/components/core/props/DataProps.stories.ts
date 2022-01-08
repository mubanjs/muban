/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/types-6-0';
import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';
import type { PropTypeDefinition, ComponentRefItem } from '@muban/muban';

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
  template: () => html` <div data-component="props">
    <div data-ref="props" data-status="success"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataNumber: Story = () => ({
  component: createPropsComponent(
    {
      valueValue: propType.number.source({ type: 'data', target: 'props', name: 'value' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" data-value="12.34"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataBoolean: Story = () => ({
  component: createPropsComponent(
    {
      activeValue: propType.boolean.source({ type: 'data', target: 'props', name: 'active' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" data-active="true"></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataDate: Story = () => ({
  component: createPropsComponent(
    {
      createdValue: propType.date.source({ type: 'data', target: 'props', name: 'created' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" data-created=${new Date().toISOString()}></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataArray: Story = () => ({
  component: createPropsComponent(
    {
      valuesValue: propType.array.source({ type: 'data', target: 'props', name: 'values' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
    <div data-ref="props" data-values=${JSON.stringify(['success', 12.34, true, new Date()])}></div>
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataObject: Story = () => ({
  component: createPropsComponent(
    {
      resultValue: propType.object.source({ type: 'data', target: 'props', name: 'result' }),
    },
    {
      props: 'props',
    },
  ),
  template: () => html` <div data-component="props">
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

export const DataAny: Story = () => ({
  component: createPropsComponent({
    str: propType.any,
    strDefault: propType.any.defaultValue('default-value'),
    int: propType.any,
    intDefault: propType.any.defaultValue(42),
    bool: propType.any,
    boolDefault: propType.any.defaultValue(true),
  }),
  template: () => html` <div data-component="props" data-str="value" data-int="1" data-bool="true">
    <pre data-ref="info"></pre>
  </div>`,
});
