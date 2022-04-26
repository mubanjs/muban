import dedent from 'ts-dedent';
import type { PropertySource } from '../getComponentProps';
import { convertSourceValue } from './convertSourceValue';

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
        const isValidtag = ['INPUT', 'FORM', 'TEXTAREA', 'SELECT'].includes(element.nodeName);
        if (!isValidtag) {
          // eslint-disable-next-line no-console
          console.warn(
            dedent`The property "${propInfo.name}" of type "${propInfo.type.name}" requires an element of type input, form, textarea, or select. ${element.nodeName} was given
              Returning "undefined".`,
          );
          return undefined;
        }

        const formDataValue = (previousValue: unknown) => {
          if (!isForm) return previousValue;

          const formData = new FormData(element as HTMLFormElement);
          const childInputValues = formData.getAll(propInfo.source.name || '');

          if (propInfo.type === Object && propInfo.source.name) {
            // eslint-disable-next-line no-console
            console.warn(
              dedent`The property "${propInfo.name}" is trying to get a FormData object but is passing "${propInfo.source.name}" as "name", remove the name if you want the full FormData object
                  Returning "undefined".`,
            );
            return undefined;
          }

          if (propInfo.type === Object && propInfo.source.formData) return formData;

          if (propInfo.type !== Object) {
            if (propInfo.type === Array) return childInputValues;
            if (childInputValues.length === 0) return undefined;
            return convertSourceValue(propInfo, (childInputValues[0] as string) || '');
          }

          return previousValue;
        };

        const textInput = (previousValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isInput && !input.multiple) return convertSourceValue(propInfo, input.value);
          return previousValue;
        };

        const checkbox = (previousValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isCheckbox && propInfo.type === Boolean) return input.checked;
          return previousValue;
        };

        const nonBooleanCheckbox = (previousValue: unknown) => {
          const input = element as HTMLInputElement;
          if (isCheckbox && propInfo.type !== Boolean && input.checked)
            return convertSourceValue(propInfo, input.value);
          return previousValue;
        };

        const multiSelect = (previousValue: unknown) => {
          if (isMultiSelect) {
            return Array.from((element as HTMLSelectElement).selectedOptions).map(
              (option) => option.value,
            );
          }
          return previousValue;
        };

        return [formDataValue, textInput, checkbox, nonBooleanCheckbox, multiSelect].reduce(
          (previous, current) => current(previous),
          undefined,
        );
      },
    };
  };
}
