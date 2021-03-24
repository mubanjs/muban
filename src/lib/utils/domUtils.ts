import type { ComponentApi } from '../Component.types';
import { getComponentForElement } from './global';

export function getDirectChildComponents(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll<HTMLElement>(`[data-component]`)).filter(
    (element) =>
      element.parentElement?.closest(`[data-component]`) === container.closest(`[data-component]`),
  );
}

/**
 * Finds the parent data-component element that is not the element itself.
 * @param element
 */
export function getParentComponentElement(element: HTMLElement): HTMLElement | null {
  return element.parentElement?.closest<HTMLElement>(`[data-component]`) ?? null;
}

/**
 * Finds the parent component instance that "owns" this element
 * @param element
 */
export function findParentComponent(element: HTMLElement): ComponentApi | undefined {
  let instance: ComponentApi | undefined;
  let parent: HTMLElement | undefined = element;
  do {
    parent = getParentComponentElement(parent) || undefined;
    instance = parent && getComponentForElement(parent);
    // console.log('while', instance, parent);
  } while (!instance && parent);

  return instance;
}
