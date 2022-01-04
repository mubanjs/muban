/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from '@vue/reactivity';
import type { ComponentFactory, InternalComponentInstance } from '../Component.types';
import type {
  CollectionBinding,
  ElementBinding,
  ComponentBinding,
  ComponentCollectionBinding,
} from '../bindings/bindingDefinitions';
import type { BindProps } from '../bindings/bindings.types';

export type RefOptions<T extends Record<string, any>> = T & {
  ignoreGuard?: boolean;
};

export type RefElementType = HTMLElement | SVGElement;

/*
 * This is the raw "definition" for refs, represented as a simple object.
 * Any helper functions must return this object
 */
export type ComponentRefItemElement<T extends RefElementType = HTMLElement> = {
  type: 'element';
  ref: string;
  queryRef: (parent: HTMLElement) => T | null;
  createRef: (instance: InternalComponentInstance) => ElementRef<T, BindProps>;
  isRequired?: boolean;
};
export type ComponentRefItemCollection<T extends RefElementType = HTMLElement> = {
  type: 'collection';
  ref: string;
  queryRef: (parent: HTMLElement) => Array<T>;
  createRef: (instance: InternalComponentInstance) => CollectionRef<T, BindProps>;
};
export type ComponentRefItemComponent<T extends ComponentFactory<Record<string, any>>> = {
  type: 'component';
  ref?: string;
  componentRef: string;
  queryRef: (parent: HTMLElement) => HTMLElement | null;
  createRef: (instance: InternalComponentInstance) => ComponentRef<T>;
  isRequired?: boolean;
};
export type ComponentRefItemComponentCollection<T extends ComponentFactory<Record<string, any>>> = {
  type: 'componentCollection';
  ref?: string;
  componentRef: string;
  queryRef: (parent: HTMLElement) => Array<HTMLElement>;
  createRef: (instance: InternalComponentInstance) => ComponentsRef<T>;
};

export type ComponentRefItemShortcuts =
  | string
  | ComponentRefItemElement<RefElementType>['queryRef'];
export type ResolvedComponentRefItem =
  | ComponentRefItemElement<RefElementType>
  | ComponentRefItemCollection<RefElementType>
  | ComponentRefItemComponent<ComponentFactory<any>>
  | ComponentRefItemComponentCollection<ComponentFactory<any>>;

// combination of all of the above
export type ComponentRefItem =
  // value shortcuts
  | ComponentRefItemShortcuts
  // object definitions
  | ResolvedComponentRefItem;

/**
 * These are the types that are returned from the refDefinition selector function,
 * and passed to the component's setup function, and is used for:
 * - applying bindings
 * - get access to the elements/components related to the ref
 */
export type ElementRef<T extends RefElementType = HTMLElement, P extends BindProps = BindProps> = {
  type: 'element';
  getBindingDefinition: (props: P) => ElementBinding<T, P>;
  element: T | undefined;
  refreshRefs: () => void;
};

export type CollectionRef<
  T extends RefElementType = HTMLElement,
  P extends BindProps = BindProps
> = {
  type: 'collection';
  getBindingDefinition: (props: BindProps) => CollectionBinding<T, P>;
  getElements: () => Array<T>;
  // nested refs for each single individual element
  getRefs: () => Array<Omit<ElementRef<T, P>, 'refreshRefs'>>;
  refreshRefs: () => void;
};

export type ComponentRef<T extends ComponentFactory<any>> = {
  type: 'component';
  getBindingDefinition: (props: ComponentParams<ReturnType<T>>) => ComponentBinding<ReturnType<T>>;
  component: ReturnType<T> | undefined;
  refreshRefs: () => void;
};

export type ComponentsRef<T extends ComponentFactory<any>> = {
  type: 'componentCollection';
  getBindingDefinition: (
    props: ComponentParams<ReturnType<T>>,
  ) => ComponentCollectionBinding<ReturnType<T>>;
  getComponents: () => Array<ReturnType<T>>;
  // nested refs for each single individual component
  getRefs: () => Array<Omit<ComponentRef<T>, 'refreshRefs'>>;
  refreshRefs: () => void;
};

export type AnyRef =
  | ElementRef
  | CollectionRef
  | ComponentRef<ComponentFactory<any>>
  | ComponentsRef<ComponentFactory<any>>;

// Turn the keys of an object into the types, or a Ref around that type
export type RefOrValue<T extends Record<string, any>> = {
  [P in keyof T]: T[P] | Ref<T[P]>;
};

export type ComponentParams<T> = ComponentSetPropsParam<T> &
  Pick<BindProps, 'css' | 'style' | 'attr' | 'event'>;

/**
 * Extracts the props from a component if it is one
 * Otherwise just return the type itself.
 *
 * Partial is added because bindings are only meant to CHANGE things, not to SET things,
 * so all props that are REQUIRED are set by the TEMPLATE already
 */
export type ComponentSetPropsParam<T> = T extends { setProps(props: infer R): void }
  ? Partial<RefOrValue<R>>
  : Partial<RefOrValue<Record<string, any>>>;

/**
 *  Extract the type of ref it is based on the return type of the selector function from the definition
 *  Fall back to just a normal Element ref if a string is passed
 */
export type TypedRef<T extends ComponentRefItem> = T extends {
  createRef: (instance: InternalComponentInstance) => infer R;
}
  ? Exclude<R, undefined>
  : ElementRef;

/**
 * Extract typings out of the refDefinition input,
 * so they can be used to type the refs passed in the setup function
 *
 * Attaches the 'self' ref to it, since it's always present
 */
export type TypedRefs<T extends Record<string, ComponentRefItem>> = {
  [P in keyof T]: TypedRef<T[P]>;
} & { self: ElementRef };
