import { useToggle } from '../../../hooks/useToggle';
import { Ref, watch } from '@vue/runtime-core';
import { closeSelectOptions, openSelectOptions } from './CfM4Select.animations';
import type { ElementRef } from '../../../../../src/lib/utils/refs/refDefinitions.types';
import type { BindProps } from '../../../../../src/lib/utils/bindings/bindingDefinitions';

export const useSelectExpanding = (
  optionsWrapper: ElementRef<HTMLElement | undefined, BindProps>,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  watch(
    () => isExpanded.value,
    (isExpanded) => {
      if (optionsWrapper.element === undefined) {
        throw new Error('The options wrapper cannot be found');
      }

      if (isExpanded) {
        openSelectOptions(optionsWrapper.element);
      } else {
        closeSelectOptions(optionsWrapper.element);
      }
    },
    { immediate: true },
  );

  return [isExpanded, toggleIsExpanded];
};
