import type { Ref } from '@vue/reactivity';
import { isRef, ref, unref } from '@vue/reactivity';
import { watchEffect } from '@vue/runtime-core';

export const useToggle = (
  initialValue: Ref<boolean> | boolean,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const state = ref(unref(initialValue));

  if (isRef(initialValue)) {
    watchEffect(() => {
      if (initialValue.value !== undefined) {
        state.value = initialValue.value;
      }
    });
  }
  const toggle = (force?: boolean) => {
    state.value = force === undefined ? !state.value : force;
  };
  return [state, toggle] as const;
};
