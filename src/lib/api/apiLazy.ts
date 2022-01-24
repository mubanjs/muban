import { pascalCase } from 'change-case';
import type { ComponentFactory, LazyComponent } from '../Component.types';

export function lazy(
  displayName: string,
  getComponent: () => Promise<{ [key: string]: ComponentFactory }>,
  exportName?: string,
): LazyComponent {
  const fn = async () => (await getComponent())[exportName || pascalCase(displayName)];

  fn.displayName = displayName;
  fn.isLazy = true as const;

  return fn;
}

/*
This function is doing nothing, it's here only to support projects made with the
previous pattern:

export const MyComponent = defineComponent({ name: 'my-component' });
export const lazy = supportLazy(MyComponent);
*/
export function supportLazy(component: ComponentFactory) {
  return component;
}

export function isLazyComponent(
  component: ComponentFactory | LazyComponent,
): component is LazyComponent {
  return 'isLazy' in component && component.isLazy;
}
