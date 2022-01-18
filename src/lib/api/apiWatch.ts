/* eslint-disable @typescript-eslint/ban-types */
import type {
  WatchCallback,
  WatchEffect,
  WatchOptions,
  WatchOptionsBase,
  WatchSource,
  WatchStopHandle,
} from '@vue/runtime-core';
import { watch as vueWatch, watchEffect as vueWatchEffect } from '@vue/runtime-core';
import { getCurrentComponentInstance } from '../Component';

declare type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never;
};
declare type MultiWatchSources = Array<WatchSource<unknown> | object>;

export function watch<T extends MultiWatchSources, Immediate extends Readonly<boolean> = false>(
  sources: [...T],
  callback: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  callback: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  callback: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;
export function watch<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  callback: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function watch(sources: any, callback: any, options: any): WatchStopHandle {
  const instance = getCurrentComponentInstance();
  // don't even create the effect if this component is not mounted
  if (instance && instance.isUnmounted) {
    return () => undefined;
  }

  const stopHandle = vueWatch(sources, callback, options);

  // register stopHandle so it gets executed when the component unmounts
  instance?.disposers.push(stopHandle);

  return stopHandle;
}

export function watchEffect(effect: WatchEffect, options?: WatchOptionsBase): WatchStopHandle {
  const instance = getCurrentComponentInstance();
  // don't even create the effect if this component is not mounted
  if (instance && instance.isUnmounted) {
    return () => undefined;
  }

  const stopHandle = vueWatchEffect(effect, options);

  // register stopHandle so it gets executed when the component unmounts
  instance?.disposers.push(stopHandle);

  return stopHandle;
}
