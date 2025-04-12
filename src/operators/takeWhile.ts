import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Takes chunks from the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the taken chunks.
 * 
 * @example
 * ```ts
 * const stream = from([1,2,3,4])
 * await pipe(stream, takeWhile(x=>x<3), toPromise) // Output: [1,2]
 * ```
 */
export function takeWhile<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(takeWhileStream)(predicate);
}

/**
 * Takes chunks from the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @param readableStream - The readable stream to take chunks from.
 * @returns A new readable stream with the taken chunks.
 */
export function takeWhileStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T> {
  let taking = true;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (taking && predicate(chunk)) {
        controller.enqueue(chunk);
      } else {
        taking = false;
        controller.terminate();
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for takeWhile function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('takeWhile', () => {
    it('should take chunks while the predicate is true', async () => {
      const stream = from([1, 2, 3, 4]);
      const resultStream = pipe(stream, takeWhile((x: number) => x < 3));
      expect(await toPromise(resultStream)).toEqual([1, 2]);
    });
  });
}
