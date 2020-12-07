import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from './bindingDefinitions';

export default function (
  target: HTMLElement,
  attributes: BindingMap<string | boolean | number>,
): void {
  watchEffect(() => {
    Object.entries(attributes).forEach(([key, value]) => {
      target.setAttribute(key, String(unref(value)));
    });
  });
}
