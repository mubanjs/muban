import { html } from '@muban/template';

export function LazyComponentTemplate() {
  return html`<div data-component="lazy-component">
    <small data-ref="text"></small>
  </div>`;
}
