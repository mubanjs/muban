import { html } from '../../../../../src';
import { Submit } from './Submit';

export function submitTemplate(): string {
  return html` <div data-component=${Submit.displayName}>
    <form data-ref="user-form" action="#" method="get">
      <div><input type="text" /></div>
      <div><button type="submit">submit</button></div>
    </form>
  </div>`;
}
