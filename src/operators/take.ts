import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Takes a specified number of chunks from the readable stream.
 * @param count - The number of chunks to take.
 * @returns A function that takes a readable stream and returns a new readable stream with the taken chunks.
 */
export function take<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(takeStream)(count);
}

/**
 * Takes a specified number of chunks from the readable stream.
 * @param count - The number of chunks to take.
 * @param readableStream - The readable stream to take chunks from.
 * @returns A new readable stream with the taken chunks.
 */
export function takeStream<T>(count: number, readableStream: ReadableStream<T>): ReadableStream<T> {
  let taken = 0;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (taken < count) {
        controller.enqueue(chunk);
        taken++;
      }
      if (taken >= count) {
        controller.terminate();
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for take function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('take', () => {
    it('should take the specified number of chunks', async () => {
      const stream = from([1, 2, 3, 4]);
      const resultStream = pipe(stream, take(2));
      expect(await toPromise(resultStream)).toEqual([1, 2]);
    });
  });
}
