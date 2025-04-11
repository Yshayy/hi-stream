import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Skips chunks in the readable stream until a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the skipped chunks.
 */
export function skipUntil<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(skipUntilStream)(predicate);
}

/**
 * Skips chunks in the readable stream until a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @param readableStream - The readable stream to skip chunks from.
 * @returns A new readable stream with the skipped chunks.
 */
export function skipUntilStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T> {
  let skipping = true;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (skipping && !predicate(chunk)) {
        return;
      }
      skipping = false;
      controller.enqueue(chunk);
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for skipUntil function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('skipUntil', () => {
    it('should skip chunks until the predicate is true', async () => {
      const stream = from([1, 2, 3, 4]);
      const resultStream = pipe(stream, skipUntil((x: number) => x >= 3));
      expect(await toPromise(resultStream)).toEqual([3, 4]);
    });
  });
}
