/* eslint-disable @typescript-eslint/no-explicit-any */
import { watch, watchEffect } from '@vue/runtime-core';
import { unref } from '@vue/reactivity';
import { extractFromHTML } from 'html-extract-data';
import { render } from 'lit-html';
import typedObjectEntries from '../../../../examples/src/type-utils/typedObjectEntries';
import type { Binding, BindProps } from './bindingDefinitions';
import checkedBinding from './checkedBinding';
import clickBinding from './clickBinding';
import cssBinding from './cssBinding';
import styleBinding from './styleBinding';
import textBinding from './textBinding';

type BindingMap<T> = {
  [P in keyof T]: (target: HTMLElement, value: Exclude<T[P], undefined>) => () => void;
};

// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types
const bindingsMap: BindingMap<BindProps> = {
  click: clickBinding,
  checked: checkedBinding,
  text: textBinding,
  style: styleBinding,
  css: cssBinding,
};

export const applyBindings = (
  bindings: Array<Binding> | null | undefined,
): Array<(() => void) | undefined> | undefined => {
  if (bindings) {
    return bindings.flatMap((binding) => {
      if (binding.type === 'element') {
        return watch(
          () => unref(binding.ref),
          (element, oldValue, onInvalidate) => {
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (bindingName in bindingsMap && element) {
                  return bindingsMap[bindingName]?.(element, bindingValue as any);
                } else {
                  console.warn(`No binding for "${bindingName}`);
                }
              },
            );
            onInvalidate(() => {
              console.log('onInvalidate element');
              bindings.forEach((binding) => binding?.());
            });
          },
          { immediate: true },
        );
      } else if (binding.type === 'collection') {
        return watch(
          () => unref(binding.ref),
          (elements, oldValue, onInvalidate) => {
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (bindingName in bindingsMap && elements) {
                  return elements.flatMap((element) => {
                    return bindingsMap[bindingName]?.(element, bindingValue as any);
                  });
                } else {
                  console.warn(`No binding for "${bindingName}`);
                }
              },
            );
            onInvalidate(() => {
              console.log('onInvalidate collection');
              bindings.forEach((binding) => binding?.());
            });
          },
          { immediate: true },
        );
      } else if (binding.type === 'component') {
        typedObjectEntries(binding.props).map(([propName, bindingValue]) => {
          watchEffect(() => {
            // TODO prop validation
            unref(binding.ref)?.setProps({
              [propName]: unref(bindingValue),
            });
          });
        });
      } else if (binding.type === 'componentCollection') {
        typedObjectEntries(binding.props).forEach(([propName, bindingValue]) => {
          watchEffect(() => {
            const reff = unref(binding.ref);
            reff?.forEach((ref) => {
              watchEffect(() => {
                // TODO prop validation
                ref?.setProps({
                  [propName]: unref(bindingValue),
                });
              });
            });
          });
        });
      } else if (binding.type === 'template') {
        const { ref, extract, data, template } = binding.props;
        if (ref && ref.element && extract) {
          const extracted = extractFromHTML(ref.element, extract.config);
          extract.onData(extracted);
        }
        watchEffect(() => {
          if (ref?.element) {
            render(template(data.value), ref.element);
          }
        });
      }
    });
  }
};
