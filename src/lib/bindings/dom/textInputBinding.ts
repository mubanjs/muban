import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue, BindingsHelpers } from '../bindings.types';
import { checkInitialBindingState } from '../utils/checkInitialBindingState';

export function textInputBinding(
  target: HTMLInputElement,
  model: BindingValue<string | number | boolean | null | undefined>,
  bindingHelpers: BindingsHelpers,
) {
  const updateHtml = () => {
    let modelValue = unref(model);
    if (modelValue === null || modelValue === undefined) {
      modelValue = '';
    }
    target.value = String(modelValue);
  };

  const updateModel = function () {
    model.value = target.value;
  };

  if (
    checkInitialBindingState(
      'textInput',
      target.value,
      model.value,
      unref(bindingHelpers.getBinding('initialValueSource')),
    ) === 'binding'
  ) {
    updateModel();
  }

  const unwatch = watchEffect(updateHtml);
  target.addEventListener('input', updateModel);
  target.addEventListener('change', updateModel);

  return () => {
    unwatch();
    target.removeEventListener('input', updateModel);
    target.removeEventListener('change', updateModel);
  };
}
