/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFunction } from 'isntnt';
import { getCurrentComponentInstance } from '../Component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InjectionKey<T> = symbol;

export function provide<T>(key: InjectionKey<T> | string, value: T) {
  const currentInstance = getCurrentComponentInstance();
  if (!currentInstance) {
    // eslint-disable-next-line no-console
    console.error(`provide() can only be used inside setup().`);
  } else {
    // TS doesn't allow symbol as index type
    currentInstance.provides[key as string] = value;
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
    // fallback to appContext's `provides` if the instance is at root
    const provides =
      currentInstance.parent == null
        ? currentInstance.appContext && currentInstance.appContext.provides
        : currentInstance.parent.provides;

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string];
    }
    if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue() : defaultValue;
    }
    // eslint-disable-next-line no-console
    console.error(`injection "${String(key)}" not found.`);
  } else {
    // eslint-disable-next-line no-console
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

  const useContext = (defaultInjectValue?: T | (() => T), treatDefaultAsFactory?: boolean): T => {
    return inject(key, defaultInjectValue, treatDefaultAsFactory as any) as T;
  };

  return [provideContext, useContext] as const;
}
