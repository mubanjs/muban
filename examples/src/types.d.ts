/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
declare module 'tng-hooks' {
  export const useState: any;
  export const TNG: (...args: Array<any>) => any;
}

declare namespace JSX {
  interface ElementAttributesProperty {
    props: {};
  }

  interface ElementChildrenAttribute {
    children: {};
  }
}
