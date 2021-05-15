/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention,@typescript-eslint/ban-types */
import type { InternalComponentInstance, InternalNodeInstance } from '../Component.types';
import type { App } from '../api/apiCreateApp';

interface AppRecord {
  id: number;
  app: App;
  version: string;
  types: Record<string, string | symbol>;
}

enum DevtoolsHooks {
  APP_INIT = 'app:init',
  APP_UNMOUNT = 'app:unmount',
  COMPONENT_UPDATED = 'component:updated',
  COMPONENT_ADDED = 'component:added',
  COMPONENT_REMOVED = 'component:removed',
  COMPONENT_EMIT = 'component:emit',
}

interface DevtoolsHook {
  emit: (event: string, ...payload: Array<any>) => void;
  on: (event: string, handler: Function) => void;
  once: (event: string, handler: Function) => void;
  off: (event: string, handler: Function) => void;
  appRecords: Array<AppRecord>;
}

export let devtools: DevtoolsHook;

export function setDevtoolsHook(hook: DevtoolsHook): void {
  devtools = hook;
}

export function devtoolsInitApp(app: App, version: string): void {
  // TODO queue if devtools is undefined
  if (!devtools) return;
  devtools.emit(DevtoolsHooks.APP_INIT, app, version, {});
}

export function devtoolsUnmountApp(app: App): void {
  if (!devtools) return;
  devtools.emit(DevtoolsHooks.APP_UNMOUNT, app);
}

export const devtoolsComponentAdded = /*#__PURE__*/ createDevtoolsComponentHook(
  DevtoolsHooks.COMPONENT_ADDED,
);

export const devtoolsComponentUpdated = /*#__PURE__*/ createDevtoolsComponentHook(
  DevtoolsHooks.COMPONENT_UPDATED,
);

export const devtoolsComponentRemoved = /*#__PURE__*/ createDevtoolsComponentHook(
  DevtoolsHooks.COMPONENT_REMOVED,
);

function createDevtoolsComponentHook(hook: DevtoolsHooks) {
  return (component: InternalNodeInstance) => {
    if (!devtools) return;
    devtools.emit(
      hook,
      component.appContext.app,
      component.uid,
      component.parent ? component.parent.uid : undefined,
      component,
    );
  };
}

export function devtoolsComponentEmit(
  component: InternalComponentInstance,
  event: string,
  params: Array<any>,
) {
  if (!devtools) return;
  devtools.emit(DevtoolsHooks.COMPONENT_EMIT, component.appContext.app, component, event, params);
}

export function initDev() {
  // TODO window interface
  const target = (globalThis || window || {}) as any;

  target.__MUBAN__ = true;
  setDevtoolsHook(target.__MUBAN_DEVTOOLS_GLOBAL_HOOK__);

  // console.info(
  //   `You are running a development build of Muban.\n` +
  //     `Make sure to use the production build when deploying for production.`,
  // );
}
