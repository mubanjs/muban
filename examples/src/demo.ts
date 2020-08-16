// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { isString, Static, Predicate, isNumber, Primitive, optional } from 'isntnt';
//
// type GetPropInfo<T> = { decode?: (value: string) => T; defaultValue?: T };
// export function propType<T extends any>(
//   props: { validate: Predicate<T> } & GetPropInfo<T>,
// ): { validate: Predicate<T> } & GetPropInfo<T> {
//   return props;
// }
//
// // # everything
// // default = required
// // optional
// // optional + defaultValue
// // needs custom validation for some? (positive number, integer vs float, string length, regexp)
//
// // # primitives / Date
// // have a decoder, no typecheck needed
//
// // # objects / arrays
// // decode from json string
// // have a validator to validate the shape
//
// // .string()
// // .string.optional({ defaultValue?: string})
// // .number() // does autoConvert
// // .number.optional({ defaultValue?: number})
// // .date() // does autoConvert
// // .date.optional({ defaultValue?: Date})
// // .shape() // does autoConvert
// // .shape.optional({ defaultValue?: Date})
//
// export type PropTypeDefinition<T = any> = {
//   type: typeof Number | typeof String | typeof Boolean | typeof Date | typeof Array | typeof Object;
//   default?: T extends Primitive ? T : () => T;
//   validator?: Predicate<T>;
//   isOptional?: boolean;
// };
// type WithOptional<T extends PropTypeDefinition<any>> = T & {
//   isOptional: true;
// };
// type WithDefaultValue<T extends PropTypeDefinition<any>> = T & {
//   default: Exclude<T['default'], undefined>;
// };
// type PropTypeDefinitions = Record<string, PropTypeDefinition>;
//
// type X = PropTypeDefinition<string>;
// type Y = PropTypeDefinition<Array<number>>;
//
// propType.string = {
//   type: String,
//   optional: {
//     type: String,
//     isOptional: true,
//     defaultValue: (value: string) => ({
//       type: String,
//       isOptional: true,
//       default: value,
//       validate: (predicate: Predicate<string>) => ({
//         type: String,
//         isOptional: true,
//         default: value,
//         validator: predicate,
//       }),
//     }),
//     validate: (predicate: Predicate<string>) => ({
//       type: String,
//       isOptional: true,
//       validator: predicate,
//     }),
//   },
//   validate: <T extends string | undefined>(predicate: Predicate<T>) => ({
//     type: String,
//     validator: predicate,
//   }),
// };
//
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
//
// type OptionalPropertyKeys<T> = {
//   [P in keyof T]: undefined extends T[P] ? P : never;
// }[keyof T];
// type RequiredPropertyKeys<T> = {
//   [P in keyof T]: undefined extends T[P] ? never : P;
// }[keyof T];
//
// // if a validator is available, use the type from that predicate
// // otherwise, use the instanceType from passed `type` (e.g. Number or String)
// type ExtractType<T extends PropTypeDefinition> = 'validator' extends RequiredPropertyKeys<T>
//   ? Static<Exclude<T['validator'], undefined>>
//   : ReturnType<T['type']>;
//
// // if required is not undefined, then it's set to false, so the type should become optional
// type ExtractOptionalType<
//   T extends PropTypeDefinition,
//   V extends any
// > = 'isOptional' extends RequiredPropertyKeys<T> ? V | undefined : V;
//
// type TypedProp<T extends PropTypeDefinition> = ExtractOptionalType<T, ExtractType<T>>;
// type TypedProps<T extends Record<string, PropTypeDefinition>> = {
//   [P in keyof T]: TypedProp<T[P]>;
// };
//
// type Props = TypedProps<typeof props>;
//
// // basic shapes
// const p1 = { type: String };
// type P1 = Expect<Equal<string, TypedProp<typeof p1>>>;
//
// const p2 = { type: String, isOptional: true };
// type E2 = string | undefined;
// type P2 = Expect<Equal<string | undefined, TypedProp<typeof p2>>>;
//
// const p3 = { type: String, isOptional: true, default: 'foo' };
// type E3 = string | undefined;
// type P3 = Expect<Equal<E3, TypedProp<typeof p3>>>;
//
// const p4 = { type: String, validator: isNumber };
// type E4 = number;
// type P4 = Expect<Equal<E4, TypedProp<typeof p4>>>;
//
// const p4a = { type: String, validator: optional(isNumber) };
// type E4a = number | undefined;
// type P4a = Expect<Equal<E4a, TypedProp<typeof p4a>>>;
//
// const p5 = { type: String, validator: isNumber, isOptional: true };
// type E5 = number | undefined;
// type P5 = Expect<Equal<E5, TypedProp<typeof p5>>>;
//
// // helper functions
// const p21 = propType.string;
// type E21 = string;
// type P21 = Expect<Equal<E21, TypedProp<typeof p21>>>;
//
// const p22 = propType.string.optional;
// type E22 = string | undefined;
// type P22 = Expect<Equal<E22, TypedProp<typeof p22>>>;
//
// const p23 = propType.string.optional.defaultValue('foo');
// type E23 = string | undefined;
// type P23 = Expect<Equal<E23, TypedProp<typeof p23>>>;
//
// const p24 = propType.string.validate(isString);
// type E24 = string;
// type P24 = Expect<Equal<E24, TypedProp<typeof p24>>>;
//
// const p24a = propType.string.validate(optional(isString));
// type E24a = string | undefined;
// type T24a = TypedProp<typeof p24a>;
// type P24a = Expect<Equal<E24a, T24a>>;
//
// const p25 = propType.string.optional.validate(isString);
// type E25 = string | undefined;
// type P25 = SimpleEqual<E25, TypedProp<typeof p25>, E25>;
//
// const dc = <T extends Record<string, PropTypeDefinition>>(input: {
//   props: T;
//   setup: (props: TypedProps<T>) => void;
// }): void => {
//   console.log(input);
// };
//
// dc({
//   props: {
//     requiredString: propType.string,
//     optionalString: propType.string.optional,
//     optionalDefaultString: propType.string.optional.defaultValue('foo'),
//   },
//   setup(props) {
//     props.requiredString;
//     props.optionalString;
//     props.optionalDefaultString;
//   },
// });
