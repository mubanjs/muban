/* eslint-disable max-lines */
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { computed, ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import { bind, defineComponent, refCollection } from '../../../../../src';

export default {
  title: 'bindings/checked',
};

export const Checkbox: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox1a: 'checkbox1a',
      checkbox1b: 'checkbox1b',
      checkbox2a: 'checkbox2a',
      checkbox2b: 'checkbox2b',
    },
    setup({ refs }) {
      const checked1a = ref<boolean>(false);
      const checked1b = ref<boolean>(true);
      const checked2a = ref<boolean>(false);
      const checked2b = ref<boolean>(false);

      return [
        bind(refs.info, {
          text: computed(() =>
            [checked1a.value, checked1b.value, checked2a.value, checked2b.value].join(' - '),
          ),
        }),
        // TODO; log warning if computed is passed
        // TODO; check when passing props.foo
        bind(refs.checkbox1a, { checked: checked1a }),
        bind(refs.checkbox1b, { checked: checked1b }),
        bind(refs.checkbox2a, { checked: checked2a, initialValueSource: 'binding' }),
        bind(refs.checkbox2b, { checked: checked2b, initialValueSource: 'html' }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <span data-ref="info"></span></p>
    <p><input data-ref="checkbox1a" type="checkbox" value="foo" /> default unchecked</p>
    <p><input data-ref="checkbox1b" type="checkbox" checked value="foo" /> default checked</p>
    <p>
      <input data-ref="checkbox2a" type="checkbox" checked value="foo" /> default unchecked
      (binding)
    </p>
    <p>
      <input data-ref="checkbox2b" type="checkbox" checked value="foo" /> default checked (html)
    </p>
  </div>`,
});

export const CheckedValue: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkedValue: 'checkedValue',
      checkbox1a: 'checkbox1a',
      checkbox1b: 'checkbox1b',
      checkbox2a: 'checkbox2a',
      checkbox2b: 'checkbox2b',
    },
    setup({ refs }) {
      const checked1a = ref<string>();
      const checked1b = ref<string>('hello');
      const checked2a = ref<string>();
      const checked2b = ref<string>();
      const checkedValue = ref<string>('hello');

      return [
        bind(refs.info, {
          text: computed(() =>
            [checked1a.value, checked1b.value, checked2a.value, checked2b.value].join(' - '),
          ),
        }),
        bind(refs.checkedValue, {
          value: checkedValue,
        }),
        bind(refs.checkbox1a, { checked: checked1a, checkedValue }),
        bind(refs.checkbox1b, { checked: checked1b, checkedValue }),
        bind(refs.checkbox2a, {
          checked: checked2a,
          checkedValue,
          initialValueSource: 'binding',
        }),
        bind(refs.checkbox2b, {
          checked: checked2b,
          checkedValue,
          initialValueSource: 'html',
        }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>CheckedValue: <input data-ref="checkedValue" /></p>
    <p>Value: <span data-ref="info"></span></p>
    <p><input data-ref="checkbox1a" type="checkbox" value="foo" /> default unchecked</p>
    <p><input data-ref="checkbox1b" type="checkbox" checked value="foo" /> default checked</p>
    <p>
      <input data-ref="checkbox2a" type="checkbox" checked value="foo" /> default checked (binding
      is undefined)
    </p>
    <p>
      <input data-ref="checkbox2b" type="checkbox" checked value="foo" /> default checked (html)
    </p>
  </div>`,
});
CheckedValue.storyName = 'Checkbox checkedValue';

export const ValueCheckedValue: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      value: 'value',
      checkbox: 'checkbox',
    },
    setup({ refs }) {
      const checked = ref<string>();
      const checkedValue = ref<string>('hello');

      return [
        bind(refs.info, { text: checked }),
        bind(refs.value, { value: checkedValue }),
        bind(refs.checkbox, { checked, value: checkedValue }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <input data-ref="value" /></p>
    <p>Info: <span data-ref="info" /></p>
    <input data-ref="checkbox" type="checkbox" value="foo" />
  </div>`,
});
ValueCheckedValue.storyName = 'Checkbox value forwards checkedValue';

export const CheckedArray: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox: refCollection('checkbox'),
    },
    setup({ refs }) {
      const selectedItems = ref<Array<string>>([]);
      const debugValue = ref<string>(JSON.stringify(selectedItems.value, null, 2));

      watch(
        () => debugValue.value,
        (newValue) => {
          try {
            const list = JSON.parse(newValue);
            if (Array.isArray(list)) {
              selectedItems.value = list;
            }
            // eslint-disable-next-line no-empty
          } catch {}
        },
      );

      watch(
        () => selectedItems.value,
        (items) => {
          debugValue.value = JSON.stringify(items, null, 2);
        },
      );

      return [
        bind(refs.info, { value: debugValue }),
        bind(refs.checkbox, { checked: selectedItems }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <textarea data-ref="info" rows="5"></textarea></p>
    ${['foo', 'bar', 'baz'].map(
      (item) => html`
        <p>
          <label><input data-ref="checkbox" type="checkbox" value=${item} />${item}</label>
        </p>
      `,
    )}
  </div>`,
});
CheckedArray.storyName = 'Checkbox Array';

export const CheckedArrayDefaultHtml: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox: refCollection('checkbox'),
    },
    setup({ refs }) {
      const selectedItems = ref<Array<string>>([]);
      const debugValue = ref<string>('');

      watch(
        () => debugValue.value,
        (newValue) => {
          try {
            const list = JSON.parse(newValue);
            if (Array.isArray(list)) {
              selectedItems.value = list;
            }
            // eslint-disable-next-line no-empty
          } catch {}
        },
      );

      watch(
        () => selectedItems.value,
        (items) => {
          debugValue.value = JSON.stringify(items, null, 2);
        },
      );

      return [
        bind(refs.info, { value: debugValue }),
        bind(refs.checkbox, { checked: selectedItems, initialValueSource: 'html' }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <textarea data-ref="info" rows="5"></textarea></p>
    ${['foo', 'bar', 'baz'].map(
      (item) => html`
        <p>
          <label
            ><input
              data-ref="checkbox"
              type="checkbox"
              checked=${item === 'bar'}
              value=${item}
            />${item}</label
          >
        </p>
      `,
    )}
  </div>`,
});
CheckedArrayDefaultHtml.storyName = 'Checkbox Array Default HTML';

export const CheckedArrayDefaultBinding: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox: refCollection('checkbox'),
    },
    setup({ refs }) {
      const selectedItems = ref<Array<string>>(['bar']);
      const debugValue = ref<string>(JSON.stringify(selectedItems.value, null, 2));

      watch(
        () => debugValue.value,
        (newValue) => {
          try {
            const list = JSON.parse(newValue);
            if (Array.isArray(list)) {
              selectedItems.value = list;
            }
            // eslint-disable-next-line no-empty
          } catch {}
        },
      );

      watch(
        () => selectedItems.value,
        (items) => {
          debugValue.value = JSON.stringify(items, null, 2);
        },
      );

      return [
        bind(refs.info, { value: debugValue }),
        bind(refs.checkbox, { checked: selectedItems, initialValueSource: 'binding' }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <textarea data-ref="info" rows="5"></textarea></p>
    ${['foo', 'bar', 'baz'].map(
      (item) => html`
        <p>
          <label><input data-ref="checkbox" type="checkbox" value=${item} />${item}</label>
        </p>
      `,
    )}
  </div>`,
});
CheckedArrayDefaultBinding.storyName = 'Checkbox Array Default Binding';

export const Radio: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      radio: refCollection('radio'),
    },
    setup({ refs }) {
      const selectedValue = ref<string | undefined>('bar');

      return [
        bind(refs.info, { value: selectedValue }),
        bind(refs.radio, { checked: selectedValue }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <input data-ref="info" /></p>
    ${['foo', 'bar', 'baz'].map(
      (item) => html`
        <p>
          <label>
            <input
              data-ref="radio"
              type="radio"
              name="radio"
              checked=${item === 'bar'}
              value=${item}
            />
            ${item}
          </label>
        </p>
      `,
    )}
  </div>`,
});

export const ReadOnlyRefs: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      checkbox1a: 'checkbox1a',
    },
    setup({ refs }) {
      return [bind(refs.checkbox1a, { checked: computed(() => false) })];
    },
  }),
  template: () => html` <div data-component="checked">
    <p><input data-ref="checkbox1a" type="checkbox" value="foo" /> computed ref</p>
  </div>`,
});
