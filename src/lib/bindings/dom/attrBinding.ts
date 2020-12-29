import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from '../bindings.types';

export function attrBinding(
  target: HTMLElement,
  attributes: BindingMap<string | boolean | number | null | undefined>,
) {
  return watchEffect(() => {
    Object.entries(attributes).forEach(([name, value]) => {
      if (name.includes(':')) {
        console.warn(`Namespaced attributes are currently not supported: ${value}`);
        return;
      }

      const attrValue = unref(value);

      // when values are "falsy", we should remove the attribute completely, since that's how HTML
      // works internally
      const shouldRemove = attrValue === false || attrValue === null || attrValue === undefined;

      if (shouldRemove) {
        target.removeAttribute(name);
      } else {
        target.setAttribute(name, String(attrValue));
      }
    });
  });
}
