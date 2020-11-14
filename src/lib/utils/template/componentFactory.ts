/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, TemplateResult } from 'lit-html';
import { spread } from '@open-wc/lit-helpers';
import { ifDefined } from 'lit-html/directives/if-defined';
import type { ComponentFactory } from '../../Component.types';

export function componentFactory<P extends Record<string, unknown>>(
  tag: string,
  component: string | ComponentFactory<any>,
  tagAttributes: Record<string, unknown>,
): (children: (props: P) => string | TemplateResult) => (props: P, ref?: string) => void {
  return (children) => (props, ref) => {
    const componentAttributes = {
      ...tagAttributes,
      'data-component': typeof component === 'string' ? component : component.displayName,
    };
    const childrenResult = children(props);
    switch (tag) {
      case 'button':
        return html`<button data-ref=${ifDefined(ref)} ...=${spread(componentAttributes)}>
          ${childrenResult}
        </button>`;
      default:
        return html`<div data-ref=${ifDefined(ref)} ...=${spread(componentAttributes)}>
          ${childrenResult}
        </div>`;
    }
  };
}
