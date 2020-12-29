import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from '../bindings.types';

export default function (
  target: HTMLElement,
  dataAttributes: BindingMap<string | boolean | number>,
) {
  return watchEffect(() => {
    Object.entries(dataAttributes).forEach(([key, value]) => {
      target.dataset[key] = String(unref(value));
    });
  });
}
