/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Predicate, Primitive, Static } from 'isntnt';

export type PropTypeDefinition<T = any> = {
  type:
    | typeof Number
    | typeof String
    | typeof Boolean
    | typeof Date
    | typeof Array
    | typeof Object
    | typeof Function;
  default?: T extends Primitive ? T : () => T;
  validator?: Predicate<T>;
  isOptional?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  shapeType?: Function;
};

type OptionalPropertyKeys<T> = {
  [P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];
type RequiredPropertyKeys<T> = {
  [P in keyof T]: undefined extends T[P] ? never : P;
}[keyof T];
type Keys<T> = keyof T;

// maps String to string, but keeps Date as Date
// primitives go back to normal, other stuff keep their instance type
export type ConstructorType<T extends PropTypeDefinition['type']> = InstanceType<
  T
> extends InstanceType<typeof String | typeof Boolean | typeof Number>
  ? ReturnType<T>
  : InstanceType<T>;

// if a validator is available, use the type from that predicate
// otherwise, use the instanceType from passed `type` (e.g. Number or String)
// type ExtractType<T extends PropTypeDefinition> = 'validator' extends RequiredPropertyKeys<T>
//   ? Static<Exclude<T['validator'], undefined>>
//   : ReturnType<T['type']>;
export type ExtractType<T extends PropTypeDefinition> = 'shapeType' extends Keys<T>
  ? T['shapeType']
  : 'validator' extends Keys<T>
  ? Static<Exclude<T['validator'], undefined>>
  : ConstructorType<T['type']>;

// if required is not undefined, then it's set to false, so the type should become optional
type ExtractOptionalType<
  T extends PropTypeDefinition,
  V extends any
> = 'isOptional' extends RequiredPropertyKeys<T> ? V | undefined : V;

export type TypedProp<T extends PropTypeDefinition> = ExtractOptionalType<T, ExtractType<T>>;

export type TypedProps<T extends Record<string, PropTypeDefinition>> = {
  [P in keyof T]: TypedProp<T[P]>;
};
