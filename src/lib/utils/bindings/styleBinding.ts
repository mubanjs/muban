import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from './bindingDefinitions';

export default function (target: HTMLElement, value: BindingValue<Record<string, string>>) {
  return watchEffect(() => {
    const styles = unref(value);
    Object.entries(styles).forEach(([name, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target.style[name as any] = value as string;
    });
  });
}
