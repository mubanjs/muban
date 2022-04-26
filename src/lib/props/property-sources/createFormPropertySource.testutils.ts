import type { PropTypeInfo } from '../propDefinitions.types';

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
  type: typeof Number | typeof String | typeof Boolean | typeof Date | typeof Array | typeof Object,
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
