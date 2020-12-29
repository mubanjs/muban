import { html } from '../../../../../src';
import { Focus } from './Focus';

export function focusTemplate(): string {
  return html` <div data-component=${Focus.displayName}>
    <p>Has focus: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><button>steal focus</button></div>
  </div>`;
}
