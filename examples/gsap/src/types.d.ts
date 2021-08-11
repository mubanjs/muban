/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vhtml';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'dom-focus-lock' {
  export function on(element: HTMLElement): void;
  export function off(element: HTMLElement): void;
}
