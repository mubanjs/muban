/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentFactory, ComponentTemplate } from '../Component.types';
import { html, jsonScriptTemplate } from './mhtml';

type TemplateComponentFactoryOptions<P extends Record<string, unknown>> = {
  tag?: string;
  component?: string | ComponentFactory<any>;
  tagAttributes?: Record<string, unknown>;
  children: (props: P) => string;
  // TODO: allow array of to-be-rendered props as shortcut
  jsonProps?: (props: P) => Record<string, any>;
};

export function templateComponentFactory<P extends Record<string, unknown>>({
  tag,
  component,
  tagAttributes,
  children,
  jsonProps,
}: TemplateComponentFactoryOptions<any>): ComponentTemplate {
  return (props, ref) => {
    return renderComponentWrapper({
      tag,
      ref,
      component,
      tagAttributes,
      children: children(props),
      jsonProps: jsonProps?.(props),
    });
  };
}

type RenderComponentWrapperOptions = {
  tag?: string;
  ref?: string;
  component?: string | ComponentFactory<any>;
  tagAttributes?: Record<string, unknown>;
  children: string;
  // TODO: allow array of to-be-rendered props as shortcut
  jsonProps?: Record<string, any>;
};

export function renderComponentWrapper({
  tag = 'div',
  component,
  ref,
  children,
  tagAttributes,
  jsonProps,
}: RenderComponentWrapperOptions) {
  const componentAttributes = {
    ...tagAttributes,
    'data-component':
      typeof component === 'string' || typeof component === 'undefined'
        ? component
        : component.displayName,
  };
  return html`<${tag} data-ref=${ref} ...${componentAttributes}>
      ${jsonProps ? jsonScriptTemplate(jsonProps) : ''}
      ${children}
    </${tag}>`;
}
