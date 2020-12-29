/* eslint-disable @typescript-eslint/no-explicit-any */
import { watch, watchEffect } from '@vue/runtime-core';
import { unref } from '@vue/reactivity';
import { extractFromHTML } from 'html-extract-data';
import type { InternalComponentInstance } from '../Component.types';
import typedObjectEntries from '../type-utils/typedObjectEntries';
import { devtoolsComponentUpdated } from '../utils/devtools';
import { recursiveUnref } from '../utils/utils';
import { bindingsList } from './bindings';
import type { Binding } from './bindings.types';

export const applyBindings = (
  bindings: Array<Binding> | null | undefined,
  instance: InternalComponentInstance,
): Array<(() => void) | undefined> | undefined => {
  if (bindings) {
    return bindings.flatMap((binding) => {
      // TODO: Devtools only
      watchEffect(() => {
        // "trigger" all observables for this binding by unwrapping it
        recursiveUnref(binding.props);

        // update this component instance itself
        devtoolsComponentUpdated(instance);
      });

      if (binding.type === 'element') {
        return watch(
          () => unref(binding.ref),
          (element, oldValue, onInvalidate) => {
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (bindingName in bindingsList && element) {
                  return (bindingsList as any)[bindingName]?.(element, bindingValue as any);
                } else {
                  console.warn(`No binding for "${bindingName}`);
                }
              },
            );
            onInvalidate(() => {
              console.log('onInvalidate element');
              bindings.forEach((binding) => binding && binding());
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
                    return (bindingsList as any)[bindingName]?.(element, bindingValue as any);
                  });
                } else {
                  console.warn(`No binding for "${bindingName}`);
                }
              },
            );
            onInvalidate(() => {
              console.log('onInvalidate collection');
              bindings.forEach((binding) => binding && binding());
            });
          },
          { immediate: true },
        );
      } else if (binding.type === 'component') {
        typedObjectEntries(binding.props).map(([propName, bindingValue]) => {
          watchEffect(() => {
            if (['css', 'style', 'attr'].includes(propName)) {
              const element = unref(binding.ref)?.element;
              if (element) {
                bindingsList[propName as 'css' | 'style' | 'attr']?.(element, bindingValue as any);
              }
            } else {
              // TODO prop validation
              unref(binding.ref)?.setProps({
                [propName]: unref(bindingValue),
              });
            }
          });
        });
      } else if (binding.type === 'componentCollection') {
        typedObjectEntries(binding.props).forEach(([propName, bindingValue]) => {
          watchEffect(() => {
            const reff = unref(binding.ref);
            reff?.forEach((ref) => {
              watchEffect(() => {
                if (['css', 'style', 'attr'].includes(propName)) {
                  bindingsList[propName as 'css' | 'style' | 'attr']?.(
                    unref(ref).element,
                    bindingValue as any,
                  );
                } else {
                  // TODO prop validation
                  ref?.setProps({
                    [propName]: unref(bindingValue),
                  });
                }
              });
            });
          });
        });
      } else if (binding.type === 'template') {
        const { ref, extract, data, template, renderImmediate } = binding.props;
        if (ref && ref.element && extract) {
          const extracted = extractFromHTML(ref.element, extract.config);
          extract.onData(extracted);
        }
        watch(
          () => data.value,
          (templateData) => {
            if (ref?.element) {
              // TODO: attach parent component for context
              const templateResult = template(templateData);
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
          },
          { immediate: !!renderImmediate },
        );
      }
    });
  }
};
