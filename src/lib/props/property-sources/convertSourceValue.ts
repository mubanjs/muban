import parseJson from 'json-parse-better-errors';
import dedent from 'ts-dedent';
import type { PropTypeInfo } from '../propDefinitions.types';

export function convertSourceValue(
  propInfo: PropTypeInfo,
  value: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  switch (propInfo.type) {
    // eslint-disable-next-line default-case-last
    default:
    case String: {
      return value;
    }
    case Number: {
      if (!value) {
        return undefined;
      }
      // TODO, (how) should we support integers?
      //  maybe allow convertors as well, and use type to set some default convertors?
      //  or are validators enough?
      const converted = parseFloat(value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(converted) || !isFinite(converted)) {
        // eslint-disable-next-line no-console
        console.warn(
          dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" has possible invalid value.
                Received "${value}", parsed into "${converted}".
                Returning "undefined"`,
        );
        return undefined;
      }
      return converted;
    }
    case Boolean: {
      if (value === '') {
        // Developers might expect boolean attributes to work:
        // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
        // but we choose to be explicit to make this easier to implement in the CMS
        // eslint-disable-next-line no-console
        console.warn(
          dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" has an empty value, so is set to "false".
                Please provide explicit "true" or "false" as a value for booleans.`,
        );
      }
      return value.toLowerCase() === 'true';
    }
    case Date: {
      if (!value) {
        return undefined;
      }
      const converted = new Date(value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(converted.getTime())) {
        // eslint-disable-next-line no-console
        console.warn(
          dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" has possible invalid value.
                Received "${value}", parsed into "${converted}".
                Returning "undefined".`,
        );
        return undefined;
      }

      return converted;
    }
    case Array:
    case Object: {
      if (!value) {
        return undefined;
      }
      try {
        const converted = parseJson(value);

        if (propInfo.type === Array && !Array.isArray(converted)) {
          // eslint-disable-next-line no-console
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" is not an Array.
                  Received "${value}", parsed into "${converted}.
                  Returning "undefined""`,
          );

          return [];
        }
        if (propInfo.type === Object && !(converted instanceof Object)) {
          // eslint-disable-next-line no-console
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" is not an Object.
                  Received "${value}", parsed into "${converted}.
                  Returning "undefined""`,
          );
        }

        return converted;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return undefined;
      }
    }
  }
}
