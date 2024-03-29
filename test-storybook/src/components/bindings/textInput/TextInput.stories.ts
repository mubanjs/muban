import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, ref } from '@muban/muban';
import { userEvent, waitFor } from '@storybook/testing-library';
import { queryByRef, screen } from '@muban/testing-library';
import { expect } from '@storybook/jest';

export default {
  title: 'bindings/textInput',
};

export const Default: Story = () => ({
  component: defineComponent({
    name: 'textInput',
    refs: {
      field: 'field',
      textarea: 'textarea',
      info: 'info',
      resetBtn: 'btn-reset',
      undefinedBtn: 'btn-undefined',
    },
    setup({ refs }) {
      const value = ref<string | undefined>('hello');

      return [
        bind(refs.info, { text: value }),
        bind(refs.field, { textInput: value }),
        bind(refs.textarea, { textInput: value }),
        bind(refs.resetBtn, {
          click() {
            value.value = 'hello';
          },
        }),
        bind(refs.undefinedBtn, {
          click() {
            value.value = undefined;
          },
        }),
      ];
    },
  }),
  template: () => html`<div data-component="textInput" data-testid="text-input-story">
    <p>value: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><textarea data-ref="textarea"></textarea></div>
    <div>
      <button data-ref="btn-reset">reset textInput</button>
      <button data-ref="btn-undefined">set to undefined</button>
    </div>
  </div>`,
});
Default.play = async () => {
  const storyContainer = screen.getByTestId('text-input-story');
  const field = queryByRef(storyContainer, 'field') as HTMLInputElement;
  const textarea = queryByRef(storyContainer, 'textarea') as HTMLTextAreaElement;
  const resetBtn = queryByRef(storyContainer, 'btn-reset');
  const clearBtn = queryByRef(storyContainer, 'btn-undefined');
  userEvent.type(field, 'foo');
  await waitFor(() => expect(textarea.value).toBe('foo'));
  userEvent.type(textarea, 'bar');
  await waitFor(() => expect(field.value).toBe('foobar'));
  userEvent.click(resetBtn!);
  await waitFor(() => expect(field.value).toBe('hello'));
  await waitFor(() => expect(textarea.value).toBe('hello'));
  userEvent.click(clearBtn!);
  await waitFor(() => expect(field.value).toBe(''));
  await waitFor(() => expect(textarea.value).toBe(''));
};
