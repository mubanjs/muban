/* eslint-disable no-return-assign */
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, ref } from '@muban/muban';
import { queryByRef, screen } from '@muban/testing-library';
import { userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'bindings/value',
};

export const Default: Story = () => ({
  component: defineComponent({
    name: 'value',
    refs: {
      field: 'field',
      info: 'info',
      resetBtn: 'btn-reset',
      undefinedBtn: 'btn-undefined',
      fooBtn: 'btn-foo',
    },
    setup({ refs }) {
      const value = ref<string | undefined>('hello');

      return [
        bind(refs.info, { value, initialValueSource: 'binding' }),
        bind(refs.field, { value }),
        bind(refs.resetBtn, { click: () => (value.value = 'hello') }),
        bind(refs.undefinedBtn, { click: () => (value.value = undefined) }),
        bind(refs.fooBtn, { click: () => (value.value = 'foo') }),
      ];
    },
  }),
  template: () => html`<div data-component="value" data-testid="value-default-story">
    <p>Value binding: <input data-ref="info" /></p>
    <div>User Input:<input data-ref="field" value="hello" /></div>
    <div>
      <button data-ref="btn-reset">reset value</button>
      <button data-ref="btn-undefined">set to undefined</button>
      <button data-ref="btn-foo">set to foo</button>
    </div>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('value-default-story');
  const field = queryByRef(storyContainer, 'field')! as HTMLInputElement;
  const resetBtn = queryByRef(storyContainer, 'btn-reset')!;
  const clearBtn = queryByRef(storyContainer, 'btn-undefined')!;
  const fooBtn = queryByRef(storyContainer, 'btn-foo')!;
  userEvent.click(fooBtn);
  await waitFor(() => expect(field).toHaveValue('foo'));
  userEvent.click(clearBtn);
  await waitFor(() => expect(field).toHaveValue(''));
  userEvent.click(resetBtn);
  await waitFor(() => expect(field).toHaveValue('hello'));
};

export const Select: Story = () => ({
  component: defineComponent({
    name: 'value',
    refs: {
      field: 'field',
      select: 'select-field',
      info: 'info',
      resetBtn: 'btn-reset',
      undefinedBtn: 'btn-undefined',
      fooBtn: 'btn-foo',
    },
    setup({ refs }) {
      const value = ref<string | undefined>();

      return [
        bind(refs.info, { text: value }),
        bind(refs.field, { value }),
        bind(refs.resetBtn, { click: () => (value.value = 'bar') }),
        bind(refs.undefinedBtn, { click: () => (value.value = undefined) }),
        bind(refs.fooBtn, { click: () => (value.value = 'foo') }),
        bind(refs.select, { value }),
      ];
    },
  }),
  template: () => html`<div data-component="value" data-testid="value-select-story">
    <p>Value: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div>
      <button data-ref="btn-reset">reset value</button>
      <button data-ref="btn-undefined">set to undefined</button>
      <button data-ref="btn-foo">set to foo</button>
    </div>
    <div>
      <select data-ref="select-field">
        <option value="">Choose one</option>
        <option value="foo">Foo</option>
        <option value="bar">Bar</option>
      </select>
    </div>
  </div>`,
});
Select.play = async () => {
  const storyContainer = screen.getByTestId('value-select-story');
  const select = queryByRef(storyContainer, 'select-field') as HTMLSelectElement;
  const resetBtn = queryByRef(storyContainer, 'btn-reset')!;
  const clearBtn = queryByRef(storyContainer, 'btn-undefined')!;
  const fooBtn = queryByRef(storyContainer, 'btn-foo')!;
  userEvent.click(fooBtn);
  await waitFor(() => expect(select).toHaveValue('foo'));
  userEvent.click(clearBtn);
  await waitFor(() => expect(select).toHaveValue(''));
  userEvent.click(resetBtn);
  await waitFor(() => expect(select).toHaveValue('bar'));
};

export const AllowUnset: Story = () => ({
  component: defineComponent({
    name: 'value',
    refs: {
      field: 'field',
      select: 'select-field',
      info: 'info',
      resetBtn: 'btn-reset',
      undefinedBtn: 'btn-undefined',
      fooBtn: 'btn-foo',
      allowUnsetCheckbox: 'allow-unset-checkbox',
    },
    setup({ refs }) {
      const value = ref<string | undefined>('hello');
      const allowUnset = ref(true);

      return [
        bind(refs.info, { text: value }),
        bind(refs.field, { value }),
        bind(refs.resetBtn, { click: () => (value.value = 'hello') }),
        bind(refs.undefinedBtn, { click: () => (value.value = undefined) }),
        bind(refs.fooBtn, { click: () => (value.value = 'foo') }),
        bind(refs.select, { value, allowUnset, initialValueSource: 'binding' }),
        bind(refs.allowUnsetCheckbox, { checked: allowUnset, initialValueSource: 'binding' }),
      ];
    },
  }),
  template: () => html`<div data-component="value" data-testid="value-allow-unset-story">
    <p>Value: <span data-ref="info"></span></p>
    <div><input data-ref="field" value="hello" /></div>
    <div>
      <button data-ref="btn-reset">reset value</button>
      <button data-ref="btn-undefined">set to undefined</button>
      <button data-ref="btn-foo">set to foo</button>
    </div>
    <div>
      <select data-ref="select-field">
        <option value="">Choose one</option>
        <option value="foo">Foo</option>
        <option value="bar">Bar</option>
      </select>
    </div>
    <div>
      <p>
        When "allowUnset" is unchecked, and you change the "input" value while a select value is
        set, it will reset the input value back.
      </p>
      <p>
        When "allowUnset" is checked, changing the input value to anything that doesn't match the
        select, will "unset" the select, while still keeping the input value in the model.
      </p>
      <label><input type="checkbox" data-ref="allow-unset-checkbox" /> allowUnset on select</label>
    </div>
  </div>`,
});
AllowUnset.play = async () => {
  const storyContainer = screen.getByTestId('value-allow-unset-story');
  const select = queryByRef(storyContainer, 'select-field') as HTMLSelectElement;
  const resetBtn = queryByRef(storyContainer, 'btn-reset')!;
  const clearBtn = queryByRef(storyContainer, 'btn-undefined')!;
  const fooBtn = queryByRef(storyContainer, 'btn-foo')!;
  const allowUnset = queryByRef(storyContainer, 'allow-unset-checkbox')!;
  userEvent.click(clearBtn);
  await waitFor(() => expect(select).toHaveValue(''));
  userEvent.click(fooBtn);
  await waitFor(() => expect(select).toHaveValue('foo'));
  userEvent.click(resetBtn);
  await waitFor(() => expect(select).toHaveValue(undefined));

  userEvent.click(allowUnset);
  userEvent.click(clearBtn);

  await waitFor(() => expect(select).toHaveValue(''));
  userEvent.click(fooBtn);
  await waitFor(() => expect(select).toHaveValue('foo'));
  userEvent.click(resetBtn);
  await waitFor(() => expect(select).toHaveValue('foo'));
};
