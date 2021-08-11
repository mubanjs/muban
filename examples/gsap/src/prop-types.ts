/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars,no-console */
import { isString, isNumber, optional, isDate } from 'isntnt';
import { propType } from '../../../src/lib/props/propDefinitions';
import type {
  ExtractType,
  PropTypeDefinition,
  TypedProp,
  TypedProps,
} from '../../../src/lib/props/propDefinitions.types';

// # everything
// default = required
// optional
// optional + defaultValue
// needs custom validation for some? (positive number, integer vs float, string length, regexp)
//
// # primitives / Date
// have a decoder, no typecheck needed
//
// # objects / arrays
// decode from json string
// have a validator to validate the shape
//
// .string()
// .string.optional({ defaultValue?: string})
// .number() // does autoConvert
// .number.optional({ defaultValue?: number})
// .date() // does autoConvert
// .date.optional({ defaultValue?: Date})
// .shape() // does autoConvert
// .shape.optional({ defaultValue?: Date})

// const getOptional = <T extends {}>(type: T) => {
//   return {
//     optional: {
//       ...type,
//       isOptional: true,
//     },
//   };
// };
// const getValidate = <T extends PropTypeDefinition>(type: T) => {
//   return {
//     validate: <U extends ConstructorType<T['type']> | undefined>(predicate: Predicate<U>) => ({
//       ...type,
//       validator: predicate,
//     }),
//   };
// };
// const getDefaultValue = <T extends PropTypeDefinition>(type: T) => {
//   return {
//     defaultValue: <U extends ConstructorType<T['type']> | undefined>(
//       value: U extends Primitive ? U : () => U,
//     ) => ({
//       ...type,
//       default: value,
//       isOptional: true,
//       ...getValidate({ type: type.type, isOptional: true, default: value }),
//     }),
//   };
// };
//
// const generateType = <T extends PropTypeDefinition['type'], U extends {}>(type: T, payload: U) => ({
//   type: type,
//   ...getOptional({
//     type: type,
//     ...getDefaultValue({ type: type }),
//     ...getValidate({ type: type, isOptional: true }),
//     ...payload,
//   }),
//   ...getDefaultValue({ type: type }),
//   ...getValidate({ type: type }),
//   ...payload,
// });
//
// const getShape = () => {
//   return {
//     shape: <T extends Function>() => ({
//       ...generateType(Function, { type: Function, shapeType: (true as unknown) as T }),
//     }),
//   };
// };

// export const propType = {
//   string: generateType(String, {}),
//   number: generateType(Number, {}),
//   boolean: generateType(Boolean, {}),
//   date: generateType(Date, {}),
//   func: {
//     ...generateType(Function, {}),
//     ...getShape(),
//   },
// };

// const ptString = addPredicate(
//   addOptional(
//     addDefaultValue({
//       type: String,
//     }),
//   ),
// );
//
// const ptFunc = addOptional(
//   addShape({
//     type: Function,
//   }),
// );
//
// const f1 = ptFunc.optional;
// type F1 = TypedProp<typeof f1>;
//
// const f2 = ptFunc.shape();
// type F2 = TypedProp<typeof f2>;
//
// const f3 = ptFunc.shape().optional;
// type F3 = TypedProp<typeof f3>;
//
// const f4 = ptFunc.optional.shape();
// type X = ReturnType<typeof ptFunc.optional.shape>;
// type F4 = TypedProp<typeof f4>;
//
// const p1 = ptString;
// type P1 = TypedProp<typeof p1>;
//
// const p2 = ptString.optional;
// type P2 = TypedProp<typeof p2>;
//
// const p3 = ptString.optional.defaultValue('foo');
// type P3 = TypedProp<typeof p3>;
//
// const p4 = ptString.defaultValue('foo');
// type P4 = TypedProp<typeof p4>;
//
// // const p5 = ptString.defaultValue('foo').optional;
// // type P5 = TypedProp<typeof p5>;
//
// const p6 = ptString.validate(isString);
// type P6 = TypedProp<typeof p6>;
//
// const p7 = ptString.validate(optional(isString));
// type P7 = TypedProp<typeof p7>;
//
// const p6a = ptString.validate(isString).optional;
// type P6a = TypedProp<typeof p6a>;
//
// const p6b = ptString.validate(isString).defaultValue('foo');
// type P6b = TypedProp<typeof p6b>;
//
// const p2a = ptString.optional.validate(isString);
// type P2a = TypedProp<typeof p2a>;
//
// const p3a = ptString.defaultValue('foo').validate(isString);
// type P3a = TypedProp<typeof p3a>;

