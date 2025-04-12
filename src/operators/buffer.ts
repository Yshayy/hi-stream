import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Buffers chunks in the readable stream based on a predicate function.
 * @param predicate - The predicate function to open/close the buffer.
 * @returns A function that takes a readable stream and returns a new readable stream with the buffered chunks.
 * 
 * @example
 * const stream = from([1, 2, 3, 4, 5]);
 * const resultStream = pipe(stream, buffer(x => x % 2 === 0));
 * await toPromise(resultStream); // Output: [[1, 2], [3, 4], [5]]
 */
export function buffer<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T[]> {
  return curry(bufferStream)(predicate);
}

/**
 * Buffers chunks in the readable stream based on a predicate function.
 * @param predicate - The predicate function to open/close the buffer.
 * @param readableStream - The readable stream to buffer.
 * @returns A new readable stream with the buffered chunks.
 */
export function bufferStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T[]> {
  let buffer: T[] = [];
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      buffer.push(chunk);
      if (predicate(chunk)) {
        controller.enqueue(buffer);
        buffer = [];
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        controller.enqueue(buffer);
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for buffer function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('buffer', () => {
    it('should buffer chunks based on the provided predicate function', async () => {
      const stream = from([1, 2, 3, 4, 5]);
      const resultStream = pipe(stream, buffer(x => x % 2 === 0));
      expect(await toPromise(resultStream)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });
}
