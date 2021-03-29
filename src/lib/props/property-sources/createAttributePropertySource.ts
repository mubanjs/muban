import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createAttributePropertySource(): PropertySource {
  return () => ({
    sourceName: 'attr',
    hasProp: (propInfo) =>
      Boolean(
        propInfo.source.target &&
          propInfo.type !== Function &&
          propInfo.source.target.hasAttribute(propInfo.source.name),
      ),
    getProp: (propInfo) => {
      const value =
        propInfo.type !== Function
          ? propInfo.source.target!.getAttribute(propInfo.source.name) ?? undefined
          : undefined;

      if (value !== undefined) {
        convertSourceValue(propInfo, value);
      } else {
        if (propInfo.type === Boolean) {
          console.warn();
        }
      }
      return value;
    },
  });
}
