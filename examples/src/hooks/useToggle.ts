import { ref, Ref } from '@vue/reactivity';

export const useToggle = (
  initialValue: boolean,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const state = ref(initialValue);
  const toggle = (force?: boolean) => (state.value = force === undefined ? !state.value : force);
  return [state, toggle] as const;
};
