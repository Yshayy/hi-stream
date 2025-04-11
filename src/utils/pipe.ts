/**
 * Pipes the input through a series of functions.
 * @param input - The initial input value.
 * @param fns - The functions to pipe the input through.
 * @returns The result of piping the input through the functions.
 */
export interface Pipe {
  <A>(value: A): A;
  <A, B>(value: A, fn1: (input: A) => B): B;
  <A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
  <A, B, C, D>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): D;
  <A, B, C, D, E>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E): E;
  <A, B, C, D, E, F>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E, fn5: (input: E) => F): F;
  <A, B, C, D, E, F, G>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E, fn5: (input: E) => F, fn6: (input: F) => G): G;
  <A, B, C, D, E, F, G, H>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E, fn5: (input: E) => F, fn6: (input: F) => G, fn7: (input: G) => H): H;
  <A, B, C, D, E, F, G, H, I>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E, fn5: (input: E) => F, fn6: (input: F) => G, fn7: (input: G) => H, fn8: (input: H) => I): I;
}

export const pipe: Pipe = (value: any, ...fns: Function[]): unknown => {
  return fns.reduce((acc, fn) => fn(acc), value);
};

// Tests for pipe function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('pipe', () => {
    it('should pipe the input through all provided functions', () => {
      const add = (a: number) => a + 1;
      const multiply = (a: number) => a * 2;
      const subtract = (a: number) => a - 3;

      const result = pipe(5, add, multiply, subtract);

      expect(result).toBe(9); // (5 + 1) * 2 - 3 = 9
    });

    it('should work with a single function', () => {
      const add = (a: number) => a + 1;

      const result = pipe(5, add);

      expect(result).toBe(6); // 5 + 1 = 6
    });

    it('should work with no functions', () => {
      const result = pipe(5);

      expect(result).toBe(5); // 5
    });
  });
}
