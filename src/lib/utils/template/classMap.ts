import typedObjectKeys from '../../type-utils/typedObjectKeys';

// TODO: check/add helpers for arrays as well
export function classMap(classes: Record<string, boolean>) {
  return typedObjectKeys(classes)
    .filter((key) => !!classes[key])
    .join(' ');
}
