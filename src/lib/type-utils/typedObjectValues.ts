// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TypedObjectValues = <T extends { [key: string]: any }>(
  obj: T,
) => Array<
  {
    [K in keyof T]: K extends string ? T[K] : never;
  }[keyof T]
>;

const typedObjectValues: TypedObjectValues = Object.values;

export default typedObjectValues;
