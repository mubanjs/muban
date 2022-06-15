/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Predicate, Primitive, Static } from 'isntnt';
import type { IfAny } from '../Component.types';
import type { RefElementType } from '../refs/refDefinitions.types';

export type SourceOption =
  | SourceOptionCss
  | SourceOptionHtmlText
  | SourceOptionCustom
  | {
      type?: 'data' | 'json' | 'attr' | 'custom';
      target?: string;
      name?: string;
    };

export type SourceOptions = SourceOption | Array<SourceOption>;

export type SourceOptionHtmlText = {
  type: 'text' | 'html';
  target?: string;
};

export type SourceOptionCss = {
  type: 'css';
  target?: string;
  name?: string;
  options?: {
    cssPredicate?: Predicate<string>;
  };
};

export type SourceOptionCustom = {
  type: 'custom';
  target?: string;
  options?: {
    customSource?: (element?: RefElementType | Array<RefElementType> | undefined) => any;
  };
};

export type PropTypeDefinition<T = any> = {
  type:
    | typeof Number
    | typeof String
    | typeof Boolean
    | typeof Date
    | typeof Array
    | typeof Object
    | typeof Function;
  default?: T extends Primitive ? T : IfAny<T, any, () => T>;
  validator?: Predicate<T>;
  isOptional?: boolean;
  missingValue?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  shapeType?: Function;
  sourceOptions?: SourceOptions;
};

export type PropTypeInfo<T = any> = Pick<
  PropTypeDefinition<T>,
  'type' | 'default' | 'validator' | 'isOptional'
> & {
  name: string;
  source: {
    name: string;
    target: RefElementType | undefined;
  } & Pick<SourceOption, 'type'> &
    Pick<SourceOptionCustom, 'options'> &
    Pick<SourceOptionCss, 'options'>;
};

// type OptionalPropertyKeys<T> = {
//   [P in keyof T]: undefined extends T[P] ? P : never;
// }[keyof T];

// get all keys from an object that are not optional (either ? or |undefined)
type RequiredPropertyKeys<T> = {
  [P in keyof T]: undefined extends T[P] ? never : P;
}[keyof T];

type Keys<T> = keyof T;

// maps String to string, but keeps Date as Date
// primitives go back to normal, other stuff keep their instance type
export type ConstructorType<T extends PropTypeDefinition['type']> =
  InstanceType<T> extends InstanceType<typeof String | typeof Boolean | typeof Number>
    ? ReturnType<T>
    : InstanceType<T>;

type IsAnyPropTypeDefinition<T extends PropTypeDefinition> = 'default' extends Keys<T>
  ? IfAny<T['default'], never, 0>
  : 0;

// if a validator is available, use the type from that predicate
// otherwise, use the instanceType from passed `type` (e.g. Number or String)
// type ExtractType<T extends PropTypeDefinition> = 'validator' extends RequiredPropertyKeys<T>
//   ? Static<Exclude<T['validator'], undefined>>
//   : ReturnType<T['type']>;
export type ExtractType<T extends PropTypeDefinition> = IsAnyPropTypeDefinition<T> extends never
  ? any
  : 'shapeType' extends Keys<T>
  ? T['shapeType']
  : 'validator' extends Keys<T>
  ? Static<Exclude<T['validator'], undefined>>
  : ConstructorType<T['type']>;

// if required is not undefined, then it's set to false, so the type should become optional
type ExtractOptionalType<
  T extends PropTypeDefinition,
  V,
> = 'missingValue' extends RequiredPropertyKeys<T> ? V | undefined : V;

export type TypedProp<T extends PropTypeDefinition> = ExtractOptionalType<T, ExtractType<T>>;

export type TypedProps<T extends Record<string, PropTypeDefinition>> = {
  [P in keyof T]: TypedProp<T[P]>;
};
