import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

export function textBinding(target: HTMLElement, value: BindingValue<string | number | boolean>) {
  return watchEffect(() => {
    let textValue = unref(value);
    if (textValue === null || textValue === undefined) {
      textValue = '';
    }
    target.textContent = textValue.toString();
  });
}
