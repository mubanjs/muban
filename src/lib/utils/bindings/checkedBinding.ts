import { Ref, unref, watchEffect } from '@vue/runtime-core';

export default function (target: HTMLElement, modal: Ref<boolean | Array<string>>): () => void {
  const unwatch = watchEffect(() => {
    const val = unref(modal);
    if (Array.isArray(val)) {
      (target as HTMLInputElement).checked = val.includes((target as HTMLInputElement).value);
    } else {
      (target as HTMLInputElement).checked = val;
    }
  });
  const updateModel = () => {
    const val = unref(modal);
    if (Array.isArray(val)) {
      if ((target as HTMLInputElement).checked) {
        modal.value = (modal.value as Array<string>).concat((target as HTMLInputElement).value);
      } else {
        modal.value = (modal.value as Array<string>).filter(
          (v) => v !== (target as HTMLInputElement).value,
        );
      }
    } else {
      modal.value = (target as HTMLInputElement).checked;
    }
  };
  target.addEventListener('change', updateModel);

  return () => {
    unwatch();
    target.removeEventListener('change', updateModel);
  };
}
