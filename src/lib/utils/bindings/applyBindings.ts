/* eslint-disable @typescript-eslint/no-explicit-any */
import { watch, watchEffect } from '@vue/runtime-core';
import { unref } from '@vue/reactivity';
import { extractFromHTML } from 'html-extract-data';
import type { InternalComponentInstance } from '../../Component.types';
import typedObjectEntries from '../../type-utils/typedObjectEntries';
import type { Binding } from './bindingDefinitions';
import checkedBinding from './checkedBinding';
import clickBinding from './clickBinding';
import cssBinding from './cssBinding';
import styleBinding from './styleBinding';
import textBinding from './textBinding';

// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types
export const bindingsList = {
  click: clickBinding,
  checked: checkedBinding,
  text: textBinding,
  style: styleBinding,
  css: cssBinding,
};

export const applyBindings = (
  bindings: Array<Binding> | null | undefined,
  instance: InternalComponentInstance,
): Array<(() => void) | undefined> | undefined => {
  if (bindings) {
    return bindings.flatMap((binding) => {
      if (binding.type === 'element') {
        return watch(
          () => unref(binding.ref),
          (element, oldValue, onInvalidate) => {
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (bindingName in bindingsList && element) {
                  return bindingsList[bindingName]?.(element, bindingValue as any);
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
                if (bindingName in bindingsList && elements) {
                  return elements.flatMap((element) => {
                    return bindingsList[bindingName]?.(element, bindingValue as any);
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
            // TODO: attach parent component for context
            const templateResult = template(data.value);
            ref.element.innerHTML = Array.isArray(templateResult)
              ? templateResult.join('')
              : templateResult;

            // TODO: make nicer?
            // it takes some time for the MutationObserver to detect the newly added DOM elements
            // for the "ref" watcher to update and instantiate and add the new children
            setTimeout(() => {
              instance.children.forEach((component) => component.setup());
            }, 1);
          }
        });
      }
    });
  }
};
