/* eslint-disable @typescript-eslint/no-explicit-any */
const memory = new WeakMap();

/**
 * Memo function which does one thing
 * - only uses first parameter as the cache-key
 * - only accepts objects as cache-key (because of the `WeakMap`)
 * @param fn
 */
export function simpleMemo<T extends (...rest: Array<any>) => unknown>(fn: T): T {
  return function (this: any, ...rest: Parameters<T>): ReturnType<T> {
    const key = rest[0];
    if (memory.has(key)) {
      return memory.get(key);
    }
    const result = fn.apply(this, rest) as ReturnType<T>;
    memory.set(key, result);
    return result;
  } as T;
}
