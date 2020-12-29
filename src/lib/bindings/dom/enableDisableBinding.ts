import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

type DisableElement =
  | HTMLButtonElement
  | HTMLFieldSetElement
  | HTMLInputElement
  | HTMLLinkElement
  | HTMLOptGroupElement
  | HTMLOptionElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | SVGStyleElement;

function updateDisabledState(target: DisableElement, disabled: boolean) {
  if (disabled && target.disabled) {
    target.removeAttribute('disabled');
  } else if (!disabled && !target.disabled) {
    target.disabled = true;
  }
}

export function enableBinding(target: DisableElement, valueAccessor: BindingValue<boolean>) {
  return watchEffect(() => {
    updateDisabledState(target, !unref(valueAccessor));
  });
}

export function disableBinding(target: DisableElement, valueAccessor: BindingValue<boolean>) {
  return watchEffect(() => {
    updateDisabledState(target, unref(valueAccessor));
  });
}
