import type { Predicate, Primitive } from 'isntnt';
import type { ConstructorType, PropTypeDefinition, SourceOptions } from './propDefinitions.types';

const addSource = <T extends PropTypeDefinition>(obj: T) => ({
  ...obj,
  source: (options: SourceOptions) => ({
    ...obj,
    sourceOptions: options,
  }),
});

const addOptional = <T extends PropTypeDefinition>(obj: T) => ({
  ...obj,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  optional: addDefaultValue(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addPredicate({
      ...obj,
      isOptional: true,
      missingValue: true,
    }),
  ),
});
const addDefaultValue = <T extends PropTypeDefinition>(obj: T) => ({
  ...obj,
  defaultValue: <U extends ConstructorType<T['type']> | undefined>(
    value: U extends Primitive ? U : () => U,
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addPredicate({
      ...obj,
      isOptional: true,
      default: value,
    }),
});
const addPredicate = <T extends PropTypeDefinition>(obj: T) => ({
  ...obj,
  validate: <U extends ConstructorType<T['type']> | undefined>(predicate: Predicate<U>) => ({
    ...obj,
    validator: predicate,
  }),
});

const addShape = <T extends PropTypeDefinition>(obj: T) => ({
  ...obj,
  // eslint-disable-next-line @typescript-eslint/ban-types
  shape: <T extends Function>() =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    generateType(obj.type, {
      ...obj,
      shapeType: (true as unknown) as T,
    }),
});

// eslint-disable-next-line @typescript-eslint/ban-types
const generateType = <T extends PropTypeDefinition['type'], U extends {}>(type: T, obj: U) =>
  addPredicate(
    addOptional(
      addDefaultValue(
        addSource({
          ...obj,
          type: type,
        }),
      ),
    ),
  );

export const propType = {
  string: generateType(String, {}),
  number: generateType(Number, {}),
  boolean: generateType(Boolean, {}),
  date: generateType(Date, {}),
  func: addShape(addOptional({ type: Function })),
  object: generateType(Object, {}),
  array: generateType(Array, {}),
};
