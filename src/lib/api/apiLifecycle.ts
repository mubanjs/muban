/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */

import { pauseTracking, resetTracking } from '@vue/reactivity';
import { getCurrentComponentInstance, setCurrentComponentInstance } from '../Component';
import type { InternalComponentInstance } from '../Component.types';

export const enum LifecycleHooks {
  Mounted = 'm',
  Unmounted = 'um',
}

const ErrorTypeStrings: Record<number | string, string> = {
  [LifecycleHooks.Mounted]: 'mounted hook',
  [LifecycleHooks.Unmounted]: 'unmounted hook',
};

export function injectHook(
  type: LifecycleHooks,
  hook: Function & { __weh?: () => void },
  target: InternalComponentInstance | null = getCurrentComponentInstance(),
  prepend: boolean = false,
): Function | undefined {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    // cache the error handling wrapper for injected hooks so the same hook
    // can be properly deduped by the scheduler. "__weh" stands for "with error
    // handling".
    const wrappedHook =
      hook.__weh ||
      (hook.__weh = () => {
        if (target.isUnmounted) {
          return;
        }
        // disable tracking inside all lifecycle hooks
        // since they can potentially be called inside effects.
        pauseTracking();
        // Set currentInstance during hook invocation.
        // This assumes the hook does not synchronously trigger other hooks, which
        // can only be false when the user does something really funky.
        setCurrentComponentInstance(target);
        hook();
        setCurrentComponentInstance(null);
        resetTracking();
      });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = ErrorTypeStrings[type];
    console.warn(
      `${apiName} is called when there is no active component instance to be ` +
        `associated with. ` +
        `Lifecycle injection APIs can only be used during execution of setup().`,
    );
  }
}

export const createHook = <T extends Function = () => any>(lifecycle: LifecycleHooks) => (
  hook: T,
  target: InternalComponentInstance | null = getCurrentComponentInstance(),
) => injectHook(lifecycle, hook, target);

// export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.Mounted);
// export const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT);
export const onUnmounted = createHook(LifecycleHooks.Unmounted);

// export type ErrorCapturedHook = (
//   err: unknown,
//   instance: ComponentPublicInstance | null,
//   info: string,
// ) => boolean | void;
//
// export const onErrorCaptured = (
//   hook: ErrorCapturedHook,
//   target: ComponentInternalInstance | null = currentInstance,
// ) => {
//   injectHook(LifecycleHooks.ERROR_CAPTURED, hook, target);
// };
