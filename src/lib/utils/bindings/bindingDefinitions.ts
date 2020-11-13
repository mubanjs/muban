/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import type { TemplateResult } from 'lit-html';
import type { ComponentFactory } from '../../Component.types';
import type { ComponentSetPropsParam, ElementRef } from '../refs/refDefinitions.types';

export const BindElement = <T extends HTMLElement>(
  props: BindProps<T>,
): { type: 'element'; props: BindProps<T> } => {
  return {
    type: 'element',
    props: props,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BindCollection = <T extends HTMLElement>(
  props: BindProps<Array<T>>,
): { type: 'collection'; props: BindProps<Array<T>> } => {
  return {
    type: 'collection',
    props: props,
  };
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponent<T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps'>>(
  props: { ref: Ref<T | undefined> } & ComponentSetPropsParam<T>,
): { type: 'component'; props: { ref: Ref<T | undefined> } & ComponentSetPropsParam<T> } {
  return {
    type: 'component',
    props: props,
  };
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponents<T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps'>>(
  props: { ref: Ref<Array<T>> } & ComponentSetPropsParam<T>,
): { type: 'components'; props: { ref: Ref<Array<T>> } & ComponentSetPropsParam<T> } {
  return {
    type: 'components',
    props: props,
  };
}
type TemplateProps<T extends HTMLElement> = {
  ref: ElementRef<T> | undefined;
  extract?: {
    config: any;
    onData: (data: any) => void;
  };
  data: any;
  template: (props: any) => TemplateResult | Array<TemplateResult>;
};
export function BindTemplate<T extends HTMLElement>(
  props: TemplateProps<T>,
): { type: 'template'; props: TemplateProps<T> } {
  return {
    type: 'template',
    props: props,
  };
}

export function Template<T extends HTMLElement>(props: TemplateProps<T>): any {
  return BindTemplate(props);
}

export type Binding =
  | ReturnType<typeof BindElement>
  | ReturnType<typeof BindCollection>
  | ReturnType<typeof BindComponent>
  | ReturnType<typeof BindComponents>
  | ReturnType<typeof BindTemplate>;

export type BindingValue<T> = Ref<T>;

export type BindProps<T> = {
  ref: Ref<T | undefined>;
  text?: BindingValue<string>;
  html?: BindingValue<string>;
  click?: (event: HTMLElementEventMap['click']) => void;
  checked?: Ref<boolean | Array<string>>;
  style?: BindingValue<Record<string, string>>;
  classes?: BindingValue<Record<string, boolean>>;
};
