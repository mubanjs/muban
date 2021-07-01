import { defineComponent } from '../../../../../src';
import { html } from '@muban/template';

export const SomeChildComponent = defineComponent({
  name: 'some-child-component',
  setup() {
    console.log('==> Setup SomeChildComponent');
    return [];
  },
});

export function someChildComponentTemplate() {
  return html`<span data-component="some-child-component" data-ref="child">
    Some child component
  </span>`;
}
