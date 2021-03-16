import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

export function textBinding(
  target: HTMLElement,
  valueAccessor: BindingValue<string | number | boolean | undefined>,
) {
  return watchEffect(() => {
    let textValue = unref(valueAccessor);
    if (textValue === null || textValue === undefined) {
      textValue = '';
    }
    target.textContent = textValue.toString();
  });
}
