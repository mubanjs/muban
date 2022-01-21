/* eslint-disable max-lines */
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, computed, ref } from '@muban/muban';

export default {
  title: 'bindings/css',
};

export const CssObject: Story = () => ({
  component: defineComponent({
    name: 'object',
    refs: {
      box: 'box',
      info: 'info',
      checkbox1: 'checkbox1',
      checkbox2: 'checkbox2',
      checkbox3: 'checkbox3',
    },
    setup({ refs }) {
      const checked1 = ref<boolean>(true);
      const checked2 = ref<boolean>(false);
      const checked3 = ref<boolean>(false);
      return [
        bind(refs.info, { text: computed(() => `${checked1.value ? "'bg-primary': ref(true), " : ''} ${checked2.value ? "'text-success': ref(true), " : ''} ${checked3.value ? "'fs-3': ref(true), " : ''}` ) } ),
        bind(refs.box, { css: { 'bg-primary': checked1, 'text-success': checked2, 'fs-3': checked3 } }),
        bind(refs.checkbox1, { checked: checked1 }),
        bind(refs.checkbox2, { checked: checked2 }),
        bind(refs.checkbox3, { checked: checked3 }),
      ];
    },
  }),
  template: () => html` <div data-component="object">
  <p>Css Object</p>
    <div data-ref="box" class="bg-primary">
      <p>css: { <span data-ref="info"></span> }</p>
    </div>
    <p><input data-ref="checkbox1" type="checkbox" value="foo" checked /> .bg-primary</p>
    <p><input data-ref="checkbox2" type="checkbox" value="foo" /> .text-success</p>
    <p><input data-ref="checkbox3" type="checkbox" value="foo" /> .fs-3</p>
  </div>`,
});

export const CssString: Story = () => ({
  component: defineComponent({
    name: 'string',
    refs: {
      box: 'box',
      info: 'info',
      checkbox1: 'checkbox1',
      checkbox2: 'checkbox2',
      checkbox3: 'checkbox3',
    },
    setup({ refs }) {
      const checked1 = ref<boolean>(false);
      const checked2 = ref<boolean>(true);
      const checked3 = ref<boolean>(false);
      return [
        bind(refs.info, { text: computed(() => `'${checked1.value ? 'bg-primary' : ''} ${checked2.value ? 'text-success' : ''} ${checked3.value ? 'fs-3' : ''}'` ) } ),
        bind(refs.box, { css: computed(() =>
          `${checked1.value && 'bg-primary' } ${checked2.value && 'text-success'} ${checked3.value && 'fs-3'}`
        )}),
        bind(refs.checkbox1, { checked: checked1 }),
        bind(refs.checkbox2, { checked: checked2 }),
        bind(refs.checkbox3, { checked: checked3 }),
      ];
    },
  }),
  template: () => html` <div data-component="string">
  <p>Css String</p>
    <div data-ref="box" class="text-success">
    <p>css: computed (() => <span data-ref="info"></span>)</p>
  </div>
  <p><input data-ref="checkbox1" type="checkbox" value="foo" /> .bg-primary</p>
  <p><input data-ref="checkbox2" type="checkbox" value="foo" checked /> .text-success</p>
  <p><input data-ref="checkbox3" type="checkbox" value="foo" /> .fs-3</p>
  </div>`,
});