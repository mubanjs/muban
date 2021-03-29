import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createTextPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'text',
      hasProp: (propInfo) => Boolean(propInfo.source.target),
      getProp: (propInfo) => {
        let value =
          propInfo.type !== Function ? propInfo.source.target?.textContent ?? undefined : undefined;

        if (value !== undefined) {
          value = convertSourceValue(propInfo, value);
        } else {
          if (propInfo.type === Boolean) {
            console.warn();
          }
        }
        return value;
      },
    };
  };
}
