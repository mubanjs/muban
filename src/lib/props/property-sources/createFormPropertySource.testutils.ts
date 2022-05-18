import getPropTypeInfo from '../../test-utils/propTypes';
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
  formData?: boolean,
  sourceName: string = '',
): MixedProptypeInfo {
  const formTarget: PropTypeInfo = getPropTypeInfo({
    name,
    type,
    source: {
      name: sourceName,
      target: form,
      type: 'form',
      formData,
    },
  });

  const inputTarget: PropTypeInfo = { ...formTarget };
  const inputField = form.querySelector<HTMLElement>(`#${formTarget.source.name}`);
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
    number: getMixedPropTypeInfo(name, form, Number, formData, sourceName),
    string: getMixedPropTypeInfo(name, form, String, formData, sourceName),
    boolean: getMixedPropTypeInfo(name, form, Boolean, formData, sourceName),
    date: getMixedPropTypeInfo(name, form, Date, formData, sourceName),
    array: getMixedPropTypeInfo(name, form, Array, formData, sourceName),
    object: getMixedPropTypeInfo(name, form, Object, formData, sourceName),
  };
}
