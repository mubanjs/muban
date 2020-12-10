import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from './bindingDefinitions';

export default function (target: HTMLElement, value: BindingValue<string | number | boolean>) {
  return watchEffect(() => (target.textContent = unref(value).toString()));
}
