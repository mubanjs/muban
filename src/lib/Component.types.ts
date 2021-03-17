/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types,@typescript-eslint/no-use-before-define */
import type { App, AppContext } from './api/apiCreateApp';
import type { Binding } from './bindings/bindings.types';
import { LifecycleHooks } from './api/apiLifecycle';
import type { PropTypeDefinition, TypedProps } from './props/propDefinitions.types';
import type { ComponentRefItem, TypedRefs } from './refs/refDefinitions.types';

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;

export type ComponentFactory<
  P extends Record<string, PropTypeDefinition> = any,
  N extends string = any
> = ComponentReturnValue<TypedProps<P>> & ComponentDisplayName<N>;

// export type ComponentApi<T extends ComponentFactory<any>> = ReturnType<T>;
export type ComponentApi<T extends ComponentFactory = any> = IsAny<T> extends true
  ? ReturnType<ComponentFactory>
  : ReturnType<T>;

export type InternalNodeInstance = {
  uid: number;
  type: 'component' | 'ref';
  name: string;
  parent: InternalComponentInstance | null;
  appContext: AppContext;
  element: HTMLElement;
  binding?: Binding;
};

type LifecycleHook = Array<Function> | null;

export type InternalComponentInstance = InternalNodeInstance & {
  api: ComponentApi | null;
  subTree: Array<InternalNodeInstance>;
  props: Record<string, unknown>;
  reactiveProps: Record<string, unknown>;
  refs: TypedRefs<Record<string, ComponentRefItem>>;
  provides: Record<string, unknown>;
  children: Array<ComponentApi>;
  bindings: Array<Binding>;
  refChildren: Array<InternalNodeInstance>;
  removeBindingsList?: Array<(() => void) | undefined>;
  options: DefineComponentOptions<
    Record<string, PropTypeDefinition>,
    Record<string, ComponentRefItem>,
    string
  >;

  // lifecycle
  isSetup: boolean;
  isMounted: boolean;
  isUnmounted: boolean;

  [LifecycleHooks.Mounted]: LifecycleHook;
  [LifecycleHooks.Unmounted]: LifecycleHook;

  mount: () => void;
  unmount: () => void;
};

export type ComponentCreateOptions = Partial<{
  parent: InternalComponentInstance;
  app: App;
}>;

export type ComponentDisplayName<T extends string> = { displayName: T };
export type ComponentReturnValue<P extends Record<string, any> = Record<string, any>> = (
  element: HTMLElement,
  options?: ComponentCreateOptions,
) => {
  readonly name: string;
  setProps: (props: P) => void;
  readonly props: P;
  readonly element: HTMLElement;
  setup: () => void;
  dispose: () => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __instance: InternalComponentInstance;
};

export type DefineComponentOptions<
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>,
  N extends string
> = {
  name: N;
  components?: Array<ComponentFactory | LazyComponent>;
  props?: P;
  refs?: R;
  setup?: (context: {
    props: TypedProps<P>;
    refs: TypedRefs<R>;
    element: HTMLElement;
  }) => undefined | null | Array<Binding>;
};

export type ComponentTemplateResult = string | Array<string>;

export type ComponentTemplate<P extends Record<string, unknown> = any> = (
  props: P,
  ref?: string,
) => ComponentTemplateResult;

export type LazyComponent<
  N extends string = any,
  P extends Record<string, PropTypeDefinition> = any
> = (() => Promise<ComponentFactory<P>>) & ComponentDisplayName<N> & { isLazy: true };
