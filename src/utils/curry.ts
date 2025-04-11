/**
 * Curries a function with any number of arguments.
 * @param fn - The function to curry.
 * @returns The curried function.
 */
export function curry(fn: Function) {
  return function curried(this: any, ...args: any[]) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (this: any, ...nextArgs: any[]) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

/**
 * Curries a function with two arguments.
 * @param fn - The function to curry.
 * @returns The curried function.
 */
export function curry2<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return function curried(a: A) {
    return function (b: B) {
      return fn(a, b);
    };
  };
}

/**
 * Curries a function with three arguments.
 * @param fn - The function to curry.
 * @returns The curried function.
 */
export function curry3<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R {
  return function curried(a: A) {
    return function (b: B) {
      return function (c: C) {
        return fn(a, b, c);
      };
    };
  };
}

// Tests for curry function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('curry', () => {
    it('should return a curried version of the provided function', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      expect(curriedAdd(1)(2)).toBe(3);
      expect(curriedAdd(1, 2)).toBe(3);
    });

    it('should work with functions that take more than two arguments', () => {
      const addThree = (a: number, b: number, c: number) => a + b + c;
      const curriedAddThree = curry(addThree);

      expect(curriedAddThree(1)(2)(3)).toBe(6);
      expect(curriedAddThree(1, 2)(3)).toBe(6);
      expect(curriedAddThree(1)(2, 3)).toBe(6);
      expect(curriedAddThree(1, 2, 3)).toBe(6);
    });
  });

  describe('curry2', () => {
    it('should return a curried version of a function with two arguments', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry2(add);

      expect(curriedAdd(1)(2)).toBe(3);
    });
  });

  describe('curry3', () => {
    it('should return a curried version of a function with three arguments', () => {
      const addThree = (a: number, b: number, c: number) => a + b + c;
      const curriedAddThree = curry3(addThree);

      expect(curriedAddThree(1)(2)(3)).toBe(6);
    });
  });
}
