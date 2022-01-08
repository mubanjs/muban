import type { Ref } from '@vue/runtime-core';
import { watch } from '@vue/runtime-core';
// eslint-disable-next-line import/no-extraneous-dependencies
import focusLock from 'dom-focus-lock';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Key } from 'ts-key-enum';
import { useToggle } from '../../../hooks/useToggle';
import { closeSelectOptions, openSelectOptions } from './CfM4Select.animations';
import type { ComponentRef, ElementRef } from '../../../../../src/lib/refs/refDefinitions.types';
import type { BindProps } from '../../../../../src/lib/bindings/bindings.types';
import { useEscapeKeyEvent, useKeyboardEvent } from '../../../hooks/useKeyboardEvent';
import type { FocusDirection } from './CfM4Select.utils';
import { moveFocus } from './CfM4Select.utils';
import type { CfM1Button } from '../cf-m1-button/CfM1Button';

export const useSelectExpanding = (
  optionsWrapper: ElementRef<HTMLElement, BindProps>,
  customSelectButton: ComponentRef<typeof CfM1Button>,
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const onArrowKeyEvent = (event: KeyboardEvent, direction: FocusDirection): void => {
    if (isExpanded) {
      event.preventDefault();
      moveFocus(direction, optionsWrapper.element);
    }
  };

  useEscapeKeyEvent(() => toggleIsExpanded(false));
  useKeyboardEvent(Key.ArrowUp, (event) => onArrowKeyEvent(event, 'up'));
  useKeyboardEvent(Key.ArrowDown, (event) => onArrowKeyEvent(event, 'down'));

  watch(
    () => isExpanded.value,
    async (isExpanded) => {
      if (optionsWrapper.element === undefined) {
        throw new Error('The options wrapper cannot be found');
      }

      if (isExpanded) {
        await openSelectOptions(optionsWrapper.element);
        focusLock.on(optionsWrapper.element);
      } else {
        await closeSelectOptions(optionsWrapper.element);
        focusLock.off(optionsWrapper.element);

        if (!isExpanded) {
          customSelectButton.component?.element.focus();
        }
      }
    },
    { immediate: true },
  );

  return [isExpanded, toggleIsExpanded];
};
