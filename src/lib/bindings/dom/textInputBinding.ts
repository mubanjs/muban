import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

export function textInputBinding(
  target: HTMLInputElement,
  valueAccessor: BindingValue<string | number | boolean | null | undefined>,
) {
  const unwatch = watchEffect(() => {
    let inputValue = unref(valueAccessor);
    if (inputValue === null || inputValue === undefined) {
      inputValue = '';
    }
    target.value = String(inputValue);
  });

  const onInputChange = function () {
    valueAccessor.value = target.value;
  };

  target.addEventListener('input', onInputChange);
  target.addEventListener('change', onInputChange);

  return () => {
    unwatch();
    target.removeEventListener('input', onInputChange);
    target.removeEventListener('change', onInputChange);
  };
}
