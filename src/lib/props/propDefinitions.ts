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
    value: U extends Primitive ? U : () => U,
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
  source: <U = SourceOptions>(options: U) => SourceValue<T, typeof options>;
};

type ShapeType<T, V> = T & {
  shapeType: V;
};

type Shape<T extends PropTypeDefinition> = T & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  shape: <U extends Function>() => ShapeType<T, U>;
};

type GenericType<T extends PropTypeDefinition> = T & Optional<T> & Validate<T> & Source<T>;
type FuncType<T extends PropTypeDefinition> = T &
  Shape<T> & {
    optional: Shape<OptionalValue<T>>;
  };

const addOptional = <T extends PropTypeDefinition>(obj: T): Optional<T> => {
  const optionalObj = {
    ...obj,
    isOptional: true as const,
    missingValue: true as const,
  };
  return {
    ...obj,
    optional: {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ...addPredicate(optionalObj),
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      ...addSource(optionalObj),
    },
    defaultValue: <U extends ConstructorType<T['type']> | undefined>(
      value: U extends Primitive ? U : () => U,
    ) => {
      const defaultObj = {
        ...obj,
        isOptional: true as const,
        default: value,
      };
      return {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...addPredicate(defaultObj),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...addSource(defaultObj),
      };
    },
  };
};
const addPredicate = <T extends PropTypeDefinition>(obj: T): Validate<T> => ({
  ...obj,
  validate: <U extends ConstructorType<T['type']> | undefined | null>(predicate: Predicate<U>) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addSource({
      ...obj,
      validator: predicate,
    }),
});

const addSource = <T extends PropTypeDefinition>(obj: T): Source<T> =>
  ({
    ...obj,
    source: (options: SourceOptions) => ({
      ...obj,
      sourceOptions: options,
    }),
  } as Source<T>);

const addShape = <T extends PropTypeDefinition>(obj: T): Shape<T> => ({
  ...obj,
  // eslint-disable-next-line @typescript-eslint/ban-types
  shape: <U extends Function>() => ({
    ...obj,
    shapeType: (true as unknown) as U,
  }),
});

// eslint-disable-next-line @typescript-eslint/ban-types
const createFunc = <T extends PropTypeDefinition['type'], U extends {}>(
  type: T,
  obj: U,
): FuncType<U & { type: T }> => {
  const typeObj = {
    ...obj,
    type,
  };
  return {
    ...addShape(typeObj),
    optional: addShape({
      ...typeObj,
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
  obj: U,
): GenericType<U & { type: T }> => {
  const typeObj = {
    ...obj,
    type,
  };
  return {
    ...addOptional(typeObj),
    ...addPredicate(typeObj),
    ...addSource(typeObj),
  };
};

export const propType = {
  string: generateType(String, {}),
  number: generateType(Number, {}),
  boolean: generateType(Boolean, {}),
  date: generateType(Date, {}),
  object: generateType(Object, {}),
  array: generateType(Array, {}),
  func: createFunc(Function, {}),
};
