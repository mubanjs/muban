/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
import type { Binding, BindProps } from './bindingDefinitions';

/**
 * This file contains all structures and types that are needed to support JSX Bindings
 *
 * The following items are directly used by TypeScript, and are configured in tsconfig.json
 * - createElement
 * - Fragment
 */

/**
 * Support for JSX elements - <foo />
 *
 * This will execute the component function that will return a binding definition
 *
 * @param element
 * @param props
 * @param children
 */
export const createElement = (
  element: (props: any) => any,
  props: Record<string, any>,
  ...children: Array<any>
): Binding => {
  // console.log('createElement', element, props, children);
  return element({ ...props, children: children as any });
};

/**
 * Simple support for JSX fragments - <></>
 * @param children
 * @constructor
 */
export const Fragment = ({ children }: { children: Array<any> }): Array<BindProps<any>> => {
  // console.log('createFragment', children);
  return children;
};
