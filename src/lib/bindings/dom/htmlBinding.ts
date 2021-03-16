import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

/**
 * We don't safety-check anything, it's your responsibility to make sure the HTML is safe.
 * - Use https://github.com/cure53/DOMPurify to sanitize your HTML by removing all dangerous things
 * - Use https://github.com/component/escape-html to sanitize any variables you include in your "already safe" html
 * - use the `text` binding if you don't need any HTML
 *
 * @param target
 * @param value
 */
export function htmlBinding(target: HTMLElement, valueAccessor: BindingValue<string>) {
  return watchEffect(() => (target.innerHTML = unref(valueAccessor)));
}
