type TypedObjectKeys = <T extends { [key: string]: any }>(
  obj: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string ? K : never;
    }[keyof T],
    string
  >
>;

export const typedObjectKeys: TypedObjectKeys = Object.keys;
