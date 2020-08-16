import type { PropertySource } from '../getComponentProps';
import parseJson from 'json-parse-better-errors';

export function createJsonScriptPropertySource(): PropertySource {
  return (element) => {
    // get props json script tag
    // TODO: use ":scope >" to only select direct descendant
    const propContent =
      (element.querySelector('script[type="application/json"]') as HTMLElement | null)
        ?.textContent || '';

    const allJsonProps =
      (propContent &&
        (() => {
          try {
            return parseJson(propContent);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Malformed JSON props', e);
            return {};
          }
        })()) ||
      {};

    return {
      sourceName: 'json-script',
      hasProp: (propName) => propName in allJsonProps,
      getProp: (propName) => {
        // TODO: convert to Date - all other data types should be fine in JSON already
        return allJsonProps[propName];
      },
    };
  };
}
