/* eslint-disable @typescript-eslint/no-explicit-any */
import htm from 'htm';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vhtml from 'vhtml';

/**
 * Proxy function between html and vhtml to modify the DOM structure
 */
function h(type: any, props: Record<string, any>, ...children: Array<any>) {
  // TODO: add logic for props to mutate them based on possible functions

  // console.log(`[${type}]`, props, children);
  return vhtml(type, props, children);
}

// the template tag to render HTML strings in muban templats
export const html = htm.bind(h);

/**
 * Helper function to render unsafe HTML in the DOM
 * @param data
 */
export function unsafeHTML(data: string): string {
  // fake calling the tagged template string function as if it was coming from
  // an actual usage of a template string to allow parsing HTML tags into
  // a "parsed" array of children without losing HTML formatting
  const item = [data] as Array<string> & { raw: Array<string> };
  item['raw'] = [data];

  return html(item as TemplateStringsArray);
}

/**
 * Helper function to correctly parse the response of template functions and
 * pass them through unsafeHTML to be rendered inside other templates
 * @param templateResult
 * @returns string
 * @example
 * return html`<div>${renderChildTemplate(buttonTemplate({ label: 'foo' }))}</div>`;
 */
export function renderChildTemplate(templateResult: string | Array<string>): string {
  return unsafeHTML(Array.isArray(templateResult) ? templateResult.join('') : templateResult);
}

/**
 * Helper function to render JSON script tags with a JS data structure
 * Useful to render properties for components that contain a bit more data
 * than is practical for using data-attributes
 *
 * TODO: add this as part of the future helper function to render component containers
 *
 * @param content
 */
export function jsonScriptTemplate(content: Array<any> | Record<string, any>): string {
  return html`<script
    type="application/json"
    dangerouslySetInnerHTML=${{
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __html: JSON.stringify(content),
    }}
  ></script>`;
}

// TODO: add helper function to render component wrapper function (componentFactory)
