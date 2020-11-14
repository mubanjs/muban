/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */

import type { Ref } from '@vue/reactivity';
import type { TemplateResult } from 'lit-html';
import type { ComponentFactory } from '../../Component.types';
import type { CollectionRef, ComponentsRef } from '../refs/refDefinitions.types';
import type { AnyRef, ComponentSetPropsParam, ElementRef } from '../refs/refDefinitions.types';

export function BindElement<T extends HTMLElement>(ref: Ref<T | undefined>, props: BindProps) {
  return {
    ref,
    type: 'element' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindCollection<T extends HTMLElement>(ref: Ref<Array<T>>, props: BindProps) {
  return {
    ref,
    type: 'collection' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponent<T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps'>>(
  ref: Ref<T | undefined>,
  props: ComponentSetPropsParam<T>,
) {
  return {
    ref,
    type: 'component' as const,
    props: props,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function BindComponents<T extends Pick<ReturnType<ComponentFactory<any>>, 'setProps'>>(
  ref: Ref<Array<T>>,
  props: ComponentSetPropsParam<T>,
) {
  return {
    ref,
    type: 'componentCollection' as const,
    props: props,
  };
}

type TemplateProps<T extends HTMLElement> = {
  ref: ElementRef<T, BindProps> | undefined;
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

export type Binding =
  | ReturnType<typeof BindElement>
  | ReturnType<typeof BindCollection>
  | ReturnType<typeof BindComponent>
  | ReturnType<typeof BindComponents>
  | ReturnType<typeof BindTemplate>;

export type BindingValue<T> = Ref<T>;

export type BindProps = {
  text?: BindingValue<string>;
  html?: BindingValue<string>;
  click?: (event: HTMLElementEventMap['click']) => void;
  checked?: Ref<boolean | Array<string>>;
  style?: BindingValue<Record<string, string>>;
  css?: BindingValue<Record<string, boolean>>;
};

export function bind<T extends Pick<AnyRef, 'getBindingDefinition'>>(
  target: T,
  props: Parameters<T['getBindingDefinition']>[0],
) {
  return target.getBindingDefinition(props);
}

export function bindMap<
  T extends Pick<
    CollectionRef<HTMLElement, BindProps> | ComponentsRef<ComponentFactory<any>>,
    'refs' | 'getBindingDefinition'
  >
>(
  target: T,
  getProps: (ref: T['refs'][number], index: number) => Parameters<T['getBindingDefinition']>[0],
): Array<Binding> {
  return (target.refs as Array<T['refs'][number]>).map((ref, index) =>
    bind(ref, getProps(ref, index)),
  );
}

export function bindTemplate<P extends Record<string, unknown>>(
  target: ElementRef<HTMLElement, BindProps>,
  data: Ref<P>,
  template: (props: P) => TemplateResult | Array<TemplateResult>,
  extract?: {
    config: any;
    onData: (data: any) => void;
  },
): {
  type: 'template';
  props: TemplateProps<HTMLElement>;
} {
  return BindTemplate({ ref: target, data, template, extract });
}
