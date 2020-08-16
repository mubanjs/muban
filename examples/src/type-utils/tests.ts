/* eslint-disable @typescript-eslint/no-explicit-any */
type Warning<M, E, M2, A> = { message: M | M2; expected: E; actual: A };

// returns:
// - Warning<> on complete mismatch
// - true on exact match
// - union of the above on either side partial match
// this union can be removed with the OnlyTrue<> below

// but by plasing each comparison in a tuple, and joining the results, the checks can be done
// in "isolation" and work properly
type Compare<T, V> = [
  T extends V
    ? true
    : Warning<' Passed type is too strict, passed ', V, ', does not match expected:', T>,
  V extends T ? true : Warning<' Passed type is too loose ', T, ' is not expecting ', V>,
][number];

// removes true from unions (with warning), but not from true itself
type OnlyTrue<T> = Exclude<T, true> extends never ? true : Exclude<T, true>;

// returns true if T and V are exactly the same
type Equal<T, V> = OnlyTrue<Compare<T, V>>;
type Not<V extends Warning<any, any, any, any>> = true;
type Expect<T extends true> = T;

type XX1 = Expect<Equal<string, string>>;
type XX2 = Expect<Not<Equal<number, string>>>;
type XX3 = Expect<Not<Equal<string | undefined, string>>>;
type XX4 = Expect<Not<Equal<string, string | undefined | number>>>;
type XX5 = Expect<Equal<string | undefined, string | undefined>>;
type XX6 = Expect<Not<Equal<string, any>>>;
type XX7 = Expect<Not<Equal<any, string>>>;

// type AA1 = Equal<string, string>;
// type AA2 = Equal<number, string>;
// type AA3 = Equal<string | undefined, string>;
// type AA4 = Equal<string, string | undefined>;
// type AA5 = Equal<string | undefined, string | undefined>;
// type AA6 = Equal<string, any>;
// type AA7 = Equal<any, string>;
//
// type CC1 = Compare<string, string>;
// type CC2 = Compare<number, string>;
// type CC3 = Compare<string | undefined, string>;
// type CC4 = Compare<string, string | undefined>;
// type CC5 = Compare<string | undefined, string | undefined>;
// type CC6 = Compare<string, any>;
// type CC7 = Compare<any, string>;
