type TypedObjectValues = <T extends { [key: string]: any }>(
  obj: T,
) => Array<
  {
    [K in keyof T]: K extends string ? T[K] : never;
  }[keyof T]
>;

export const typedObjectValues: TypedObjectValues = Object.values;
