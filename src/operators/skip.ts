import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Skips a specified number of chunks in the readable stream.
 * @param count - The number of chunks to skip.
 * @returns A function that takes a readable stream and returns a new readable stream with the skipped chunks.
 * 
 * @example
 * const stream = from([1,2,3,4])
 * await pipe(stream, skip(2), toPromise) // Output: [3,4]
 * 
 */
export function skip<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(skipStream)(count);
}

/**
 * Skips a specified number of chunks in the readable stream.
 * @param count - The number of chunks to skip.
 * @param readableStream - The readable stream to skip chunks from.
 * @returns A new readable stream with the skipped chunks.
 */
export function skipStream<T>(count: number, readableStream: ReadableStream<T>): ReadableStream<T> {
  let skipped = 0;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (skipped < count) {
        skipped++;
      } else {
        controller.enqueue(chunk);
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for skip function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('skip', () => {
    it('should skip the specified number of chunks', async () => {
      const stream = from([1, 2, 3, 4]);
      const resultStream = pipe(stream, skip(2));
      expect(await toPromise(resultStream)).toEqual([3, 4]);
    });
  });
}
