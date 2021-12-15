import { initDev } from './lib/utils/devtools';

// top level APIs
export { createApp } from './lib/api/apiCreateApp';
export { defineComponent } from './lib/Component';
export type { ComponentFactory, ComponentApi, LazyComponent } from './lib/Component.types';

// usage within components
export { lazy, supportLazy } from './lib/api/apiLazy';
export { propType } from './lib/props/propDefinitions';
export { refElement, refCollection, refComponent, refComponents } from './lib/refs/refDefinitions';
export { provide, inject, createContext } from './lib/api/apiInject';
export { onMounted, onUnmounted } from './lib/api/apiLifecycle';
export { watch, watchEffect } from './lib/api/apiWatch';
export { bind, bindMap, bindTemplate } from './lib/bindings/bindingDefinitions';

// re-export types of those libs, so they don't have to be installed separately
export * from '@vue/reactivity';

// TODO: should we export types from runtime/core?
// export {
//   watch,
//   watchEffect, // WatchCallback, // WatchEffect, // WatchOptions, // WatchSource, // WatchStopHandle,
// } from '@vue/runtime-core';

// TODO: devtools
initDev();
