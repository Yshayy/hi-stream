import { pipe } from '../utils/pipe';
import { buffer } from './buffer';

/**
 * Buffers a specified number of items in the readable stream.
 * @param count - The number of items to buffer.
 * @returns A function that takes a readable stream and returns a new readable stream with the buffered items.
 * 
 * @example
 * const stream = from([1, 2, 3, 4, 5]);
 * const resultStream = pipe(stream, bufferCount(2));
 * await toPromise(resultStream); // Output: [[1, 2], [3, 4], [5]]
 */
export function bufferCount<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T[]> {
  return (readableStream: ReadableStream<T>) => {
    let itemCount = 0;
    return pipe(readableStream, buffer(() => {
      itemCount++;
      return itemCount % count === 0;
    }));
  };
}

// Tests for bufferCount function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { from } = await import('../conversions/from');
  const { toPromise } = await import('../conversions/toPromise');
  const { pipe } = await import('../utils/pipe');

  describe('bufferCount', () => {
    it('should buffer the specified number of items', async () => {
      const stream = from([1, 2, 3, 4, 5]);
      const resultStream = pipe(stream, bufferCount(2));
      expect(await toPromise(resultStream)).toEqual([[1, 2], [3, 4], [5]]);
    });
  });
}
