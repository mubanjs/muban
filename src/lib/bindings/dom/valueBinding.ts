import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingValue } from '../bindings.types';

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
  valueAccessor: BindingValue<string | number | boolean>,
) {
  const tagName = target.tagName?.toLowerCase();

  if (isInputElement(target) && (target.type === 'checkbox' || target.type === 'radio')) {
    // TODO: use checkedValue binding
    return;
  }

  // TODO: allow users specify events to watch besides the default "change" we are using

  const onValueChange = (event: Event) => {
    const newValue = (event.currentTarget as HTMLInputElement)?.value;
    if (tagName === 'select') {
      // TODO
    } else {
      valueAccessor.value = newValue;
    }
  };

  target.addEventListener('change', onValueChange);

  const unwatch = watchEffect(() => {
    const value = unref(valueAccessor);
    if (tagName === 'select') {
      // TODO
    } else {
      target.value = String(value);
    }
  });

  return () => {
    unwatch();
    target.removeEventListener('change', onValueChange);
  };
}
