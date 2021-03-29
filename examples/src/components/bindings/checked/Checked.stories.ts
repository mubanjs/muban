import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { ref } from '@vue/reactivity';
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
      checkbox: 'checkbox',
    },
    setup({ refs }) {
      const checked = ref<boolean>(false);

      return [bind(refs.info, { text: checked }), bind(refs.checkbox, { checked: checked })];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <span data-ref="info"></span></p>
    <input data-ref="checkbox" type="checkbox" value="foo" />
  </div>`,
});

export const CheckedValue: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox: 'checkbox',
    },
    setup({ refs }) {
      const checked = ref<boolean>();
      const checkedValue = ref<string>('hello');

      return [
        bind(refs.info, { value: checked }),
        bind(refs.checkbox, { checked: checked, checkedValue: checkedValue }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <input data-ref="info" /></p>
    <input data-ref="checkbox" type="checkbox" value="foo" />
  </div>`,
});
CheckedValue.storyName = 'Checkbox checkedValue';

export const ValueCheckedValue: Story = () => ({
  component: defineComponent({
    name: 'checked',
    refs: {
      info: 'info',
      checkbox: 'checkbox',
    },
    setup({ refs }) {
      const checked = ref<boolean>();
      const checkedValue = ref<string>('hello');

      return [
        bind(refs.info, { value: checked }),
        bind(refs.checkbox, { checked: checked, value: checkedValue }),
      ];
    },
  }),
  template: () => html` <div data-component="checked">
    <p>Value: <input data-ref="info" /></p>
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
      const debugValue = ref<string>('');

      watch(
        () => debugValue.value,
        (newValue) => {
          try {
            const list = JSON.parse(newValue);
            if (Array.isArray(list)) {
              selectedItems.value = list;
            }
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
          <label><input data-ref="radio" type="radio" name="radio" value=${item} />${item}</label>
        </p>
      `,
    )}
  </div>`,
});
