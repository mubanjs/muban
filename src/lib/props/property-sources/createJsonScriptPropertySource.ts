import parseJson from 'json-parse-better-errors';
import { simpleMemo } from '../../utils/simple-memo';
import type { PropertySource } from '../getComponentProps';

const getJsonContent = simpleMemo(
  (element: HTMLElement): Record<string, unknown> => {
    // get props json script tag
    // TODO: use ":scope >" to only select direct descendant
    const scriptElement = element.querySelector<HTMLScriptElement>(
      'script[type="application/json"]',
    );
    // only resolve if direct descendant
    const propContent =
      (scriptElement?.parentElement === element && scriptElement?.textContent) || '';

    return (
      (propContent &&
        (() => {
          try {
            return parseJson(propContent);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Malformed JSON props', error);
            return {};
          }
        })()) ||
      {}
    );
  },
);

export function createJsonScriptPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'json',
      hasProp: (propInfo) =>
        Boolean(
          propInfo.source.target &&
            propInfo.source.name in getJsonContent(propInfo.source.target as HTMLElement),
        ),
      getProp: (propInfo) => {
        // TODO: convert to Date - all other data types should be fine in JSON already
        return getJsonContent(propInfo.source.target! as HTMLElement)[propInfo.source.name];
      },
    };
  };
}
