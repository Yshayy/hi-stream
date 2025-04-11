import { curry } from '../utils/curry';

/**
 * Applies a given function to each chunk in the readable stream and flattens the result.
 * @param fn - The function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the transformed and flattened chunks.
 */
export function flatMap<T, R>(fn: (chunk: T) => R[]): (readableStream: ReadableStream<T>) => ReadableStream<R> {
  return curry(flatMapStream)(fn);
}

/**
 * Applies a given function to each chunk in the readable stream and flattens the result.
 * @param fn - The function to apply to each chunk.
 * @param readableStream - The readable stream to transform.
 * @returns A new readable stream with the transformed and flattened chunks.
 */
export function flatMapStream<T, R>(fn: (chunk: T) => R[], readableStream: ReadableStream<T>): ReadableStream<R> {
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const results = fn(chunk);
      for (const result of results) {
        controller.enqueue(result);
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for flatMap function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('flatMap', () => {
    it('should flatten and transform each chunk using the provided function', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, flatMap((x: number) => [x, x * 2]));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([1, 2, 2, 4, 3, 6]);
    });
  });
}
