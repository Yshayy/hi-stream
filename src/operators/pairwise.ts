import { toPromise } from '../conversions/toPromise';

/**
 * Emits pairs of consecutive chunks from the readable stream.
 * @returns A function that takes a readable stream and returns a new readable stream with pairs of consecutive chunks.
 * 
 * @example
 * const stream = from([1,2,3])
 * await pipe(stream, pairwise(), toPromise) // Output: [[1,2],[2,3]]
 * 
 */
export function pairwise<T>(): (readableStream: ReadableStream<T>) => ReadableStream<[T, T]> {
  return (readableStream: ReadableStream<T>) => {
    let previous: T | undefined;
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (previous !== undefined) {
          controller.enqueue([previous, chunk]);
        }
        previous = chunk;
      }
    });

    return readableStream.pipeThrough(transformStream);
  };
}

// Tests for pairwise function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');
  const { from } = await import('../conversions/from');

  describe('pairwise', () => {
    it('should emit pairs of consecutive chunks', async () => {
      const stream = from([1, 2, 3]);
      const resultStream = pipe(stream, pairwise());
      expect(await toPromise(resultStream)).toEqual([[1, 2], [2, 3]]);
    });

    it('should handle a stream with a single chunk', async () => {
      const stream = from([42]);
      const resultStream = pipe(stream, pairwise());
      expect(await toPromise(resultStream)).toEqual([]);
    });

    it('should handle an empty stream', async () => {
      const stream = from([]);
      const resultStream = pipe(stream, pairwise());
      expect(await toPromise(resultStream)).toEqual([]);
    });
  });
}
