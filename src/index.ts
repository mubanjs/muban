import { initDev } from './lib/utils/devtools';

// top level APIs
export { createApp } from './lib/api/apiCreateApp';
export { defineComponent } from './lib/Component';

// usage within components
export { lazy, supportLazy } from './lib/api/apiLazy';
export { propType } from './lib/props/propDefinitions';
export { refElement, refCollection, refComponent, refComponents } from './lib/refs/refDefinitions';
export { provide, inject, createContext } from './lib/api/apiInject';
export { onMounted, onUnmounted } from './lib/api/apiLifecycle';
export { watch, watchEffect } from './lib/api/apiWatch';
export { bind, bindMap, bindTemplate } from './lib/bindings/bindingDefinitions';
export { registerDomBinding } from './lib/bindings/bindings';

// types that are often used (exposing too much internal stuff makes refactoring more difficult later)
export type {
  ComponentFactory,
  ComponentApi,
  LazyComponent,
  DefineComponentOptions,
  DefineComponentSetupContext,
} from './lib/Component.types';
export type { App } from './lib/api/apiCreateApp';
export type {
  TypedRefs,
  TypedRef,
  ElementRef,
  CollectionRef,
  ComponentRef,
  ComponentsRef,
  RefElementType,
  ComponentRefItem,
  ComponentRefItemElement,
  ComponentRefItemCollection,
  ComponentRefItemComponent,
  ComponentRefItemComponentCollection,
  RefOrValue,
  ComponentParams,
  ComponentSetPropsParam,
} from './lib/refs/refDefinitions.types';
export type { TypedProps, TypedProp, PropTypeDefinition } from './lib/props/propDefinitions.types';
export type { BindProps, Binding } from './lib/bindings/bindings.types';

// re-export types of those libs, so they don't have to be installed separately
export * from '@vue/reactivity';

// TODO: should we export types from runtime/core?
// export {
//   watch,
//   watchEffect, // WatchCallback, // WatchEffect, // WatchOptions, // WatchSource, // WatchStopHandle,
// } from '@vue/runtime-core';

// TODO: devtools
initDev();
