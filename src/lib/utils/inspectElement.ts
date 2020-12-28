/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
import { unref } from '@vue/reactivity';
import { mapValues } from 'lodash-es';
import type { ComponentApi } from '../Component.types';
import typedObjectKeys from '../type-utils/typedObjectKeys';
import type { Binding, BindProps } from '../bindings/bindings.types';
import { findParentComponent } from './domUtils';
import { getComponentForElement, getParents } from './global';
import { isRefItemShortcut } from '../refs/createComponentRefs';
import type { AnyRef, ComponentRefItem } from '../refs/refDefinitions.types';
import { recursiveUnref } from './utils';

type ComponentInspectResult = {
  uid: number;
  type: 'component';
  name: string; // data-component / displayName
  element: HTMLElement;
  children: Array<ComponentInspectResult | RefInspectResult>;
  props: Record<
    string,
    {
      name: string;
      required: boolean;
      type: string;
      value: any;
      initialValue: any;
      default: any;
    }
  >;
  refs: Record<
    string,
    {
      name: string;
      query: string;
      required: boolean;
      type: string;
      value: HTMLElement | Array<HTMLElement> | ComponentApi | Array<ComponentApi>;
      // TODO: show what bindings are provided to each ref/component?
    }
  >;
  bindings: BindProps;
  context: Record<string, any>;
  parents: Array<ComponentInspectResult>;
};

type RefInspectResult = {
  uid: string;
  type: 'ref';
  name: string; // data-ref
  element: HTMLElement;
  owner: ComponentInspectResult;
  bindings: BindProps;
};

const INSPECT_CACHE = new Map<HTMLElement, ComponentInspectResult | RefInspectResult>();

function getRefQuery(ref: ComponentRefItem) {
  if (!isRefItemShortcut(ref)) {
    if (ref.type === 'element' || ref.type === 'collection') {
      // data-ref
      return ref.ref;
    }

    return `${ref.ref ? `${ref.ref} ` : ''}[${ref.componentRef}]`;
  }

  // string shortcut
  if (typeof ref === 'string') {
    return ref;
  }

  // function shortcut
  return '[custom query]';
}

function getRefValue(ref: AnyRef) {
  switch (ref.type) {
    case 'element':
      return ref.element;
    case 'collection':
      return ref.elements;
    case 'component':
      return ref.component;
    case 'componentCollection':
      return ref.components;
  }
}

function getBindingsForElement(parentComponent: ComponentApi, element: HTMLElement): BindProps {
  return Object.assign(
    {},
    ...(parentComponent.__instance.bindings
      ?.filter((binding) => {
        switch (binding.type) {
          case 'element':
            return binding.ref.value === element;
          case 'collection':
            return binding.ref.value.includes(element);
          case 'component':
            return binding.ref.value?.element === element;
          case 'componentCollection':
            return binding.ref.value.some((component) => component.element === element);
        }
      })
      .map((binding) => recursiveUnref(binding.props)) ?? []),
  );
}

export function getElementForBinding(binding: Binding): HTMLElement | undefined {
  switch (binding.type) {
    case 'element':
      return binding.ref.value;
    case 'collection':
      return binding.ref.value[0];
    case 'component':
      return binding.ref.value?.element;
    case 'componentCollection':
      return binding.ref.value[0].element;
  }
}

function inspectComponent(component: ComponentApi): ComponentInspectResult {
  if (INSPECT_CACHE.has(component.element)) {
    return INSPECT_CACHE.get(component.element) as ComponentInspectResult;
  }
  // store reference for recursion
  const record = {} as ComponentInspectResult;
  INSPECT_CACHE.set(component.element, record);

  const info = {
    uid: component.__instance.uid,
    type: 'component',
    name: component.name,
    element: component.element,
    children: [
      ...component.__instance.children.map((child) => inspectComponent(child)),
      ...(component.__instance.bindings
        ?.map(getElementForBinding)
        .filter(
          (element): element is HTMLElement =>
            Boolean(element) &&
            element !== component.element &&
            component.__instance.children.every((child) => child.element !== element),
        )
        .map((element) => inspectRef(component, element)) || []),
    ],
    parents: getParents(component).map((child) => inspectComponent(child)),
    props: mapValues(component.__instance.options.props, (value, key) => ({
      name: key,
      required: !value.isOptional,
      type: value.type.name,
      value: component.__instance.reactiveProps[key],
      initialValue: component.__instance.props[key],
      default: value.default,
    })),
    refs: mapValues(component.__instance.options.refs, (value, key) => ({
      name: key,
      required: false,
      query: getRefQuery(value),
      type: component.__instance.refs[key].type,
      value: getRefValue(component.__instance.refs[key]),
    })),
    bindings: getBindingsForElement(component, component.element),
  } as ComponentInspectResult;
  typedObjectKeys(info).forEach((key) => {
    (record as any)[key] = info[key];
  });

  return record;
}

let refId = 0;

function inspectRef(parentComponent: ComponentApi, element: HTMLElement): RefInspectResult {
  if (INSPECT_CACHE.has(element)) {
    return INSPECT_CACHE.get(element) as RefInspectResult;
  }
  // store reference for recursion
  const record = {} as RefInspectResult;
  INSPECT_CACHE.set(element, record);

  const info = {
    uid: `${parentComponent.__instance.uid}-${refId++}`,
    type: 'ref',
    name: element.dataset.ref ?? '[unknown]',
    element,
    owner: inspectComponent(parentComponent),
    bindings: getBindingsForElement(parentComponent, element),
  } as RefInspectResult;
  typedObjectKeys(info).forEach((key) => {
    (record as any)[key] = info[key];
  });

  return record;
}

export function inspectElement(element: HTMLElement | undefined) {
  if (!element) {
    return undefined;
  }

  const component = getComponentForElement(element);
  if (component) {
    return inspectComponent(component);
  }

  const parentComponent = findParentComponent(element);
  if (parentComponent) {
    return inspectRef(parentComponent, element);
  }
}
