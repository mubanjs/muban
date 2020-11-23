# Props

## propType

```ts
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
  missingValue?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  shapeType?: Function;
};

type PropType = {
  string: PropTypeDefinition;
  number: PropTypeDefinition;
  boolean: PropTypeDefinition;
  date: PropTypeDefinition;
  func: PropTypeDefinition;
}
```

```ts
import { propType } from '@muban/muban';

defineComponent({
  props: {
    foo: propType.string
  }
})
```

### type

```ts
propType.string;

{
  type: String,
  optional: {},
  defaultValue(value: string) => {},
  validate(predicate: Predicate) => {},
} 
```
```ts
propType.number;

{
  type: Number,
  optional: {},
  defaultValue(value: number) => {},
  validate(predicate: Predicate) => {},
} 
```
```ts
propType.boolean;

{
  type: Boolean,
  optional: {},
  defaultValue(value: boolean) => {},
  validate(predicate: Predicate) => {},
} 
```
```ts
propType.date;

{
  type: Date,
  optional: {},
  defaultValue(value: Date) => {},
  validate(predicate: Predicate) => {},
} 
```
```ts
propType.func;

{
  type: Function,
  optional: {},
  shape<T>() => {},
} 
```
### optional

```ts
optional;

{
  ...obj,
  isOptional: true,
  missingValue: true,
}
```
```ts
propType.string.optional;
```

### defaultValue

```ts
defaultValue: <U extends ConstructorType<T['type']> | undefined>(
  value: U extends Primitive ? U : () => U,
);

{
  ...obj,
  isOptional: true,
  default: value,
}
```
```ts
propType.string.defaultValue('foo');
```

### validate

```ts
validate: <U extends ConstructorType<T['type']> | undefined>(predicate: Predicate<U>)

{
  ...obj,
  validator: predicate,
}
```
```ts
export const isPositive: Predicate<number> = (value: unknown): value is number =>
  typeof value === 'number' && (value === 0 ? Infinity / value : value) > 0

propType.number.validate(isPositive);
```

### shape

```ts
shape: <T extends Function>();

{
  ...obj,
  shapeType: (true as unknown) as T,
}
```
```ts
propType.func.shape<(isExpanded: boolean) => void>()
```
