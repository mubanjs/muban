import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createHtmlPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'html',
      hasProp: (propInfo) => Boolean(propInfo.source.target),
      getProp: (propInfo) => {
        let value;
        const rawValue =
          propInfo.type !== Function ? propInfo.source.target?.innerHTML ?? undefined : undefined;

        if (rawValue !== undefined) {
          value = convertSourceValue(propInfo, rawValue);
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
