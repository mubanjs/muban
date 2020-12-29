import type { ComponentApi } from '../Component.types';
import { getComponentForElement } from './global';

export function getDirectChildComponents(container: HTMLElement): Array<HTMLElement> {
  return Array.from(container.querySelectorAll<HTMLElement>(`[data-component]`)).filter(
    (element) =>
      element.parentElement?.closest(`[data-component]`) === container.closest(`[data-component]`),
  );
}

export function findParentComponent(element: HTMLElement): ComponentApi | undefined {
  let instance: ComponentApi | undefined;
  let parent: HTMLElement | undefined = element;
  do {
    parent = parent.parentElement?.closest<HTMLElement>(`[data-component]`) || undefined;
    instance = parent && getComponentForElement(parent);
    // console.log('while', instance, parent);
  } while (!instance && parent);

  return instance;
}
