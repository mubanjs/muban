import { Ref, unref, watchEffect } from '@vue/runtime-core';

export default function (target: HTMLElement, model: Ref<boolean | Array<string>>): () => void {
  const unwatch = watchEffect(() => {
    const val = unref(model);
    if (Array.isArray(val)) {
      (target as HTMLInputElement).checked = val.includes((target as HTMLInputElement).value);
    } else {
      (target as HTMLInputElement).checked = val;
    }
  });
  const updateModel = () => {
    const val = unref(model);
    if (Array.isArray(val)) {
      if ((target as HTMLInputElement).checked) {
        model.value = (model.value as Array<string>).concat((target as HTMLInputElement).value);
      } else {
        model.value = (model.value as Array<string>).filter(
          (v) => v !== (target as HTMLInputElement).value,
        );
      }
    } else {
      model.value = (target as HTMLInputElement).checked;
    }
  };
  target.addEventListener('change', updateModel);

  return () => {
    unwatch();
    target.removeEventListener('change', updateModel);
  };
}
