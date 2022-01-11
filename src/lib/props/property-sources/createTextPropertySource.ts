import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createTextPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'text',
      hasProp: (propInfo) => Boolean(propInfo.source.target),
      getProp: (propInfo) => {
        let value;
        const rawValue =
          propInfo.type !== Function ? propInfo.source.target?.textContent ?? undefined : undefined;

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
    };
  };
}
