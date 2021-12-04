import { enableTracking, pauseTracking } from '@vue/reactivity';
import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingsHelpers, BindingValue } from '../bindings.types';
import { checkInitialBindingState } from '../utils/checkInitialBindingState';

type ValueElement =
  | HTMLButtonElement
  | HTMLDataElement
  | HTMLOptionElement
  | HTMLInputElement
  | HTMLOutputElement
  | HTMLParamElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

function isInputElement(element: ValueElement): element is HTMLInputElement {
  return element.tagName?.toLowerCase() === 'input';
}

export function valueBinding(
  target: ValueElement,
  model: BindingValue<string | number | boolean | undefined | null>,
  bindingHelpers: BindingsHelpers,
) {
  const tagName = target.tagName?.toLowerCase();

  if (isInputElement(target) && (target.type === 'checkbox' || target.type === 'radio')) {
    bindingHelpers.setBinding('checkedValue', model);
    return;
  }

  // TODO: allow users specify events to watch besides the default "change" we are using

  const updateModel = () => {
    const newValue = target.value;
    if (tagName === 'select') {
      // TODO: options metadata?
      model.value = newValue;
    } else {
      model.value = newValue;
    }
  };

  const updateHtml = () => {
    let modelValue = unref(model);
    if (tagName === 'select') {
      const element = target as HTMLSelectElement;
      // A blank string or null value will select the caption
      if (modelValue === '' || modelValue === null) {
        modelValue = undefined;
      }

      const allowUnset = unref(bindingHelpers.getBinding('allowUnset'));

      // find selected option
      // TODO: options metadata?
      const selection = Array.from(element.options).findIndex(
        (option) =>
          option.value === modelValue || (modelValue === undefined && option.value === ''),
      );

      // set the new value if allowed
      if (allowUnset || selection >= 0 || (modelValue === undefined && element.size > 1)) {
        element.selectedIndex = selection;
      }

      if (!allowUnset && modelValue !== element.value) {
        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        pauseTracking();
        model.value = element.value;
        enableTracking();
      }
    } else {
      if (modelValue === null || modelValue === undefined) {
        modelValue = '';
      }
      target.value = String(modelValue);
    }
  };

  if (
    checkInitialBindingState(
      'value',
      target.value,
      model.value,
      unref(bindingHelpers.getBinding('initialValueSource')),
    ) === 'binding'
  ) {
    updateModel();
  }

  const unwatch = watchEffect(updateHtml);
  target.addEventListener('change', updateModel);

  return () => {
    unwatch();
    target.removeEventListener('change', updateModel);
  };
}