///

// const fff1 = propType.func;
// const fff2 = propType.func.optional;
// const fff3 = propType.func.defaultValue(() => new Date());
// const fff4 = propType.func.validate(isFunction());
// const fff5 = propType.func.optional.defaultValue(() => new Date()).validate(isDate);
// const fff6 = propType.func.shape();
// const fff7 = propType.func.shape<(value: string) => number>();
// const fff8 = propType.func.shape().optional;
// const fff9 = propType.func.shape<(value: string) => number>().optional;
//
// type FFF6 = ExtractType<typeof fff6>;
// type FFF7 = ExtractType<typeof fff7>;
// type FFF8 = ExtractType<typeof fff8>;
// type FFF9 = ExtractType<typeof fff9>;

// const ppp1 = propType.date;
// const ppp2 = propType.date.optional;
// const ppp3 = propType.date.defaultValue(() => new Date());
// const ppp4 = propType.date.validate(isDate);
// const ppp5 = propType.date.optional.defaultValue(() => new Date()).validate(isDate);

// const props = {
//   requiredString: propType.string,
//   optionalString: propType.string.optional,
//   optionalDefaultString: propType.string.optional.defaultValue('foo'),
//   // requiredNumber: propType({
//   //   validate: isNumber,
//   //   decode: (value: string): number => parseFloat(value),
//   // }),
//   // optionalNumber: propType({
//   //   validate: optional(isNumber),
//   //   decode: (value: string): number => parseFloat(value),
//   // }),
//   // optionalDefaultNumber: propType({
//   //   validate: optional(isNumber),
//   //   decode: (value: string): number => parseFloat(value),
//   //   defaultValue: 1,
//   // }),
// };

const dsf = {
  type: Function,
  shapeType: (1 as unknown) as (value: string) => number,
};
type DSF = ExtractType<typeof dsf>;

// type Props = TypedProps<typeof props>;

// basic shapes
const oo1 = { type: String };
type OO1 = Expect<Equal<string, TypedProp<typeof oo1>>>;

const oo2 = { type: String, missingValue: true };
type OO2 = Expect<Equal<string | undefined, TypedProp<typeof oo2>>>;

const oo3 = { type: String, missingValue: true, default: 'foo' };
type OO3 = Expect<Equal<string | undefined, TypedProp<typeof oo3>>>;

const oo4 = { type: String, validator: isNumber };
type OO4 = Expect<Equal<number, TypedProp<typeof oo4>>>;

const oo4a = { type: String, validator: optional(isNumber) };
type OO4a = Expect<Equal<number | undefined, TypedProp<typeof oo4a>>>;

const oo5 = { type: String, validator: isNumber, missingValue: true };
type OO5 = Expect<Equal<number | undefined, TypedProp<typeof oo5>>>;

// helper functions
const p21 = propType.string;
type P21 = Expect<Equal<string, TypedProp<typeof p21>>>;

const p22 = propType.string.optional;
type P22 = Expect<Equal<string | undefined, TypedProp<typeof p22>>>;

const p23 = propType.string.defaultValue('foo');
type P23 = Expect<Equal<string, TypedProp<typeof p23>>>;

const p24 = propType.string.validate(isString);
type P24 = Expect<Equal<string, TypedProp<typeof p24>>>;

const p24a = propType.string.validate(optional(isString));
type P24a = Expect<Equal<string | undefined, TypedProp<typeof p24a>>>;

const p25 = propType.string.optional.validate(isString);
type P25 = Expect<Equal<string | undefined, TypedProp<typeof p25>>>;

const p25a = propType.string.defaultValue('1');
type P25a = Expect<Equal<string | undefined, TypedProp<typeof p25>>>;

const p25b = propType.string.defaultValue('1').validate(isString);
type P25b = Expect<Equal<string | undefined, TypedProp<typeof p25>>>;

// Number helper functions
const n21 = propType.number;
type N21 = Expect<Equal<number, TypedProp<typeof n21>>>;

const n22 = propType.number.optional;
type N22 = Expect<Equal<number | undefined, TypedProp<typeof n22>>>;

const n23 = propType.number.defaultValue(3);
type N23 = Expect<Equal<number, TypedProp<typeof n23>>>;

