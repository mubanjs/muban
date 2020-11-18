/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import type { Binding } from './utils/bindings/bindingDefinitions';
import type { PropTypeDefinition, TypedProps } from './utils/props/propDefinitions.types';
import type { ComponentRefItem, TypedRefs } from './utils/refs/refDefinitions.types';

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;

// export type ComponentApi<T extends ComponentFactory<any>> = ReturnType<T>;
export type ComponentApi<T extends ComponentFactory<any>> = IsAny<T> extends true
  ? ReturnType<ComponentFactory<any>>
  : ReturnType<T>;

export type ComponentFactory<P extends Record<string, PropTypeDefinition>> = ComponentReturnValue<
  TypedProps<P>
> &
  ComponentDisplayName;

export type ComponentDisplayName = { displayName: string };
export type ComponentReturnValue<P extends Record<string, any> = Record<string, any>> = (
  element: HTMLElement,
) => {
  readonly name: string;
  setProps: (props: P) => void;
  readonly props: P;
  readonly element: HTMLElement;
  dispose: () => void;
};

export type DefineComponentOptions<
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>
> = {
  name: string;
  components?: Array<ComponentFactory<any>>;
  props?: P;
  refs?: R;
  setup: (
    props: TypedProps<P>,
    refs: TypedRefs<R>,
    context: { element: HTMLElement },
  ) => undefined | null | Array<Binding>;
};
