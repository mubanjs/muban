import type { PropTypeDefinition, PropTypeInfo } from '../propDefinitions.types';

type PossibleTypes = 'number' | 'string' | 'boolean' | 'date' | 'array' | 'object';
type MixedProptypeInfo = {
  asForm: PropTypeInfo;
  asInput: PropTypeInfo;
};
type FullPropTypeInfo = {
  [key in PossibleTypes]: MixedProptypeInfo;
};

function getMixedPropTypeInfo(
  name: string,
  form: HTMLFormElement,
  type: PropTypeDefinition['type'],
  sourceName?: string,
  formData?: boolean,
): MixedProptypeInfo {
  const finalSourceName = sourceName || name;
  const formTarget: PropTypeInfo = {
    name,
    type,
    source: {
      name: finalSourceName,
      target: form,
      type: 'form',
      formData,
    },
  };
  const inputTarget: PropTypeInfo = { ...formTarget };
  const inputField = form.querySelector<HTMLElement>(`#${finalSourceName}`);
  if (inputField) inputTarget.source.target = inputField;

  return {
    asForm: formTarget,
    asInput: inputTarget,
  };
}

/**
 * For a given form return an object containg two PropTypeInfo, one where the
 * target is the form itself and one where the target is the form's child input
 *
 * Useful for testing value extraction for a form and it's child inputs
 * @param {string} name prop info name
 * @param {HTMLFormElement} html target element
 * @param {string} sourceName to be used as source.name
 * @param {boolean } formData to be used as source.formData
 * @returns {FullPropTypeInfo}
 */
export function getFullPropTypeInfo(
  name: string,
  form: HTMLFormElement,
  sourceName?: string,
  formData?: boolean,
): FullPropTypeInfo {
  return {
    number: getMixedPropTypeInfo(name, form, Number, sourceName, formData),
    string: getMixedPropTypeInfo(name, form, String, sourceName, formData),
    boolean: getMixedPropTypeInfo(name, form, Boolean, sourceName, formData),
    date: getMixedPropTypeInfo(name, form, Date, sourceName, formData),
    array: getMixedPropTypeInfo(name, form, Array, sourceName, formData),
    object: getMixedPropTypeInfo(name, form, Object, sourceName, formData),
  };
}
