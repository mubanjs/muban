/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vhtml';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
