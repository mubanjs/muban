import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from './bindingDefinitions';

export default function (target: HTMLElement, value: BindingMap<boolean>): () => void {
  return watchEffect(() => {
    const classes = unref(value);
    Object.entries(classes).forEach(([name, value]) => {
      target.classList.toggle(name, unref(value));
    });
  });
}
