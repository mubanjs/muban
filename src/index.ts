export { defineComponent } from './lib/Component.Reactive';
export { mount } from './lib/utils/mount';
export { bind, bindMap, bindTemplate } from './lib/utils/bindings/bindingDefinitions';
export {
  refElement,
  refCollection,
  refComponent,
  refComponents,
} from './lib/utils/refs/refDefinitions';
export { propType } from './lib/utils/props/propDefinitions';
export { provide, inject, createContext } from './lib/utils/inject';
export { html, unsafeHTML, jsonScriptTemplate } from './lib/utils/template/mhtml';
export { classMap } from './lib/utils/template/classMap';

// re-export types of those libs, so they don't have to be installed separately
export * from '@vue/reactivity';
export {
  watch,
  watchEffect, // WatchCallback, // WatchEffect, // WatchOptions, // WatchSource, // WatchStopHandle,
} from '@vue/runtime-core';
