import { isUndefined } from 'isntnt';
import type { ResolvedComponentRefItem, TypedRefs } from '../refs/refDefinitions.types';
import typedObjectEntries from '../type-utils/typedObjectEntries';
import type { PropTypeDefinition, PropTypeInfo } from './propDefinitions.types';

export type PropertySource = (
  componentElement: HTMLElement,
) => {
  sourceName: string;
  hasProp: (info: PropTypeInfo) => boolean;
  getProp: (info: PropTypeInfo) => unknown;
};

function convertToInternalPropInfo(
  element: HTMLElement,
  propName: string,
  propDefinition: PropTypeDefinition,
  refs: TypedRefs<Record<string, ResolvedComponentRefItem>>,
): PropTypeInfo {
  const { type, default: defaultValue, isOptional, validator } = propDefinition;

  let target: HTMLElement | undefined;
  // resolve refs into elements
  if (propDefinition.sourceOptions?.target) {
    const targetRef = refs[propDefinition.sourceOptions?.target];
    if (!targetRef) {
      console.error(
        `Property "${propName}" would like to use target "${propDefinition.sourceOptions?.target}", but is not found in available refs.`,
        Object.keys(refs),
      );
    } else {
      // TODO: support collections... but how?
      if (targetRef.type === 'element' && targetRef.element) {
        target = targetRef.element;
      }
      if (targetRef.type === 'component' && targetRef.component?.element) {
        target = targetRef.component.element;
      }
    }
  } else {
    target = element;
  }

  return {
    name: propName,
    type,
    default: defaultValue,
    isOptional,
    validator,
    source: {
      name: propDefinition.sourceOptions?.name ?? propName,
      target,
      type: propDefinition.sourceOptions?.type,
      options: propDefinition.sourceOptions?.options,
    },
  };
}

export function getComponentProps(
  props: Record<string, PropTypeDefinition> | undefined,
  element: HTMLElement,
  propertySources: Array<PropertySource>,
  refs: TypedRefs<Record<string, ResolvedComponentRefItem>>,
) {
  const sources = propertySources.map((s) => s(element));

  const p =
    typedObjectEntries(props ?? {}).reduce((accumulator, [propName, propType]) => {
      const propInfo = convertToInternalPropInfo(element, propName, propType, refs);

      // TODO: ignore function prop types for some sources?

      // if target cannot be found (and is required), just return undefined
      if (!propInfo.source.target) {
        if (!propType.isOptional) {
          console.error(
            `Property "${propInfo.name}" is marked as required, but the source target was not found.`,
          );
          return accumulator;
        }
      }

      let extractedValue;

      // if source type is explicitly provided
      if (propInfo.source.type) {
        const source = sources.find((s) => propInfo.source.type === s.sourceName);

        if (!source?.hasProp(propInfo)) {
          if (!propType.isOptional) {
            console.error(
              `Property "${propInfo.name}" is not available in source "${propInfo.source.type}".`,
            );
            return accumulator;
          }
        } else {
          extractedValue = source?.getProp(propInfo);
        }
      } else {
        // otherwise, use the default sources
        const defaultSources = sources.filter((s) =>
          ['data', 'json', 'css'].includes(s.sourceName),
        );
        // find available sources from those that are registered
        const availableSources = defaultSources.filter(
          (s) =>
            (propInfo.source.type === undefined || propInfo.source.type === s.sourceName) &&
            s.hasProp(propInfo),
        );

        if (availableSources.length === 0) {
          if (!propType.isOptional) {
            console.error(
              `Property "${propInfo.name}" is marked as required, but not found at target.`,
              propInfo.source.target,
            );
            return accumulator;
          }
        } else {
          if (propType.type === Boolean) {
            extractedValue = availableSources.some((source) => source.getProp(propInfo));
          } else {
            // if more than 1 sources, pick the first one (except for booleans)
            const usedSource = availableSources[0];
            if (availableSources.length > 1) {
              console.warn(
                `Property "${
                  propInfo.name
                }" is defined in more than one property source: ${availableSources
                  .map((s) => s.sourceName)
                  .join(', ')}. We'll use the first from the list: "${usedSource.sourceName}"`,
              );
            }

            extractedValue = usedSource.getProp(propInfo);
          }
        }
      }

      if (propType.validator) {
        if (!propType.validator(extractedValue)) {
          // TODO: should we indeed throw errors here, or resolve the value to undefined?
          throw new Error(
            `Validation Error: This prop value ("${extractedValue}") is not valid for: ${propInfo.name}`,
          );
        }
      }

      if (!isUndefined(propType.default) && isUndefined(extractedValue)) {
        extractedValue = propType.default;
      }
      accumulator[propName] = extractedValue;

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
