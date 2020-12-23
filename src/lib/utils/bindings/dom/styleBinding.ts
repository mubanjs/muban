import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from '../bindings.types';

export default function (target: HTMLElement, value: BindingMap<string>) {
  return watchEffect(() => {
    const styles = unref(value);
    Object.entries(styles).forEach(([name, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target.style[name as any] = unref(value) as string;
    });
  });
}
