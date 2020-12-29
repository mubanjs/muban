import type { InternalComponentInstance } from '../Component.types';
import { mapValues } from '../utils/utils';
import { refElement } from './refDefinitions';
import type {
  ComponentRefItem,
  ComponentRefItemShortcuts,
  ResolvedComponentRefItem,
  TypedRefs,
} from './refDefinitions.types';

/**
 * Checks if a passed ref is a shortcut or not
 * TODO: also support Component shortcuts?
 *
 * @param refDefinition
 */
export function isRefItemShortcut(
  refDefinition: ComponentRefItem,
): refDefinition is ComponentRefItemShortcuts {
  return ['string', 'function'].includes(typeof refDefinition);
}

/**
 * Convert "string" and "queryFn" shortcut refs to refElements
 * @param refs
 */
function normalizeRefs<R extends Record<string, ComponentRefItem>>(
  refs: R,
): {
  [P in keyof R]: ResolvedComponentRefItem;
} {
  return mapValues(refs, (value) =>
    isRefItemShortcut(value) ? refElement(value) : (value as ResolvedComponentRefItem),
  );
}

/**
 * Turns `refDefinitions` passed to the component definitions into "objects" that
 * are passed as `refs` to the setup function
 * @param refs
 * @param instance
 */
export function createComponentRefs<R extends Record<string, ComponentRefItem>>(
  refs: R | undefined,
  instance: InternalComponentInstance,
): TypedRefs<R> {
  const normalizedRefs = normalizeRefs({ ...refs, self: '_self_' });
  return mapValues(normalizedRefs, (value) => value.createRef(instance)) as TypedRefs<R>;
}
