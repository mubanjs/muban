import { camelCase } from 'change-case';
import { unref, watchEffect } from '@vue/runtime-core';
import type { Ref } from '@vue/reactivity';
import type { BindingMap, StyleBindingProperty } from '../bindings.types';

export function styleBinding(target: HTMLElement, valueAccessor: BindingMap<StyleBindingProperty>) {
  return watchEffect(() => {
    const styles = unref<Record<string, StyleBindingProperty> | Record<string, Ref<StyleBindingProperty>>>(valueAccessor);
    Object.entries(styles).forEach(([name, value]) => {
      let styleValue = unref(value);

      if (styleValue === null || styleValue === undefined || styleValue === false) {
        // Empty string removes the value, whereas null/undefined have no effect
        styleValue = '';
      }

      if (name.startsWith('--')) {
        // styleName is a custom CSS property
        target.style.setProperty(name, styleValue);
      } else {
        // https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/camelizeStyleName.js
        // not sure if camelize and camelCase are 100% the same for things like `-moz-` prefixes
        const styleName = camelCase(name.replace(/^-ms-/, 'ms-'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target.style[styleName as any] = styleValue;
      }
    });
  });
}
