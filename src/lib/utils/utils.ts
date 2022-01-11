/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import { unref } from '@vue/reactivity';

type ObjectIterator<TObject, TResult> = (
  value: TObject[keyof TObject],
  key: string,
  collection: TObject,
) => TResult;

export function mapValues<T extends Record<string, any>, TResult>(
  object: T,
  fn: ObjectIterator<T, TResult>,
): { [P in keyof T]: TResult } {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, fn(value, key, object)]),
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
