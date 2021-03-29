/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { html, jsonScriptTemplate } from '@muban/template';
import { computed } from '@vue/reactivity';
import { bind, defineComponent, propType } from '../../../../../src';
import type { PropTypeDefinition } from '../../../../../src/lib/props/propDefinitions.types';

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
      return [getInfoBinding(refs, props)];
    },
  });
};

export const DataString: Story = () => ({
  component: createPropsComponent({
    status: propType.string,
  }),
  template: () => html` <div data-component="props" data-status="success">
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataNumber: Story = () => ({
  component: createPropsComponent({
    value: propType.number,
  }),
  template: () => html` <div data-component="props" data-value="12.34">
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataBoolean: Story = () => ({
  component: createPropsComponent({
    active: propType.boolean,
  }),
  template: () => html` <div data-component="props" data-active="true">
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataArray: Story = () => ({
  component: createPropsComponent({
    values: propType.array,
  }),
  template: () => html` <div
    data-component="props"
    data-values=${JSON.stringify(['success', 12.34, true, new Date()])}
  >
    <pre data-ref="info"></pre>
  </div>`,
});

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
  >
    <pre data-ref="info"></pre>
  </div>`,
});

export const DataDate: Story = () => ({
  component: createPropsComponent({
    date: propType.date,
  }),
  template: () => html` <div data-component="props" data-date=${new Date().toISOString()}>
    <pre data-ref="info"></pre>
  </div>`,
});

export const JsonData: Story = () => ({
  component: createPropsComponent({
    status: propType.string,
    value: propType.number,
    active: propType.boolean,
    created: propType.date,
    values: propType.array,
    result: propType.object,
  }),
  template: () => html` <div data-component="props">
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

export const CssBoolean: Story = () => ({
  component: createPropsComponent({
    isActive: propType.boolean,
    isExpanded: propType.boolean,
    isMissing: propType.boolean,
  }),
  template: () => html` <div data-component="props" class="is-active isExpanded">
    <pre data-ref="info"></pre>
  </div>`,
});
