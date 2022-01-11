/* eslint-disable @typescript-eslint/no-explicit-any */
type TypedObjectKeys = <T extends { [key: string]: any }>(
  object: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string ? K : never;
    }[keyof T],
    string
  >
>;

const typedObjectKeys: TypedObjectKeys = Object.keys;

export default typedObjectKeys;
