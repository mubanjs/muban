/* eslint-disable max-lines */
import { expect } from '@storybook/jest';
import { userEvent, waitFor } from '@storybook/testing-library';
import { queryByRef, queryAllByRef, screen } from '@muban/testing-library';
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, refCollection, computed, ref, watch } from '@muban/muban';

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
  template: () => html` <div data-component="checked" data-testid="checked-story">
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

Checkbox.play = () => {
  const storyContainer = screen.getByTestId('checked-story');
  const checkbox1a = queryByRef(storyContainer, 'checkbox1a') as HTMLInputElement;
  const checkbox1b = queryByRef(storyContainer, 'checkbox1b') as HTMLInputElement;
  const checkbox2a = queryByRef(storyContainer, 'checkbox2a') as HTMLInputElement;
  const checkbox2b = queryByRef(storyContainer, 'checkbox2b') as HTMLInputElement;
  const info = queryByRef(storyContainer, 'info');
  expect(info?.textContent).toBe(
    [checkbox1a.checked, checkbox1b.checked, checkbox2a.checked, checkbox2b.checked].join(' - '),
  );
};

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
  template: () => html` <div data-component="checked" data-testid="checked-value-story">
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
CheckedValue.play = async () => {
  const storyContainer = screen.getByTestId('checked-value-story');
  const value = queryByRef(storyContainer, 'checkedValue') as HTMLInputElement;
  const info = queryByRef(storyContainer, 'info');
  const checkbox1a = queryByRef(storyContainer, 'checkbox1a') as HTMLInputElement;
  const checkbox1b = queryByRef(storyContainer, 'checkbox1b') as HTMLInputElement;
  const checkbox2a = queryByRef(storyContainer, 'checkbox2a') as HTMLInputElement;
  const checkbox2b = queryByRef(storyContainer, 'checkbox2b') as HTMLInputElement;
  const newValue = 'Some new value';
  userEvent.type(value, newValue);
  userEvent.click(checkbox1a);
  const checkboxesValue = [
    checkbox1a.checked,
    checkbox1b.checked,
    checkbox2a.checked,
    checkbox2b.checked,
  ]
    .map((isChecked) => (isChecked ? newValue : undefined))
    .join(' - ');
  await waitFor(() => expect(info?.textContent).toBe(checkboxesValue));
};

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
  template: () => html` <div data-component="checked" data-testid="value-checked-value-story">
    <p>Value: <input data-ref="value" /></p>
    <p>Info: <span data-ref="info" data-testid="info-container" /></p>
    <input data-ref="checkbox" type="checkbox" value="foo" />
  </div>`,
});
ValueCheckedValue.storyName = 'Checkbox value forwards checkedValue';
ValueCheckedValue.play = async () => {
  const storyContainer = screen.getByTestId('value-checked-value-story');
  const value = queryByRef(storyContainer, 'value') as HTMLInputElement;
  const checkbox = queryByRef(storyContainer, 'checkbox') as HTMLInputElement;
  const newValue = 'hello';
  userEvent.type(value, newValue);
  userEvent.click(checkbox);
  await waitFor(() => expect(screen.getByTestId('info-container')).toHaveTextContent('hello'));
};

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
  template: () => html` <div data-component="checked" data-testid="checked-array-story">
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
CheckedArray.play = async () => {
  const storyContainer = screen.getByTestId('checked-array-story');
  const info = queryByRef(storyContainer, 'info') as HTMLTextAreaElement;
  const checkboxes = queryAllByRef(storyContainer, 'checkbox') as Array<HTMLInputElement>;
  checkboxes.forEach((checkbox) => userEvent.click(checkbox));
  await waitFor(() =>
    expect(JSON.parse(info?.value)).toStrictEqual(checkboxes.map((checkbox) => checkbox.value)),
  );
};

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
  template: () => html` <div data-component="checked" data-testid="checked-array-default-story">
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
CheckedArrayDefaultHtml.play = async () => {
  const storyContainer = screen.getByTestId('checked-array-default-story');
  const info = queryByRef(storyContainer, 'info') as HTMLTextAreaElement;
  const checkboxes = queryAllByRef(storyContainer, 'checkbox') as Array<HTMLInputElement>;
  await waitFor(() =>
    expect(JSON.parse(info?.value)).toStrictEqual(
      checkboxes
        .map((checkbox) => (checkbox.checked ? checkbox.value : undefined))
        .filter((value) => value),
    ),
  );
};

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
  template: () => html` <div
    data-component="checked"
    data-testid="checked-array-default-binding-story"
  >
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
CheckedArrayDefaultBinding.play = async () => {
  const storyContainer = screen.getByTestId('checked-array-default-binding-story');
  const info = queryByRef(storyContainer, 'info') as HTMLTextAreaElement;
  const checkboxes = queryAllByRef(storyContainer, 'checkbox') as Array<HTMLInputElement>;
  expect(info?.value).toBe('');
  checkboxes.forEach((checkbox) => userEvent.click(checkbox));
  await waitFor(() =>
    expect(JSON.parse(info?.value)).toStrictEqual(
      checkboxes
        .map((checkbox) => (checkbox.checked ? checkbox.value : undefined))
        .filter((value) => value),
    ),
  );
};

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
  template: () => html` <div data-component="checked" data-testid="radio-story">
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
Radio.play = async () => {
  const storyContainer = screen.getByTestId('radio-story');
  const info = queryByRef(storyContainer, 'info') as HTMLTextAreaElement;
  const radios = queryAllByRef(storyContainer, 'radio') as Array<HTMLInputElement>;
  expect(info?.value).toBe('');
  for (const radio of radios) {
    userEvent.click(radio);
    await waitFor(() => expect(info.value).toBe(radio.value));
  }
};

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
  template: () => html` <div data-component="checked" data-testid="read-only-story">
    <p><input data-ref="checkbox1a" type="checkbox" value="foo" /> computed ref</p>
  </div>`,
});
ReadOnlyRefs.play = async () => {
  const storyContainer = screen.getByTestId('read-only-story');
  const checkbox = queryByRef(storyContainer, 'checkbox1a') as HTMLInputElement;
  expect(checkbox).not.toBeChecked();
};
