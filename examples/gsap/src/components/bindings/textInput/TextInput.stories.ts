import { html } from '@muban/template';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { ref } from '@vue/reactivity';
import { bind, defineComponent } from '../../../../../../src';

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
        bind(refs.resetBtn, { click: () => (value.value = 'hello') }),
        bind(refs.undefinedBtn, { click: () => (value.value = undefined) }),
      ];
    },
  }),
  template: () => html`<div data-component="textInput">
    <p>value: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><textarea data-ref="textarea"></textarea></div>
    <div>
      <button data-ref="btn-reset">reset textInput</button>
      <button data-ref="btn-undefined">set to undefined</button>
    </div>
  </div>`,
});
