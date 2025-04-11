import { curry } from '../utils/curry';

/**
 * Applies a given function to each chunk in the readable stream.
 * @param fn - The function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the transformed chunks.
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
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, map((x: number) => x * 2));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([2, 4, 6]);
    });
  });
}
