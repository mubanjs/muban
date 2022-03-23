import dedent from 'ts-dedent';
import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';
import flow from 'lodash/flow';

export function createFormPropertySource(): PropertySource {
  return () => {
    return {
      sourceName: 'form',
      hasProp: (propInfo) => Boolean(propInfo.source.target && propInfo.type !== Function),
      getProp: (propInfo) => {
        const element = propInfo.source.target!;
        const isCheckbox =
          element.nodeName === 'INPUT' && (element as HTMLInputElement).type === 'checkbox';
        const isForm = element.nodeName === 'FORM';
        const isInput =
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.nodeName) &&
          (element as HTMLInputElement).type !== 'checkbox';
        const isMultiSelect =
          element.nodeName === 'SELECT' && (element as HTMLSelectElement).multiple;
        const isFile =
          element.nodeName === 'INPUT' && (element as HTMLInputElement).type === 'file';
        const isValidtag = ['INPUT', 'FORM', 'TEXTAREA', 'SELECT'].includes(element.nodeName);
        if (!isValidtag) {
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" requires an element of type input, form, textarea, or select. ${element.nodeName} was given
              Returning "undefined".`,
          );
          return undefined;
        }

        const formDataValue = (prevValue: unknown) => {
          if (isForm) {
            if (propInfo.type !== Object && !propInfo.source.name) {
              console.warn(
                dedent`The property "${propInfo.name}" is trying to get a FormData object but is type "${propInfo.type.name}", set it as type "Object"
                  Returning "undefined".`,
              );
              return undefined;
            }
            const formData = new FormData(element as HTMLFormElement);
            const childInputValue = formData.getAll(propInfo.source.name || '');
            const value =
              propInfo.type === Array
                ? childInputValue
                : convertSourceValue(propInfo, (childInputValue[0] as string) || '');

            return childInputValue.length ? value : formData;
          }
          return prevValue;
        };

        const textInput = (prevValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isInput && !input.multiple) return convertSourceValue(propInfo, input.value);
          return prevValue;
        };

        const checkbox = (prevValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isCheckbox && propInfo.type === Boolean) return input.checked;
          return prevValue;
        };

        const nonBooleanCheckbox = (prevValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isCheckbox && propInfo.type !== Boolean && input.checked)
            return convertSourceValue(propInfo, input.value);
          return prevValue;
        };

        const multiSelect = (prevValue: unknown) => {
          if (isMultiSelect) {
            return Array.from((element as HTMLSelectElement).selectedOptions).map(
              (option) => option.value,
            );
          }
          return prevValue;
        };

        return flow([formDataValue, textInput, checkbox, nonBooleanCheckbox, multiSelect])();
      },
    };
  };
}
