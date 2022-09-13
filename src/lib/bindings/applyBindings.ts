/* eslint-disable @typescript-eslint/no-explicit-any */
import { watch, watchEffect } from '@vue/runtime-core';
import { ref, unref } from '@vue/reactivity';
import { extractFromHTML } from 'html-extract-data';
import type { InternalComponentInstance } from '../Component.types';
import type { RefElementType } from '../refs/refDefinitions.types';
import typedObjectEntries from '../type-utils/typedObjectEntries';
import typedObjectKeys from '../type-utils/typedObjectKeys';
import { devtoolsComponentUpdated } from '../utils/devtools';
import { recursiveUnref } from '../utils/utils';
import type { CollectionBinding, ElementBinding } from './bindingDefinitions';
import { bindingsList } from './bindings';
import type { Binding, BindingsHelpers, BindProps } from './bindings.types';

function createBindingsHelpers(
  binding: ElementBinding<RefElementType, BindProps> | CollectionBinding<RefElementType, BindProps>,
): BindingsHelpers {
  // used to trigger the "has" and "get" bindings when a new binding is added
  const bindingProps = ref(typedObjectKeys(binding.props));

  return {
    hasBinding: (bindingName) => bindingProps.value.includes(bindingName),
    getBinding: (bindingName) => bindingProps.value && binding.props[bindingName],
    setBinding: (bindingName, bindingValue) => {
      // eslint-disable-next-line no-param-reassign
      binding.props[bindingName] = bindingValue;
      bindingProps.value = typedObjectKeys(binding.props);
    },
  };
}

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
            const bindingHelpers = createBindingsHelpers(binding);
            // eslint-disable-next-line no-shadow
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (!(bindingName in bindingsList)) {
                  // eslint-disable-next-line no-console
                  console.warn(
                    `No binding exists for "${bindingName}", only supported bindings are [${Object.keys(
                      bindingsList,
                    )}]`,
                  );
                } else if (element) {
                  return (bindingsList as any)[bindingName]?.(
                    element,
                    bindingValue as any,
                    bindingHelpers,
                  );
                }
                return undefined;
              },
            );
            onInvalidate(() => {
              // TODO debug
              // eslint-disable-next-line no-shadow
              bindings.forEach((binding) => binding && binding());
            });
          },
          { immediate: true },
        );
      }
      if (binding.type === 'collection') {
        return watch(
          // eslint-disable-next-line no-shadow
          () => unref(binding.ref).map((ref) => unref(ref)),
          (elements, oldValue, onInvalidate) => {
            const bindingHelpers = createBindingsHelpers(binding);
            // eslint-disable-next-line no-shadow
            const bindings = typedObjectEntries(binding.props).flatMap(
              ([bindingName, bindingValue]) => {
                if (!(bindingName in bindingsList)) {
                  // eslint-disable-next-line no-console
                  console.warn(
                    `No binding exists for "${bindingName}", only supported bindings are [${Object.keys(
                      bindingsList,
                    )}]`,
                  );
                } else if (elements) {
                  return elements.flatMap((element) => {
                    return (bindingsList as any)[bindingName]?.(
                      element,
                      bindingValue as any,
                      bindingHelpers,
                    );
                  });
                }
                return undefined;
              },
            );
            onInvalidate(() => {
              // eslint-disable-next-line no-shadow
              bindings.forEach((binding) => binding && binding());
            });
          },
          { immediate: true },
        );
      }
      if (binding.type === 'component') {
        typedObjectEntries(binding.props).forEach(([propName, bindingValue]) => {
          watchEffect(() => {
            if (propName === '$element') {
              typedObjectEntries(bindingValue).forEach(
                ([elementBindingKey, elementBindingValue]) => {
                  if (['css', 'style', 'attr', 'event'].includes(elementBindingKey)) {
                    const element = unref(binding.ref)?.element;
                    if (element) {
                      bindingsList[elementBindingKey as 'css' | 'style' | 'attr' | 'event']?.(
                        element,
                        elementBindingValue as any,
                      );
                    }
                  }
                },
              );
            } else {
              unref(binding.ref)?.setProps({
                [propName]: unref(bindingValue),
              });
            }
          });
        });
      } else if (binding.type === 'componentCollection') {
        typedObjectEntries(binding.props).forEach(([propName, bindingValue]) => {
          watchEffect(() => {
            const reff = unref(binding.ref).map((r) => unref(r));
            // eslint-disable-next-line no-shadow
            reff?.forEach((ref) => {
              watchEffect(() => {
                if (propName === '$element') {
                  typedObjectEntries(bindingValue).forEach(
                    ([elementBindingKey, elementBindingValue]) => {
                      if (['css', 'style', 'attr'].includes(elementBindingKey)) {
                        bindingsList[elementBindingKey as 'css' | 'style' | 'attr']?.(
                          unref(ref).element,
                          elementBindingValue as any,
                        );
                      }
                    },
                  );
                } else {
                  ref?.setProps({
                    [propName]: unref(bindingValue),
                  });
                }
              });
            });
          });
        });
      } else if (binding.type === 'template') {
        // eslint-disable-next-line no-shadow
        const { ref, extract, forceImmediateRender, onUpdate } = binding.props;
        let initialRender = true;
        let containerIsEmpty = false;

        if (ref && ref.element) {
          if (extract) {
            const extracted = extractFromHTML(ref.element as HTMLElement, extract.config);
            extract.onData(extracted);
          }
          // if the container is empty, we probably want to do an initial render
          // otherwise, we might want to leave the container as-is initially
          containerIsEmpty = ref.element.innerHTML.trim() === '';
        }

        watchEffect(() => {
          if (ref?.element) {
            // if neither of these are true, we should not do an initial render,
            // but instead only "watch" the data in the onUpdate function
            const shouldRenderUpdate = containerIsEmpty || forceImmediateRender || !initialRender;

            // TODO: attach parent component for context
            // pass along how the result of the update function is going to be used,
            // so the implementation can conditionally only invoke the watched observables, but
            // omit the template rendering
            const result = onUpdate(!shouldRenderUpdate);

            if (shouldRenderUpdate) {
              ref.element.innerHTML = Array.isArray(result) ? result.join('') : result ?? '';
            }

            initialRender = false;

            // TODO: make nicer?
            // it takes some time for the MutationObserver to detect the newly added DOM elements
            // for the "ref" watcher to update and instantiate and add the new children
            setTimeout(() => {
              instance.children.forEach((component) => component.setup());
            }, 1);
          }
        });
      } else if (binding.type === 'bindMap') {
        return binding.dispose;
      }
      return undefined;
    });
  }
};
