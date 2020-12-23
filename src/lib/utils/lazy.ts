import type { ComponentFactory, LazyComponent } from '../Component.types';

export function lazy(
  displayName: string,
  getComponent: () => Promise<{ lazy: { component: ComponentFactory } }>,
): LazyComponent {
  const fn = async () => (await getComponent()).lazy.component;
  fn.displayName = displayName;
  fn.isLazy = true as const;
  return fn;
}

export function supportLazy(component: ComponentFactory) {
  return { component };
}

export function isLazyComponent(
  component: ComponentFactory | LazyComponent,
): component is LazyComponent {
  return 'isLazy' in component && component.isLazy;
}
