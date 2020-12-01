import type { ComponentFactory } from '../Component.types';

export function lazy(
  displayName: string,
  getComponent: () => Promise<{ lazy: { component: ComponentFactory } }>,
): () => Promise<ComponentFactory> {
  return async () => (await getComponent()).lazy.component;
}

export function supportLazy(component: ComponentFactory) {
  return { component };
}
