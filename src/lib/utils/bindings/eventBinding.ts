/* eslint-disable @typescript-eslint/no-explicit-any */
import typedObjectEntries from '../../type-utils/typedObjectEntries';

export default function (target: HTMLElement, events: HTMLElementEventMap) {
  typedObjectEntries(events).forEach(([eventName, fn]) => {
    createEventBinding(eventName)(target, fn as any);
  });
}

export function createEventBinding<T extends keyof HTMLElementEventMap>(eventName: T) {
  return (target: HTMLElement, fn: (event: HTMLElementEventMap[T]) => void): (() => void) => {
    target.addEventListener(eventName, fn);
    return () => {
      target.removeEventListener(eventName, fn);
    };
  };
}
