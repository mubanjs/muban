import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from './bindingDefinitions';

export default function (
  target: HTMLElement,
  value: BindingValue<Record<string, boolean>>,
): () => void {
  return watchEffect(() => {
    const classes = unref(value);
    Object.entries(classes).forEach(([name, value]) => {
      target.classList.toggle(name, value);
    });
  });
}
