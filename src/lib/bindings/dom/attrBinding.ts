// eslint-disable-next-line unicorn/prevent-abbreviations
import { unref, watchEffect } from '@vue/runtime-core';
import type { BindingMap } from '../bindings.types';

// eslint-disable-next-line unicorn/prevent-abbreviations
export function attrBinding(
  target: HTMLElement,
  attributes: BindingMap<string | boolean | number | null | undefined>,
) {
  return watchEffect(() => {
    Object.entries(attributes).forEach(([name, value]) => {
      if (name.includes(':')) {
        // eslint-disable-next-line no-console
        console.warn(`Namespaced attributes are currently not supported: ${value}`);
        return;
      }

      const attributeValue = unref(value);

      // when values are "falsy", we should remove the attribute completely, since that's how HTML
      // works internally
      const shouldRemove =
        attributeValue === false || attributeValue === null || attributeValue === undefined;

      if (shouldRemove) {
        target.removeAttribute(name);
      } else {
        target.setAttribute(name, String(attributeValue));
      }
    });
  });
}
