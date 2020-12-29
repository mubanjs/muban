import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

export function hasFocusBinding(target: HTMLElement, valueAccessor: BindingValue<boolean>) {
  const unwatch = watchEffect(() => {
    const focusValue = unref(valueAccessor);
    if (focusValue) {
      if (document.activeElement !== target) {
        target.focus();
      }
    } else {
      if (document.activeElement === target) {
        target.blur();
      }
    }
  });

  const onFocusChange = function () {
    valueAccessor.value = document.activeElement === target;
  };
  // Nice: https://hiddedevries.nl/en/blog/2019-01-30-console-logging-the-focused-element-as-it-changes
  target.addEventListener('focus', onFocusChange);
  target.addEventListener('blur', onFocusChange);

  return () => {
    unwatch();
    document.removeEventListener('focus', onFocusChange, true);
  };
}
