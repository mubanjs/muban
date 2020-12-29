/**
 * A small wrapper method to easily check if a user clicked inside of a HTMLElement.
 *
 * @param target - The target there the user clicked.
 * @param container - The container where to check against.
 */
import { onMounted, onUnmounted } from '../../../src/lib/api/apiLifecycle';

export const isClickedInside = (target: EventTarget, container: HTMLElement) =>
  container ? container.contains(target as HTMLElement) : false;

/**
 * Will add an event listener to the body and will fire a callback if the user clicks
 * outside of the provided container.
 *
 * @param container - The element used to check if the user clicked outside of.
 * @param callback - The callback that will be triggered if the user clicks outside of the element.
 */
export const useClickedOutside = (
  container: HTMLElement | Array<HTMLElement>,
  callback: () => void,
): void => {
  const elements = Array.isArray(container) ? container : [container];

  const onDocumentClick = ({ target }: MouseEvent) => {
    const match = target && elements.find((element) => isClickedInside(target, element));

    if (!match) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener('click', onDocumentClick);
  });
  onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick);
  });
};