const n24 = propType.number.validate(isNumber);
type N24 = Expect<Equal<number, TypedProp<typeof n24>>>;

const n24a = propType.number.validate(optional(isNumber));
type N24a = Expect<Equal<number | undefined, TypedProp<typeof n24a>>>;

const n25 = propType.number.optional.validate(isNumber);
type N25 = Expect<Equal<number | undefined, TypedProp<typeof n25>>>;

// Date helper functions
const d21 = propType.date;
type D21 = Expect<Equal<Date, TypedProp<typeof d21>>>;

const d22 = propType.date.optional;
type D22 = Expect<Equal<Date | undefined, TypedProp<typeof d22>>>;

const d23 = propType.date.defaultValue(() => new Date());
type D23 = Expect<Equal<Date, TypedProp<typeof d23>>>;

const d24 = propType.date.validate(isDate);
type D24 = Expect<Equal<Date, TypedProp<typeof d24>>>;

const d24a = propType.date.validate(optional(isDate));
type D24a = Expect<Equal<Date | undefined, TypedProp<typeof d24a>>>;

const d25 = propType.date.optional.validate(isDate);
type D25 = Expect<Equal<Date | undefined, TypedProp<typeof d25>>>;

// Function helper functions
const f21 = propType.func;
type F21 = Expect<Equal<Function, TypedProp<typeof f21>>>;

const f22 = propType.func.optional;
type F22 = Expect<Equal<Function | undefined, TypedProp<typeof f22>>>;

// not working :(
// const f23 = propType.func.optional.defaultValue(() => () => 3);
// type F23 = Expect<Equal<Function | undefined, TypedProp<typeof f23>>>;

// not useful
// const f24 = propType.func.validate(isFunction);
// type F24 = Expect<Equal<Function, TypedProp<typeof f24>>>;
//
// const f24a = propType.func.validate(optional(isFunction));
// type F24a = Expect<Equal<Function | undefined, TypedProp<typeof f24a>>>;
//
// const f25 = propType.func.optional.validate(isFunction);
// type F25 = Expect<Equal<Function | undefined, TypedProp<typeof f25>>>;

const f26a = propType.func.shape();
type F26a = Expect<Equal<Function, TypedProp<typeof f26a>>>;

const f26b = propType.func.shape<(value: string) => number>();
type F26b = Expect<Equal<(value: string) => number, TypedProp<typeof f26b>>>;

// const f27a = propType.func.optional.shape();
// type F27a = Expect<Equal<Function | undefined, TypedProp<typeof f27a>>>;

const f27a1 = propType.func.optional.shape();
type F27a1 = Expect<Equal<Function | undefined, TypedProp<typeof f27a1>>>;

const f27b = propType.func.optional.shape<(value: string) => number>();
type F27b = Expect<Equal<undefined | ((value: string) => number), TypedProp<typeof f27b>>>;

// meh, issues :(
// const f23a1 = propType.func.shape().defaultValue(() => () => 3);
// type F23a1 = Expect<Equal<Function | undefined, TypedProp<typeof f23a1>>>;
//
// const f23b = propType.func.shape<(value: string) => number>().defaultValue(() => () => { return 3});
// type F23b = Expect<Equal<undefined | ((value: string) => number), TypedProp<typeof f23b>>>;

// // helper functions
// const p31 = pType.string;
// type P31 = Expect<Equal<string, TypedProp<typeof p31>>>;
//
// const p32 = pType.string.optional;
// type P32 = Expect<Equal<string | undefined, TypedProp<typeof p32>>>;
//
// const p33 = pType.string.optional.defaultValue('foo');
// type P33 = Expect<Equal<string | undefined, TypedProp<typeof p33>>>;
//
// const p34 = pType.string.validate(isString);
// type P34 = Expect<Equal<string, TypedProp<typeof p34>>>;
//
// const p34a = pType.string.validate(optional(isString));
// type P34a = Expect<Equal<string | undefined, TypedProp<typeof p34a>>>;
//
// const p35 = pType.string.optional.validate(isString);
// type P35 = Expect<Equal<string | undefined, TypedProp<typeof p35>>>;

const dc = <T extends Record<string, PropTypeDefinition>>(input: {
  props: T;
  setup: (props: TypedProps<T>) => void;
}): void => {
  console.log(input);
};

