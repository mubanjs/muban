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
      let value;
      const rawValue =
        propInfo.type !== Function
          ? propInfo.source.target!.getAttribute(propInfo.source.name) ?? undefined
          : undefined;

      if (rawValue !== undefined) {
        value = convertSourceValue(propInfo, rawValue);
      } else if (propInfo.type === Boolean) {
        // TODO: output warning about undefined booleans once we document
        //  how these should behave for all type of sources
        // eslint-disable-next-line no-console
        console.warn();
      }
      return value;
    },
  });
}
