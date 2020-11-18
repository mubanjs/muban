type TypedObjectEntries = <T extends { [key: string]: any }>(
  obj: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string ? [K, T[K]] : never;
    }[keyof T],
    [string, any]
  >
>;

const typedObjectEntries: TypedObjectEntries = Object.entries;

export default typedObjectEntries;
