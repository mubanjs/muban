/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from '@vue/reactivity';
import { computed, unref } from '@vue/reactivity';
import { watch, watchEffect } from '@vue/runtime-core';
import type { BindingsHelpers } from '../bindings.types';
import { checkInitialBindingState } from '../utils/checkInitialBindingState';

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
    }
    if (useElementValue) {
      if (bindingHelpers.hasBinding('value')) {
        return unref(bindingHelpers.getBinding('value'));
      }
      return target.value;
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

  const getNewHtmlValueFromModel = () => {
    const modelValue = unref(model);
    const elementValue = checkedValue.value;
    let newValue: boolean;

    if (Array.isArray(modelValue)) {
      // When a checkbox is bound to an array,
      // being checked represents its value being present in that array
      newValue = modelValue.includes(elementValue);
    } else if (isCheckbox && elementValue === undefined) {
      // When a checkbox is bound to any other value (not an array) and "checkedValue" is not defined,
      // being checked represents the value being trueish
      newValue = Boolean(modelValue);
    } else {
      newValue = elementValue === modelValue;
    }
    return newValue;
  };

  // update the checkbox based on model changes
  const updateHtml = () => {
    target.checked = getNewHtmlValueFromModel();
  };

  const getNewModelValueFromHtml = () => {
    const isChecked = target.checked;
    let elementValue = checkedValue.value;

    // We can ignore unchecked radio buttons, because some other radio
    // button will be checked, and that one can take care of updating state.
    // Also ignore value changes to an already unchecked checkbox.
    if (!isChecked && isRadio) {
      return;
    }

    const modelValue = unref(model);
    let newModelValue;

    if (Array.isArray(modelValue)) {
      saveOldValue = oldElementValue;
      oldElementValue = elementValue;

      if (saveOldValue !== elementValue) {
        // When we're responding to the checkedValue changing, and the element is
        // currently checked, replace the old elem value with the new elem value
        // in the model array.
        if (isChecked) {
          newModelValue = (modelValue as Array<any>)
            // add current
            .concat(elementValue)
            // remove old
            .filter((v) => v !== saveOldValue);
        } else {
          newModelValue = (modelValue as Array<string>).filter((v) => v !== elementValue);
        }
      } else {
        // When we're responding to the user having checked/unchecked a checkbox,
        // add/remove the element value to the model array.
        // eslint-disable-next-line no-lonely-if
        if (isChecked) {
          newModelValue = (modelValue as Array<string>).concat(elementValue);
        } else {
          newModelValue = (modelValue as Array<string>).filter((v) => v !== elementValue);
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
      newModelValue = elementValue;
    }
    return newModelValue;
  };

  // update the modal based on user input
  const updateModel = () => {
    model.value = getNewModelValueFromHtml();
  };

  if (
    checkInitialBindingState(
      'checked',
      target.checked,
      model.value,
      unref(bindingHelpers.getBinding('initialValueSource')),
    ) === 'binding'
  ) {
    updateModel();
  }

  // when checkedValue changes it should first update the modal,
  // so when it later triggers the updateHTML, the modal already correctly reflects the updated state
  const unwatchCheckedValue = watch(() => checkedValue.value, updateModel);
  const unwatch = watchEffect(updateHtml);
  target.addEventListener('change', updateModel);

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
