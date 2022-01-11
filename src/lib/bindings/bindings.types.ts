/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentTemplateResult } from '@muban/template';
import type { Ref } from '@vue/reactivity';
import type { RefElementType, ElementRef } from '../refs/refDefinitions.types';
import type {
  BindMapBinding,
  CollectionBinding,
  ComponentBinding,
  ComponentCollectionBinding,
  ElementBinding,
  SimpleComponentApi,
  TemplateBinding,
} from './bindingDefinitions';
import type { bindingsList } from './bindings';

export type TemplateProps<T extends RefElementType> = {
  ref: ElementRef<T, BindProps> | undefined;
  extract?: {
    config: any;
    onData: (data: any) => void;
  };
  forceImmediateRender?: boolean;
  onUpdate: (onlyWatch: boolean) => ComponentTemplateResult | undefined;
};

export type Binding =
  | ElementBinding<RefElementType, BindProps>
  | CollectionBinding<RefElementType, BindProps>
  | ComponentBinding<SimpleComponentApi>
  | ComponentCollectionBinding<SimpleComponentApi>
  | TemplateBinding<RefElementType>
  | BindMapBinding;

export type BindingValue<T> = Ref<T>;
export type BindingMap<T> = Ref<Record<string, T>> | Record<string, Ref<T>>;

declare global {
  // The user can extend this interface with new DOM bindings, which are picked up in the `bind` methods
  // eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars
  interface DomBindings {}
}

// extract the binding properties from the built-in and user provided binding functions
type BindingsList = typeof bindingsList & DomBindings;
export type BindProps = {
  [P in keyof BindingsList]?: Parameters<BindingsList[P]>[1];
};

export type BindingsHelpers = {
  hasBinding: <T extends keyof BindProps>(bindingName: T) => boolean;
  getBinding: <T extends keyof BindProps>(bindingName: T) => BindProps[T];
  setBinding: <T extends keyof BindProps>(bindingName: T, bindingValue: BindProps[T]) => void;
};

export type DataBinding<T> = (element: HTMLSelectElement, value: T | Ref<T>) => void;
