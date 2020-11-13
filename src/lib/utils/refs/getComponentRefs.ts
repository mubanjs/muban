import typedObjectEntries from '../../../../examples/src/type-utils/typedObjectEntries';
import { refElement } from './refDefinitions';
import type { ComponentRefItem, TypedRefs } from './refDefinitions.types';

export function getComponentRefs<T extends HTMLElement, R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  element: T,
): TypedRefs<R> {
  return (
    (refs &&
      typedObjectEntries(refs).reduce((accumulator, [propName, refDefinition]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (accumulator as any)[propName] = (typeof refDefinition === 'string'
          ? refElement(refDefinition)
          : refDefinition
        ).selector(element);
        return accumulator;
      }, {} as TypedRefs<R>)) ??
    ({} as TypedRefs<R>)
  );
}
