/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from '@vue/reactivity';
import type { ElementRef } from '../refs/refDefinitions.types';
import type {
  BindCollection,
  BindComponent,
  BindComponents,
  BindElement,
  BindTemplate,
} from './bindingDefinitions';
import type { bindingsList } from './bindings';

export type TemplateProps<T extends HTMLElement> = {
  ref: ElementRef<T | undefined, BindProps> | undefined;
  extract?: {
    config: any;
    onData: (data: any) => void;
  };
  renderImmediate?: boolean;
  data: any;
  template: (props: any) => string | Array<string>;
};

export type Binding =
  | ReturnType<typeof BindElement>
  | ReturnType<typeof BindCollection>
  | ReturnType<typeof BindComponent>
  | ReturnType<typeof BindComponents>
  | ReturnType<typeof BindTemplate>;

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
