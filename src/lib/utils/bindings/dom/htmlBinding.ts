import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

export default function (target: HTMLElement, value: BindingValue<string>) {
  // TODO: some safety checks encoding
  return watchEffect(() => (target.innerHTML = unref(value)));
}
