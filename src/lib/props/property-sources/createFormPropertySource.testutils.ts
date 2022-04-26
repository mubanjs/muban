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
): MixedProptypeInfo {
  const finalSourceName = sourceName || name;
  const formTarget: PropTypeInfo = {
    name,
    type,
    source: {
      name: finalSourceName,
      target: form,
      type: 'form',
    },
  };
  const inputTarget: PropTypeInfo = { ...formTarget };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  inputTarget.source.target = form.querySelector<HTMLElement>(`#${finalSourceName}`)!;

  return {
    asForm: formTarget,
    asInput: inputTarget,
  };
}

export function getFullPropTypeInfo(
  name: string,
  form: HTMLFormElement,
  sourceName?: string,
): FullPropTypeInfo {
  return {
    number: getMixedPropTypeInfo(name, form, Number, sourceName),
    string: getMixedPropTypeInfo(name, form, String, sourceName),
    boolean: getMixedPropTypeInfo(name, form, Boolean, sourceName),
    date: getMixedPropTypeInfo(name, form, Date, sourceName),
    array: getMixedPropTypeInfo(name, form, Array, sourceName),
    object: getMixedPropTypeInfo(name, form, Object, sourceName),
  };
}
