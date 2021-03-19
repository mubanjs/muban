import { computed } from '@vue/reactivity';
import { bind, defineComponent, html, propType } from '../../../../../src';

export const BindMapItem = defineComponent({
  name: 'item',
  refs: {
    btn: 'btn',
  },
  props: {
    value: propType.string,
    onActivate: propType.func.shape<() => void>().optional,
    isActive: propType.boolean.optional,
  },
  setup({ refs, props }) {
    return [
      bind(refs.btn, {
        text: computed(() => `${props.value}${props.isActive ? ' [active]' : ''}`),
        click: () => props.onActivate?.(),
      }),
    ];
  },
});
export const bindMapItemTemplate = ({ label }: { label: string }, ref?: string) => {
  return html`<div data-component="item" data-value=${label} data-ref=${ref}>
    <button data-ref="btn" type="button">${label}</button>
  </div>`;
};
