import type { ComponentFactory, ComponentMeta } from '../Component.types';

export function lazy(
  getComponent: () => Promise<{ meta: ComponentMeta }>,
): () => Promise<ComponentFactory> {
  return async () => (await getComponent()).meta.component;
}
