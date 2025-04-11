import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Filters chunks in the readable stream based on a predicate function.
 * @param predicate - The predicate function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the filtered chunks.
 */
export function filter<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(filterStream)(predicate);
}

/**
 * Filters chunks in the readable stream based on a predicate function.
 * @param predicate - The predicate function to apply to each chunk.
 * @param readableStream - The readable stream to filter.
 * @returns A new readable stream with the filtered chunks.
 */
export function filterStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T> {
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (predicate(chunk)) {
        controller.enqueue(chunk);
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for filter function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('filter', () => {
    it('should filter chunks using the provided predicate function', async () => {
      const stream = from([1, 2, 3]);
      const resultStream = pipe(stream, filter(x => x % 2 === 0));  
      expect(await toPromise(resultStream)).toEqual([2]);
    });
  });
}
