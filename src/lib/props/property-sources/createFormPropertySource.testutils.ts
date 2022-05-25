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
  targetElement: HTMLElement,
  type: PropTypeDefinition['type'],
  formData?: boolean,
  sourceName: string = '',
): MixedProptypeInfo {
  const formTarget: PropTypeInfo = getPropTypeInfo({
    name,
    type,
    source: {
      name: sourceName,
      target: targetElement,
      type: 'form',
      formData,
    },
  });

  const inputTarget: PropTypeInfo = getPropTypeInfo({
    name,
    type,
    source: {
      name: sourceName,
      target:
        targetElement.querySelector<HTMLElement>(`[name='${formTarget.source.name}']`) ||
        targetElement,
      type: 'form',
      formData,
    },
  });

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
 * @param {Element} targetElement target element
 * @param {string} sourceName to be used as source.name
 * @param {boolean } formData to be used as source.formData
 * @returns {FullPropTypeInfo}
 */
export function getFullPropTypeInfo(
  name: string,
  targetElement: Element,
  sourceName?: string,
  formData?: boolean,
): FullPropTypeInfo {
  const target = targetElement as HTMLElement;

  return {
    number: getMixedPropTypeInfo(name, target, Number, formData, sourceName),
    string: getMixedPropTypeInfo(name, target, String, formData, sourceName),
    boolean: getMixedPropTypeInfo(name, target, Boolean, formData, sourceName),
    date: getMixedPropTypeInfo(name, target, Date, formData, sourceName),
    array: getMixedPropTypeInfo(name, target, Array, formData, sourceName),
    object: getMixedPropTypeInfo(name, target, Object, formData, sourceName),
  };
}
