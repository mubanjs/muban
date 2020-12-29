import { html } from '../../../../../src';
import { Disable } from './Disable';

export function disableTemplate(): string {
  return html` <div data-component=${Disable.displayName}>
    <div>
      <label><input type="checkbox" data-ref="check" /> Is Enabled?</label>
    </div>
    <p>Is enabled: <span data-ref="info"></span></p>
    <div><input data-ref="field" /></div>
    <div><button data-ref="btn">do something</button></div>
  </div>`;
}
