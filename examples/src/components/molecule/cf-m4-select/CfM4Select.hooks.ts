import { useToggle } from '../../../hooks/useToggle';
import { Ref, watch } from '@vue/runtime-core';
import { closeSelectOptions, openSelectOptions } from './CfM4Select.animations';
import type { ElementRef } from '../../../../../src/lib/utils/refs/refDefinitions.types';
import type { BindProps } from '../../../../../src/lib/utils/bindings/bindingDefinitions';
import focusLock from 'dom-focus-lock';
import { useEscapeKeyEvent, useKeyboardEvent } from '../../../hooks/useKeyboardEvent';
import { Key } from 'ts-key-enum';
import { moveFocus } from './CfM4Select.utils';

const handleArrowKeyEvent = (
  event: KeyboardEvent,
  direction: 'up' | 'down',
  container?: HTMLElement,
) => {
  event.preventDefault();
  moveFocus(direction, container);
};

export const useSelectExpanding = (
  optionsWrapper: ElementRef<HTMLElement | undefined, BindProps>,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  useEscapeKeyEvent(() => toggleIsExpanded(false));

  useKeyboardEvent(Key.ArrowUp, (event) => {
    if (isExpanded) {
      handleArrowKeyEvent(event, 'up', optionsWrapper.element);
    }
  });

  useKeyboardEvent(Key.ArrowDown, (event) => {
    if (isExpanded) {
      handleArrowKeyEvent(event, 'down', optionsWrapper.element);
    }
  });

  watch(
    () => isExpanded.value,
    (isExpanded) => {
      if (optionsWrapper.element === undefined) {
        throw new Error('The options wrapper cannot be found');
      }

      if (isExpanded) {
        openSelectOptions(optionsWrapper.element);

        focusLock.on(optionsWrapper.element);
      } else {
        closeSelectOptions(optionsWrapper.element);

        focusLock.off(optionsWrapper.element);
      }
    },
    { immediate: true },
  );

  return [isExpanded, toggleIsExpanded];
};
