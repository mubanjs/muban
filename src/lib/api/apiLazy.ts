import type { ComponentFactory, LazyComponent } from '../Component.types';

export function lazy(
  displayName: string,
  getComponent: () => Promise<{ [key: string]: ComponentFactory }>,
  componentName?: string,
): LazyComponent {
  const capitalize = ([first, ...rest]: string) => first.toUpperCase() + rest.join('');

  const pascalDisplayName = displayName.split('-').map(capitalize).join('');

  const fn = async () => (await getComponent())[componentName || pascalDisplayName];

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
