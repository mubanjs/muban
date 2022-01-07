import { isUndefined } from 'isntnt';
import type {
  RefElementType,
  ResolvedComponentRefItem,
  TypedRefs,
} from '../refs/refDefinitions.types';
import typedObjectEntries from '../type-utils/typedObjectEntries';
import type { PropTypeDefinition, PropTypeInfo, SourceOption } from './propDefinitions.types';

export type PropertySource = (componentElement: RefElementType) => {
  sourceName: string;
  hasProp: (info: PropTypeInfo) => boolean;
  getProp: (info: PropTypeInfo) => unknown;
};

function convertToInternalPropInfoArray(
  element: RefElementType,
  propName: string,
  propDefinition: PropTypeDefinition & {
    sourceOptions: Array<SourceOption>;
  },
  refs: TypedRefs<Record<string, ResolvedComponentRefItem>>,
): Array<PropTypeInfo> {
  return propDefinition.sourceOptions.map((sourceOption) =>
    convertToInternalPropInfo(
      element,
      propName,
      {
        ...propDefinition,
        sourceOptions: sourceOption,
      },
      refs,
    ),
  );
}

function convertToInternalPropInfo(
  element: RefElementType,
  propName: string,
  propDefinition: PropTypeDefinition & {
    sourceOptions: SourceOption;
  },
  refs: TypedRefs<Record<string, ResolvedComponentRefItem>>,
): PropTypeInfo {
  const { type, default: defaultValue, isOptional, validator } = propDefinition;

  let target: RefElementType | undefined;
  // resolve refs into elements
  if (propDefinition.sourceOptions?.target) {
    const targetRef = propDefinition.sourceOptions.target
      ? refs[propDefinition.sourceOptions.target]
      : undefined;
    if (!targetRef) {
      // eslint-disable-next-line no-console
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
      name:
        (propDefinition.sourceOptions &&
          'name' in propDefinition.sourceOptions &&
          propDefinition.sourceOptions.name) ||
        propName,
      target,
      type: propDefinition.sourceOptions?.type,
      options:
        (propDefinition.sourceOptions &&
          'options' in propDefinition.sourceOptions &&
          propDefinition.sourceOptions.options) ||
        undefined,
    },
  };
}

function errorUnlessOptional(
  propInfo: PropTypeInfo,
  message: string,
  ...logParameters: Array<unknown>
) {
  if (!propInfo.isOptional) {
    // eslint-disable-next-line no-console
    console.error(message, ...logParameters);
    throw new Error('Exit');
  }
  return undefined;
}

function getValueFromMultipleSources(
  propInfo: Array<PropTypeInfo>,
  sources: Array<ReturnType<PropertySource>>,
  currentIndex: number = 0,
): any {
  try {
    const currentValue = getValueFromSource(propInfo[currentIndex], sources);
    return currentValue;
  } catch {
    if (currentIndex < propInfo.length - 1) {
      return getValueFromMultipleSources(propInfo, sources, currentIndex + 1);
    }
  }
}

function getValueFromSource(propInfo: PropTypeInfo, sources: Array<ReturnType<PropertySource>>) {
  // if target cannot be found, just return undefined
  if (!propInfo.source.target) {
    return errorUnlessOptional(
      propInfo,
      `Property "${propInfo.name}" is marked as required, but the source target was not found.`,
    );
  }

  // if source type is explicitly provided
  if (propInfo.source.type) {
    const source = sources.find((s) => propInfo.source.type === s.sourceName);

    if (!source?.hasProp(propInfo)) {
      return errorUnlessOptional(
        propInfo,
        `Property "${propInfo.name}" is not available in source "${propInfo.source.type}".`,
      );
    }

    return source?.getProp(propInfo);
  }

  // otherwise, use the default sources
  const defaultSources = sources.filter((s) => ['data', 'json', 'css'].includes(s.sourceName));
  // find available sources from those that are registered
  const availableSources = defaultSources.filter(
    (s) =>
      (propInfo.source.type === undefined || propInfo.source.type === s.sourceName) &&
      s.hasProp(propInfo),
  );

  if (availableSources.length === 0) {
    return errorUnlessOptional(
      propInfo,
      `Property "${propInfo.name}" is marked as required, but not found at target.`,
      propInfo.source.target,
    );
  }

  if (propInfo.type === Boolean) {
    return availableSources
      .map((source) => source.getProp(propInfo))
      .reduce((accumulator, value) => {
        if (accumulator === true || value === true) return true;
        if (value !== undefined) return value;
        return accumulator;
      }, undefined);
  }

  // if more than 1 sources, pick the first one (except for booleans)
  const usedSource = availableSources[0];
  if (availableSources.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `Property "${propInfo.name}" is defined in more than one property source: ${availableSources
        .map((s) => s.sourceName)
        .join(', ')}. We'll use the first from the list: "${usedSource.sourceName}"`,
    );
  }

  return usedSource.getProp(propInfo);
}

export function getComponentProps(
  props: Record<string, PropTypeDefinition> | undefined,
  element: RefElementType,
  propertySources: Array<PropertySource>,
  refs: TypedRefs<Record<string, ResolvedComponentRefItem>>,
) {
  const sources = propertySources.map((s) => s(element));

  const p =
    typedObjectEntries(props ?? {}).reduce((accumulator, [propName, propType]) => {
      let propInfo;

      if (propType.sourceOptions instanceof Array) {
        propInfo = convertToInternalPropInfoArray(
          element,
          propName,
          {
            ...propType,
            sourceOptions: propType.sourceOptions as Array<SourceOption>,
          },
          refs,
        );
      } else {
        propInfo = convertToInternalPropInfo(
          element,
          propName,
          {
            ...propType,
            sourceOptions: propType.sourceOptions as SourceOption,
          },
          refs,
        );
      }

      // TODO: ignore function prop types for some sources?

      let extractedValue;

      try {
        extractedValue =
          propInfo instanceof Array
            ? getValueFromMultipleSources(propInfo, sources)
            : getValueFromSource(propInfo, sources);
      } catch {
        return accumulator;
      }

      // set default value
      if (!isUndefined(propType.default) && isUndefined(extractedValue)) {
        extractedValue = propType.default;
      }

      // validate value
      if (propType.validator && !isUndefined(extractedValue)) {
        if (!propType.validator(extractedValue)) {
          // TODO: should we indeed throw errors here, or resolve the value to undefined?
          throw new Error(
            `Validation Error: This prop value ("${extractedValue}") is not valid for:`,
          );
        }
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
