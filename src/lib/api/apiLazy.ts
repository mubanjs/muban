import { pascalCase } from 'change-case';
import type { PascalCase } from 'type-fest';
import type { ComponentFactory, LazyComponent } from '../Component.types';

type ComponentExportName<T extends string, U extends string | undefined> = undefined extends U
  ? PascalCase<T>
  : Exclude<U, undefined>;

export function lazy<T extends string, U extends string | undefined>(
  displayName: T,
  getComponent: () => Promise<{ [Key in ComponentExportName<T, U>]: ComponentFactory }>,
  exportName: U = pascalCase(displayName) as U,
): LazyComponent {
  const fn = async () => {
    const exports = await getComponent();
    const factory = exports[exportName as ComponentExportName<T, U>];
    if (!factory) {
      throw new Error(
        `Error after lazy loading.\nLazy loaded component "${displayName}" doesn't have export "${exportName}".\nDid you mean one of [${Object.keys(
          exports,
        )}]`,
      );
    }
    return factory;
  };

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
