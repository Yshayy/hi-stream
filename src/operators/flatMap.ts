import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Applies a given function to each chunk in the readable stream and flattens the result.
 * @param fn - The function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the transformed and flattened chunks.
 * 
 * @example
 * ```ts
 * const stream = from([1,2,3])
 * await pipe(stream, flatMap(x=>[x,x*2]), toPromise) // Output: [1,2,2,4,3,6]
 * ```
 */
export function flatMap<T, R>(fn: (chunk: T) => R[]): (readableStream: ReadableStream<T>) => ReadableStream<R> {
  return curry(flatMapStream)(fn);
}

/**
 * Applies a given function to each chunk in the readable stream and flattens the result.
 * @param fn - The function to apply to each chunk.
 * @param readableStream - The readable stream to transform.
 * @returns A new readable stream with the transformed and flattened chunks.
 */
export function flatMapStream<T, R>(fn: (chunk: T) => R[], readableStream: ReadableStream<T>): ReadableStream<R> {
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const results = fn(chunk);
      for (const result of results) {
        controller.enqueue(result);
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for flatMap function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('flatMap', () => {
    it('should flatten and transform each chunk using the provided function', async () => {
      const stream = from([1, 2, 3]);
      const resultStream = pipe(stream, flatMap((x: number) => [x, x * 2]));
      expect(await toPromise(resultStream)).toEqual([1, 2, 2, 4, 3, 6]);
    });
  });
}
