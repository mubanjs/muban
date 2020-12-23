import type { InternalComponentInstance } from '../../Component.types';
import typedObjectEntries from '../../type-utils/typedObjectEntries';
import { refElement } from './refDefinitions';
import type { ComponentRefItem, TypedRefs } from './refDefinitions.types';

export function createComponentRefs<R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  instance: InternalComponentInstance,
): TypedRefs<R> {
  return typedObjectEntries(({ ...refs, self: '_self_' } as unknown) as R).reduce(
    (accumulator, [propName, refDefinition]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accumulator as any)[propName] = (['string', 'function'].includes(typeof refDefinition)
        ? refElement(refDefinition)
        : refDefinition
      ).createRef(instance);
      return accumulator;
    },
    {} as TypedRefs<R>,
  );
}
