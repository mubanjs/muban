/* eslint-disable @typescript-eslint/no-explicit-any */
type ValueOf<T> = T[keyof T];

export type TemplateMap<T> = ValueOf<
  {
    [P in keyof T]: {
      name: P;
      props: T[P] extends (...args: any) => any ? Parameters<T[P]>[0] : never;
    };
  }
>;

export type ComponentTemplateResult = string | Array<string>;

export type ComponentTemplate<P extends Record<string, unknown> = any> = (
  props: P,
  ref?: string,
) => ComponentTemplateResult;
