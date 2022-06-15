import dedent from 'ts-dedent';
import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createCustomPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'custom',
      hasProp: (propInfo) => Boolean(propInfo.source.target),
      getProp: (propInfo) => {
        if (!propInfo.source.options?.customSource) {
          // eslint-disable-next-line no-console
          console.warn(
            dedent`The property "${propInfo.name}" doesn't have a valid 'customSource' function
                Returning "undefined".`,
          );

          return undefined;
        }

        const rawValue = propInfo.source.options?.customSource(
          propInfo.source.target as HTMLElement,
        );
        return rawValue !== undefined ? convertSourceValue(propInfo, String(rawValue)) : rawValue;
      },
    };
  };
}
