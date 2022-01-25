import { pascalCase } from 'change-case';
import type { PascalCase } from 'type-fest';
import type { ComponentFactory, LazyComponent } from '../Component.types';

type ComponentExportName<T extends string, U extends string | undefined> = undefined extends U
  ? PascalCase<T>
  : Exclude<U, undefined>;

/**
 * Lazy loads a component
 *
 * Usually the exported component name is equal to the pascal cased version of
 * the 'name' passed to the defineComponent function, the lazy function expects
 * the component's named export in the imported file to be equal to the pascal
 * cased version of the first argument 'displayName'
 *
 * If the named export does not match the pascalCased version of 'displayName'
 * a third argument 'exportName' can be passed, with the exact name of the
 * exported component
 *
 * @param {string} displayName The name of the component declared in the defineComponent() function
 * @param {function} getComponent A function that returns an import of the component file
 * @param {string} exportName The name of the exported component
 * @returns {Object} LazyComponent
 */
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

/**
 * @deprecated
 */
export function supportLazy(component: ComponentFactory) {
  return component;
}

export function isLazyComponent(
  component: ComponentFactory | LazyComponent,
): component is LazyComponent {
  return 'isLazy' in component && component.isLazy;
}
