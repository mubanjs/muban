import { pascalCase } from 'change-case';
import type { PascalCase } from 'type-fest';
import type { ComponentFactory, LazyComponent } from '../Component.types';

type ComponentExportName<T extends string, U extends string | undefined> = undefined extends U
  ? PascalCase<T>
  : Exclude<U, undefined>;

/**
 * A wrapper to allow the registration of "lazy" components.
 *
 * Instead of providing an actual Component to the `components` array within
 * `defineComponent`, this wrapper can be used to provide a "lazy" component.
 *
 * Lazy components are only loaded when the passed `displayName`
 * (1st parameter) exists as a `data-component` attribute in the DOM.
 *
 * When that is the case, the `getComponent` (2nd parameter) is called, which
 * should return a `Promise` with the module exports.
 *
 * Once loaded, it tries to use the export that matches the `PascalCase` version
 * of the `displayName` (which is the default convention). If for some reason
 * the export doesn't match this convention, or a file exports two components,
 * you can provide the `exportName` (3rd parameter) to be used instead.
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
