/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction } from 'isntnt';
import { getCurrentComponentInstance } from '../Component.Reactive';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InjectionKey<T> = symbol;

export function provide<T>(key: InjectionKey<T> | string, value: T) {
  const currentInstance = getCurrentComponentInstance();
  if (!currentInstance) {
    console.error(`provide() can only be used inside setup().`);
  } else {
    let provides = currentInstance.provides;
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    // TS doesn't allow symbol as index type
    provides[key as string] = value;
  }
}

export function inject<T>(key: InjectionKey<T> | string): T | undefined;
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false,
): T;
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true,
): T;
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false,
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const currentInstance = getCurrentComponentInstance();
  if (currentInstance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the intance is at root
    const provides = currentInstance.parent == null ? null : currentInstance.parent.provides;

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue() : defaultValue;
    } else {
      console.error(`injection "${String(key)}" not found.`);
    }
  } else {
    console.error(`inject() can only be used inside setup() or functional components.`);
  }
}

/**
 * Helper function around provide/inject to create a typed pair with a curried "key" and default values
 */
export function createContext<T>(key: InjectionKey<T> | string, defaultValue?: T) {
  const provideContext = (value?: T): void => {
    provide(key, value || defaultValue);
  };

  const useContext = (defaultValue?: T | (() => T), treatDefaultAsFactory?: boolean): T => {
    return inject(key, defaultValue, treatDefaultAsFactory as any) as T;
  };

  return [provideContext, useContext] as const;
}
