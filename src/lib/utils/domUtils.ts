import type { ComponentApi } from '../Component.types';
import type { RefElementType } from '../refs/refDefinitions.types';
import { getComponentForElement } from './global';

export const wrapperBoundaryName = 'data-wrapper-boundary';

export function getOwnerComponent(element: Element): Element | null {
  const closestParent = element.parentElement?.closest(`[data-component]`) ?? null;
  const closestBoundary = element.parentElement?.closest(`[${wrapperBoundaryName}]`) ?? null;

  if (closestBoundary && closestParent) {
    return getOwnerComponent(closestParent);
  }

  return closestParent;
}

export function getDirectChildComponents(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll<HTMLElement>(`[data-component]`)).filter(
    (element) => getOwnerComponent(element) === container.closest(`[data-component]`),
  );
}

/**
 * Finds the parent data-component element that is not the element itself.
 * @param element
 */
export function getParentComponentElement(element: RefElementType): HTMLElement | null {
  return (getOwnerComponent(element) as HTMLElement) ?? null;
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
