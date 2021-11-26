import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createDataAttributePropertySource(): PropertySource {
  return () => ({
    sourceName: 'data',
    hasProp: (propInfo) =>
      Boolean(
        propInfo.source.target &&
          propInfo.type !== Function &&
          propInfo.source.name in propInfo.source.target.dataset,
      ),
    getProp: (propInfo) => {
      let value;
      const rawValue =
        propInfo.type !== Function
          ? propInfo.source.target!.dataset[propInfo.source.name] ?? undefined
          : undefined;

      if (rawValue !== undefined) {
        value = convertSourceValue(propInfo, rawValue);
      } else {
        if (propInfo.type === Boolean) {
          // TODO: output warning about undefined booleans once we document
          //  how these should behave for all type of sources
          console.warn();
        }
      }
      return value;
    },
  });
}
