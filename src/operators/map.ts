import { curry } from '../utils/curry';

/**
 * Applies a given function to each chunk in the readable stream.
 * @param fn - The function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the transformed chunks.
 * 
 * @example
 * ```ts
 * const stream = from([1,2,3])
 * await pipe(stream, map(x=>x*2), toPromise) // Output: [2,4,6]
 * ```
 */
export function map<T, R>(fn: (chunk: T) => R): (readableStream: ReadableStream<T>) => ReadableStream<R> {
  return curry(mapStream)(fn);
}

/**
 * Applies a given function to each chunk in the readable stream.
 * @param fn - The function to apply to each chunk.
 * @param readableStream - The readable stream to transform.
 * @returns A new readable stream with the transformed chunks.
 */
export function mapStream<T, R>(fn: (chunk: T) => R, readableStream: ReadableStream<T>): ReadableStream<R> {
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const result = fn(chunk);
      controller.enqueue(result);
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for map function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('map', () => {
    it('should transform each chunk using the provided function', async () => {
      const stream = from([1, 2, 3]);
      const resultStream = pipe(stream, map((x: number) => x * 2));
      expect(await toPromise(resultStream)).toEqual([2, 4, 6]);
    });
  });
}
