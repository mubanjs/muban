/* eslint-disable max-lines */
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { bind, defineComponent, refCollection, computed, ref, watch, refElement, propType } from '@muban/muban';

export default {
  title: 'bindings/css',
};

export const CssObject: Story = () => ({
  component: defineComponent({
    name: 'object',
    refs: {
      box: 'box',
    },
    setup({ refs }) {
      return [
        bind(refs.box, { css: { 'bg-primary': ref<boolean>(true) } }),
      ];
    },
  }),
  template: () => html` <div data-component="object">
  <p>Css Object</p>
    <div data-ref="box">
      <p>css: { 'bg-primary': ref(true) }</p>
    </div>
  </div>`,
});

export const CssString: Story = () => ({
  component: defineComponent({
    name: 'string',
    refs: {
      box: 'box',
    },
    setup({ refs }) {
      return [
        bind(refs.box, { css: computed(() =>
          'bg-secondary'
        )}),
      ];
    },
  }),
  template: () => html` <div data-component="string">
  <p>Css String</p>
    <div data-ref="box">
    <p>css: computed(() =>
      'bg-secondary'
    )</p>
  </div>
  </div>`,
});