dc({
  props: {
    // works with chainers
    // requiredString: propType.string,
    // optionalString: propType.string.optional,
    // optionalDefaultString: propType.string.optional.defaultValue('foo'),
    // validatedString: propType.string.validate(isString),
    validatedString2: propType.string.validate(optional(isString)),
    // validatedOptionalString: propType.string.validate(optional(isString)),

    // or with objects
    requiredDate: { type: Date, validator: optional(isString) },
    // optionalDate: { type: Date, isOptional: true },
    // optionalDefaultDate: { type: Date, isOptional: true, default: new Date() },
    // validatedDate: { type: Date, validator: isDate },
    // validatedDate2: { type: Date, validator: optional(isDate) },
    // validatedOptionalDate: { type: Date, isOptional: true, validator: isDate },
  },
  setup(props) {
    props.requiredString;
    // props.optionalString;
    // props.optionalDefaultString;
    // props.validatedString;
    props.validatedString2;
    // props.validatedOptionalString;

    props.requiredDate;
    // props.optionalDate;
    // props.optionalDefaultDate;
    props.validatedDate;
    props.validatedDate2;
    // props.validatedOptionalDate;
  },
});

///
/// TRIAL AREA
///

// type FFFF<T, P extends Predicate<any> | undefined> = undefined extends P
//   ? T
//   : Static<Exclude<P, undefined>>;
//
// type AAAA = FFFF<string, Predicate<any> | undefined>;
// type AAAA1 = FFFF<string, Predicate<number>>;
//
// const foo = <
//   T extends
//     | typeof Number
//     | typeof String
//     | typeof Boolean
//     | typeof Date
//     | typeof Array
//     | typeof Object,
//   P extends Predicate<ConstructorType<T> | undefined> | undefined
// >(
//   type: T,
//   value: FFFF<ConstructorType<T>, P>,
//   fn?: P,
// ) => {
//   return {
//     type,
//     value,
//     fn,
//   };
// };
//
// type DF = Static<Predicate<string>>;
//
// const ff1 = foo(Date, new Date(), optional(isDate));
// const ff2 = foo(Date, new Date(), isDate);
// const ff3 = foo(Date, new Date());
//
// type X<T = any> = {
//   type: typeof Number | typeof String;
//   value: T;
// };

//
////////
//

// const addOptional = <T extends PropTypeDefinition>(type: T): WithOptional<T> => {
//   Object.defineProperty(type, 'optional', {
//     get() {
//       this.isOptional = true;
//     },
//     enumerable: false,
//   });
//   return type as WithOptional<T>;
// };
// const addDefaultValue = <T extends WithOptional<PropTypeDefinition>>(
//   type: T,
// ): WithDefaultValue<T> => {
//   Object.defineProperty(type, 'defaultValue', {
//     value(value: any) {
//       this.default = value;
//     },
//     enumerable: false,
//   });
//   return type as WithDefaultValue<T>;
// };
// const p = {
//   type: String,
// } as PropTypeDefinition<string>;
// const po = addOptional(p);
// const pod = addDefaultValue(po);
//
// class Property<T extends any, U extends any> {
//   public default?: T;
//   public validator?: Predicate<T | undefined>;
//
//   public constructor(public type: U) {}
//
//   public get optional(): OptionalProperty<T, U> {
//     // eslint-disable-next-line @typescript-eslint/no-use-before-define
//     return new OptionalProperty<T, U>(this.type);
//   }
//   public defaultValue(value: T): this {
//     this.default = value;
//     return this;
//   }
//   public validate<U extends Predicate<T | undefined>>(predicate: U): this {
//     this.validator = predicate;
//     return this;
//   }
// }
// class OptionalProperty<T extends any, U extends any> extends Property<T, U> {
//   public default?: T;
//   public validator?: Predicate<T>;
//   public isOptional = true;
//
//   public constructor(public type: U) {
//     super(type);
//   }
//   public defaultValue(value: T): this {
//     this.default = value;
//     return this;
//   }
//   public validate(predicate: Predicate<T>): this {
//     this.validator = predicate;
//     return this;
//   }
// }
// const pType = {
//   get string() {
//     return new Property<string, typeof String>(String);
//   },
// };
//
// const s = pType.string.optional.defaultValue('foo');
// type R<T> = { [P in keyof T]: T[P] };
// type S1 = R<typeof s>;
// type S2 = TypedProp<typeof s>;
