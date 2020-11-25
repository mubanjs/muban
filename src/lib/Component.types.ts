/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import type EventEmitter from 'eventemitter3';
import type { Binding } from './utils/bindings/bindingDefinitions';
import type { PropTypeDefinition, TypedProps } from './utils/props/propDefinitions.types';
import type { ComponentRefItem, TypedRefs } from './utils/refs/refDefinitions.types';

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;

export type ComponentMeta = {
  component: ComponentFactory;
  template: ComponentTemplate;
};

// export type ComponentApi<T extends ComponentFactory<any>> = ReturnType<T>;
export type ComponentApi<T extends ComponentFactory = any> = IsAny<T> extends true
  ? ReturnType<ComponentFactory>
  : ReturnType<T>;

export type ComponentFactory<
  P extends Record<string, PropTypeDefinition> = any
> = ComponentReturnValue<TypedProps<P>> & ComponentDisplayName;

export type InternalComponentInstance = {
  parent: InternalComponentInstance | null;
  element: HTMLElement;
  props: Record<string, unknown>;
  reactiveProps: Record<string, unknown>;
  refs: TypedRefs<Record<string, ComponentRefItem>>;
  provides: Record<string, unknown>;
  children: Array<ComponentApi>;
  isSetup: boolean;
  isMounted: boolean;
  isUnmounted: boolean;
  removeBindingsList?: Array<(() => void) | undefined>;
  options: DefineComponentOptions<any, any>;
  ee: EventEmitter;
  on: (type: string, fn: () => void) => void;
  mount: () => void;
  unmount: () => void;
};

type ComponentCreateOptions = Partial<{
  parent?: InternalComponentInstance;
}>;

export type ComponentDisplayName = { displayName: string };
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
};

export type DefineComponentOptions<
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>
> = {
  name: string;
  components?: Array<ComponentFactory | (() => Promise<ComponentFactory>)>;
  props?: P;
  refs?: R;
  setup: (context: {
    props: TypedProps<P>;
    refs: TypedRefs<R>;
    element: HTMLElement;
  }) => undefined | null | Array<Binding>;
};

export type ComponentTemplate<P extends Record<string, unknown> = any> = (
  props: P,
  ref?: string,
) => string | Array<string>;

export type LazyComponent<P extends Record<string, PropTypeDefinition> = any> = () => Promise<
  ComponentFactory<P>
>;
