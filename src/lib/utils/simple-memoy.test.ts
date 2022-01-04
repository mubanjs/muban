import { simpleMemo } from './simple-memo';

function add({ a, b }: { a: number; b: number }) {
  return { a, b };
}

describe('simple-memo', () => {
  it('should return the correct result', () => {
    const m = simpleMemo(add);
    const result = m({ a: 1, b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });
  it('should return the same reference when called twice', () => {
    const m = simpleMemo(add);
    const input = { a: 1, b: 2 };

    const result1 = m(input);
    const result2 = m({ a: 1, b: 2 });
    expect(result1).not.toBe(result2);

    const result3 = m({ a: 1, b: 3 });
    expect(result1).not.toBe(result3);

    const result4 = m(input);
    expect(result1).toBe(result4);
  });
});
