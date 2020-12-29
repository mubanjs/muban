import { Ref, unref, watchEffect } from '@vue/runtime-core';

export function checkedBinding(
  target: HTMLInputElement,
  model: Ref<boolean | Array<string>>,
): () => void {
  const unwatch = watchEffect(() => {
    const val = unref(model);
    if (Array.isArray(val)) {
      target.checked = val.includes(target.value);
    } else {
      target.checked = val;
    }
  });
  const updateModel = () => {
    const val = unref(model);
    if (Array.isArray(val)) {
      if (target.checked) {
        model.value = (model.value as Array<string>).concat(target.value);
      } else {
        model.value = (model.value as Array<string>).filter((v) => v !== target.value);
      }
    } else {
      model.value = target.checked;
    }
  };
  target.addEventListener('change', updateModel);

  return () => {
    unwatch();
    target.removeEventListener('change', updateModel);
  };
}
