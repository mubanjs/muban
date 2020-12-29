/* eslint-disable @typescript-eslint/no-explicit-any */
import { unref } from '@vue/reactivity';

type ObjectIterator<TObject, TResult> = (
  value: TObject[keyof TObject],
  key: string,
  collection: TObject,
) => TResult;

export function mapValues<T extends Record<string, any>, TResult>(
  obj: T,
  fn: ObjectIterator<T, TResult>,
): { [P in keyof T]: TResult } {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key, obj)]),
  ) as any;
}

export function recursiveUnref(source: any): any {
  const value = unref(source);
  if (Array.isArray(value)) {
    return value.map(recursiveUnref);
  }
  if (String(value) === '[object Object]') {
    return mapValues(value, recursiveUnref);
  }
  return value;
}
