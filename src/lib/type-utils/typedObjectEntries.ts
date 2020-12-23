// eslint-disable-next-line @typescript-eslint/ban-types
export type TypedObjectEntries = <T extends object>(
  o: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string | number | symbol ? [K, T[K]] : never;
    }[keyof T],
    [string | number | symbol, unknown]
  >
>;

const typedObjectEntries: TypedObjectEntries = Object.entries;

export default typedObjectEntries;
