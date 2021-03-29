import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createHtmlPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'html',
      hasProp: (propInfo) => Boolean(propInfo.source.target),
      getProp: (propInfo) => {
        let value =
          propInfo.type !== Function ? propInfo.source.target?.innerHTML ?? undefined : undefined;

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
