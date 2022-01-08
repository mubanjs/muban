import { html } from '@muban/template';
import { bind, defineComponent, propType, computed } from '@muban/muban';

export const BindMapItem = defineComponent({
  name: 'item',
  refs: {
    btn: 'btn',
  },
  props: {
    value: propType.string,
    onActivate: propType.func.optional.shape<() => void>(),
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
