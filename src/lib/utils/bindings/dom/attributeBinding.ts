import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from '../bindings.types';

export default function (target: HTMLElement, attributes: BindingMap<string | boolean | number>) {
  return watchEffect(() => {
    Object.entries(attributes).forEach(([key, value]) => {
      target.setAttribute(key, String(unref(value)));
    });
  });
}
