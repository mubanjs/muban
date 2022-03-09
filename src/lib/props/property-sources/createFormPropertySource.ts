import dedent from 'ts-dedent';
import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

export function createFormPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'form',
      hasProp: (propInfo) => Boolean(propInfo.source.target && propInfo.type !== Function),
      getProp: (propInfo) => {
        // let value;
        const element = propInfo.source.target;

        const isForm = element && element.nodeName === 'FORM';
        const isInput = element && element?.nodeName === 'INPUT';

        if (!isForm && !isInput) {
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" requires a valid 'form' or 'input' element
              Returning "undefined".`,
          );
          return undefined;
        }

        if (isForm) {
          const formData = new FormData(element as HTMLFormElement);
          const childInputValue = formData.get(propInfo.source.name || '');

          if (propInfo.type !== Object && !propInfo.source.name) {
            console.warn(
              dedent`The property "${propInfo.name}" is trying to get a FormData object but is type "${propInfo.type.name}", set it as type "Object"
                Returning "undefined".`,
            );
            return undefined;
          }
          return childInputValue
            ? convertSourceValue(propInfo, childInputValue as string)
            : formData;
        }

        if (isInput) {
          return (element as HTMLInputElement).value;
        }

        return undefined;

        /* if(isValidInput) {
          const formData = new FormData(element as HTMLFormElement);
          return formData.get(propInfo.source.name) || formData;
        }

        if(value != undefined) {
          return convertSourceValue(propInfo, value);
        } */

        //  const getDirectValue = propInfo.source.target?.nodeType
        /* propInfo.name
        propInfo.source
        propInfo.type
        propInfo.isOptional */
      },
    };
  };
}
