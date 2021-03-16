import { enableTracking, pauseTracking } from '@vue/reactivity';
import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingsHelpers, BindingValue } from '../bindings.types';

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
  valueAccessor: BindingValue<string | number | boolean | undefined | null>,
  bindingHelpers: BindingsHelpers,
) {
  const tagName = target.tagName?.toLowerCase();

  if (isInputElement(target) && (target.type === 'checkbox' || target.type === 'radio')) {
    bindingHelpers.setBinding('checkedValue', valueAccessor);
    return;
  }

  // TODO: allow users specify events to watch besides the default "change" we are using

  const onValueChange = (event: Event) => {
    const newValue = (event.currentTarget as HTMLInputElement)?.value;
    if (tagName === 'select') {
      // TODO: options metadata?
      valueAccessor.value = newValue;
    } else {
      valueAccessor.value = newValue;
    }
  };

  target.addEventListener('change', onValueChange);

  const unwatch = watchEffect(() => {
    let value = unref(valueAccessor);
    if (tagName === 'select') {
      const element = target as HTMLSelectElement;
      // A blank string or null value will select the caption
      if (value === '' || value === null) {
        value = undefined;
      }

      const allowUnset = unref(bindingHelpers.getBinding('allowUnset'));

      // find selected option
      // TODO: options metadata?
      const selection = Array.from(element.options).findIndex(
        (option) => option.value === value || (value === undefined && option.value === ''),
      );

      // set the new value if allowed
      if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
        element.selectedIndex = selection;
      }

      if (!allowUnset && value !== element.value) {
        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        pauseTracking();
        valueAccessor.value = element.value;
        enableTracking();
      }
    } else {
      if (value === null || value === undefined) {
        value = '';
      }
      target.value = String(value);
    }
  });

  return () => {
    unwatch();
    target.removeEventListener('change', onValueChange);
  };
}
