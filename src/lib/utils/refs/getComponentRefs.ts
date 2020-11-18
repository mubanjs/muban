import typedObjectEntries from '../../type-utils/typedObjectEntries';
import { refElement } from './refDefinitions';
import type { ComponentRefItem, TypedRefs } from './refDefinitions.types';

export function getComponentRefs<T extends HTMLElement, R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  element: T,
): TypedRefs<R> {
  return typedObjectEntries({ ...refs, self: '_self_' } as R).reduce(
    (accumulator, [propName, refDefinition]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accumulator as any)[propName] = (typeof refDefinition === 'string'
        ? refElement(refDefinition)
        : refDefinition
      ).createRef(element);
      return accumulator;
    },
    {} as TypedRefs<R>,
  );
}
