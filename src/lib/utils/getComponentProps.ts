import type { PropTypeDefinition } from '../../../examples/src/prop-types';
import typedObjectEntries from '../../../examples/src/type-utils/typedObjectEntries';

export type PropertySource = (
  element: HTMLElement,
) => {
  sourceName: string;
  hasProp: (propName: string, definition: PropTypeDefinition) => boolean;
  getProp: (propName: string, definition: PropTypeDefinition) => unknown;
};

export function getComponentProps(
  props: Record<string, PropTypeDefinition> | undefined,
  element: HTMLElement,
  propertySources: Array<PropertySource>,
) {
  const sources = propertySources.map((s) => s(element));

  const p =
    typedObjectEntries(props ?? {}).reduce((accumulator, [propName, propType]) => {
      // TODO: ignore function prop types for some sources?

      const availableSources = sources.filter((s) => s.hasProp(propName, propType));

      if (availableSources.length === 0) {
        if (!propType.isOptional) {
          console.error(
            `Property "${propName}" is marked as required, but not found in component.`,
          );
        }

        return accumulator;
      }

      const usedSource = availableSources[availableSources.length - 1];
      if (availableSources.length > 1) {
        console.warn(
          `Property "${propName}" is defined in more than one property source: ${availableSources
            .map((s) => s.sourceName)
            .join(', ')}. We'll use the last from the list: "${usedSource.sourceName}"`,
        );
      }

      // TODO: validation
      accumulator[propName] = usedSource.getProp(propName, propType);

      return accumulator;
    }, {} as Record<string, unknown>) ?? {};

  return p;
}

// const sources = [
//   createDataAttributePropertySource(),
//   createJsonScriptPropertySource(),
//   createReactivePropertySource(),
// ];

// getComponentProps({}, element, sources);
