import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

function updateVisibleState(target: HTMLElement, visible: boolean) {
  const isCurrentlyVisible = !(target.style.display === 'none');
  if (visible && !isCurrentlyVisible) {
    // TODO: resort to previous value before switching to "none"
    target.style.display = '';
  } else if (!visible && isCurrentlyVisible) {
    target.style.display = 'none';
  }
}

export function visibleBinding(target: HTMLElement, valueAccessor: BindingValue<boolean>) {
  return watchEffect(() => {
    updateVisibleState(target, unref(valueAccessor));
  });
}

export function hiddenBinding(target: HTMLElement, valueAccessor: BindingValue<boolean>) {
  return watchEffect(() => {
    updateVisibleState(target, !unref(valueAccessor));
  });
}
