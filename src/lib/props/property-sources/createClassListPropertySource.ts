import { kebabCase, camelCase } from 'lodash-es';
import dedent from 'ts-dedent';
import type { PropertySource } from '../getComponentProps';

export function createClassListPropertySource(): PropertySource {
  return () => ({
    sourceName: 'css',
    hasProp: (propInfo) =>
      // by default, we only support booleans
      (propInfo.source.type === undefined && propInfo.type === Boolean) ||
      // but if explicit, we support other types as well
      (propInfo.source.type === 'css' && Boolean(propInfo.source.target)),
    getProp: (propInfo) => {
      const target = propInfo.source.target!;

      // in case of boolean, check for existence
      if (propInfo.type === Boolean) {
        const hasValue = Boolean(
          target.classList.contains(propInfo.source.name) ||
            target.classList.contains(camelCase(propInfo.source.name)) ||
            target.classList.contains(kebabCase(propInfo.source.name)),
        );
        // only return false from missing value if this source is used explicitly
        // or if value is found
        if (propInfo.source.type === 'css' || hasValue) {
          return hasValue;
        }
        // otherwise return undefined to fallback to the default
        return undefined;
      }

      // in case of string, check for cssPredicate existence
      if (propInfo.type === String) {
        if (!propInfo.source.options?.cssPredicate) {
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" requires the use of "source.options.cssPredicate" to be set.
              Returning "undefined".`,
          );
          return undefined;
        }
        return Array.from(target.classList).find((className) =>
          propInfo.source.options?.cssPredicate!(className),
        );
      }

      if (propInfo.type === Array) {
        return Array.from(target.classList);
      }

      if (propInfo.type === Object) {
        return Array.from(target.classList).reduce(
          (acc, className) => ({ ...acc, [className]: true }),
          {} as Record<string, boolean>,
        );
      }

      console.warn(
        dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" does not support the "css" source.
              Returning "undefined".`,
      );
      return undefined;
    },
  });
}
