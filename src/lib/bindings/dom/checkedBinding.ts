/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, unref, Ref } from '@vue/reactivity';
import { watch, watchEffect } from '@vue/runtime-core';
import type { BindingsHelpers } from '../bindings.types';

export function checkedBinding(
  target: HTMLInputElement,
  model: Ref<any>,
  bindingHelpers: BindingsHelpers,
): () => void {
  let useElementValue = false;
  let saveOldValue: any = null;
  let oldElementValue: any = null;

  const checkedValue = computed(() => {
    // Treat "value" like "checkedValue" when it is included with "checked" binding
    if (bindingHelpers.hasBinding('checkedValue')) {
      return unref(bindingHelpers.getBinding('checkedValue'));
    } else if (useElementValue) {
      if (bindingHelpers.hasBinding('value')) {
        return unref(bindingHelpers.getBinding('value'));
      } else {
        return target.value;
      }
    }
  });

  const isCheckbox = target.type === 'checkbox';
  const isRadio = target.type === 'radio';

  // Only bind to check boxes and radio buttons
  if (!isCheckbox && !isRadio) {
    return () => undefined;
  }

  const rawValue = unref(model);
  const valueIsArray = isCheckbox && Array.isArray(rawValue);
  useElementValue = isRadio || valueIsArray;

  const unwatch = watchEffect(() => {
    const modelValue = unref(model);
    const elementValue = checkedValue.value;

    if (Array.isArray(modelValue)) {
      // When a checkbox is bound to an array,
      // being checked represents its value being present in that array
      target.checked = modelValue.includes(elementValue);
    } else if (isCheckbox && elementValue === undefined) {
      // When a checkbox is bound to any other value (not an array) and "checkedValue" is not defined,
      // being checked represents the value being trueish
      target.checked = Boolean(modelValue);
    } else {
      console.log('else', elementValue, modelValue);
      target.checked = elementValue === modelValue;
    }
  });
  const updateModel = () => {
    const isChecked = target.checked;
    let elementValue = checkedValue.value;

    // We can ignore unchecked radio buttons, because some other radio
    // button will be checked, and that one can take care of updating state.
    // Also ignore value changes to an already unchecked checkbox.
    if (!isChecked && isRadio) {
      return;
    }

    const modelValue = unref(model);

    if (Array.isArray(modelValue)) {
      saveOldValue = oldElementValue;
      oldElementValue = elementValue;

      if (saveOldValue !== elementValue) {
        // When we're responding to the checkedValue changing, and the element is
        // currently checked, replace the old elem value with the new elem value
        // in the model array.
        if (isChecked) {
          // add current
          model.value = (model.value as Array<any>).concat(elementValue);
          // remove old
          model.value = (model.value as Array<any>).filter((v) => v !== saveOldValue);
        }
      } else {
        // When we're responding to the user having checked/unchecked a checkbox,
        // add/remove the element value to the model array.
        if (target.checked) {
          model.value = (model.value as Array<string>).concat(elementValue);
        } else {
          model.value = (model.value as Array<string>).filter((v) => v !== elementValue);
        }
      }
    } else {
      if (isCheckbox) {
        if (elementValue === undefined) {
          elementValue = isChecked;
        } else if (!isChecked) {
          elementValue = undefined;
        }
      }
      model.value = elementValue;
    }
  };

  target.addEventListener('change', updateModel);
  const unwatchCheckedValue = watch(() => checkedValue.value, updateModel);

  return () => {
    unwatch();
    unwatchCheckedValue();
    target.removeEventListener('change', updateModel);
  };
}

export function checkedValueBinding(target: HTMLInputElement, model: Ref<any>): () => void {
  const unwatch = watchEffect(() => {
    target.value = unref(model).value;
  });

  return () => {
    unwatch();
  };
}
