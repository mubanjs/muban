/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Predicate, Primitive } from 'isntnt';
import type { ConstructorType, PropTypeDefinition, SourceOptions } from './propDefinitions.types';

type OptionalValue<T> = T & {
  isOptional: true;
  missingValue: true;
};
type Default<T, V> = T & {
  isOptional: true;
  default: V;
};
type Optional<T extends PropTypeDefinition> = T & {
  optional: Validate<OptionalValue<T>> & Source<OptionalValue<T>>;
  defaultValue: <U extends ConstructorType<T['type']> | undefined>(
    value: ConstructorType<T['type']> extends Primitive ? U : () => U,
  ) => Validate<Default<T, typeof value>> & Source<Default<T, typeof value>>;
};

type Validator<T, V extends Predicate<any>> = T & {
  validator: V;
};
type Validate<T extends PropTypeDefinition> = T & {
  validate: <U extends ConstructorType<T['type']> | undefined | null>(
    predicate: Predicate<U>,
  ) => Source<Validator<T, typeof predicate>>;
};

type SourceValue<T, V> = T & {
  sourceOptions: V;
};
type Source<T extends PropTypeDefinition> = T & {
  source: (options: SourceOptions) => SourceValue<T, typeof options>;
};

type ShapeType<T, V> = T & {
  shapeType: V;
};

type Shape<T extends PropTypeDefinition> = T & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  shape: <U extends Function>() => ShapeType<T, U>;
};

type GenericType<T extends PropTypeDefinition> = T & Optional<T> & Validate<T> & Source<T>;
type FunctionType<T extends PropTypeDefinition> = T &
  Shape<T> & {
    optional: Shape<OptionalValue<T>>;
  };

const addOptional = <T extends PropTypeDefinition>(object: T): Optional<T> => {
  const optionalObject = {
    ...object,
    isOptional: true as const,
    missingValue: true as const,
  };
  return {
    ...object,
    optional: {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ...addPredicate(optionalObject),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ...addSource(optionalObject),
    },
    defaultValue: <U extends ConstructorType<T['type']> | undefined>(
      value: ConstructorType<T['type']> extends Primitive ? U : () => U,
    ) => {
      const defaultObject = {
        ...object,
        isOptional: true as const,
        default: value,
      };
      return {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...addPredicate(defaultObject),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...addSource(defaultObject),
      };
    },
  };
};
const addPredicate = <T extends PropTypeDefinition>(object: T): Validate<T> => ({
  ...object,
  validate: <U extends ConstructorType<T['type']> | undefined | null>(predicate: Predicate<U>) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addSource({
      ...object,
      validator: predicate,
    }),
});

const addSource = <T extends PropTypeDefinition>(object: T): Source<T> =>
  ({
    ...object,
    source: (options: SourceOptions) => ({
      ...object,
      sourceOptions: options,
    }),
  } as Source<T>);

const addShape = <T extends PropTypeDefinition>(object: T): Shape<T> => ({
  ...object,
  // eslint-disable-next-line @typescript-eslint/ban-types
  shape: <U extends Function>() => ({
    ...object,
    shapeType: true as unknown as U,
  }),
});

// eslint-disable-next-line @typescript-eslint/ban-types
const createFunction = <T extends PropTypeDefinition['type'], U extends {}>(
  type: T,
  object: U,
): FunctionType<U & { type: T }> => {
  const typeObject = {
    ...object,
    type,
  };
  return {
    ...addShape(typeObject),
    optional: addShape({
      ...typeObject,
      isOptional: true as const,
      missingValue: true as const,
    }),
    // defaultValue: <U extends ConstructorType<T['type']> | undefined>(
    //   value: U extends Primitive ? U : () => U,
    // ) =>
    //   addShape({
    //     ...({ ...obj, type }),
    //     isOptional: true,
    //     default: value,
    //   }),
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
const generateType = <T extends PropTypeDefinition['type'], U extends {}>(
  type: T,
  object: U,
): GenericType<U & { type: T }> => {
  const typeObject = {
    ...object,
    type,
  };
  return {
    ...addOptional(typeObject),
    ...addPredicate(typeObject),
    ...addSource(typeObject),
  };
};

export const propType = {
  string: generateType(String, {}),
  number: generateType(Number, {}),
  boolean: generateType(Boolean, {}),
  date: generateType(Date, {}),
  object: generateType(Object, {}),
  array: generateType(Array, {}),
  func: createFunction(Function, {}),
  any: generateType({} as any, {}),
};
