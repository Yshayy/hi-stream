import { curry } from '../utils/curry';

/**
 * Applies a given function to each chunk in the readable stream, accumulating the result.
 * @param fn - The function to apply to each chunk.
 * @param initialValue - The initial value for the accumulator.
 * @returns A function that takes a readable stream and returns a new readable stream with the accumulated result.
 */
export function scan<T, R>(fn: (acc: R, chunk: T) => R, initialValue: R): (readableStream: ReadableStream<T>) => ReadableStream<R> {
  return curry(scanStream)(fn, initialValue);
}

/**
 * Applies a given function to each chunk in the readable stream, accumulating the result.
 * @param fn - The function to apply to each chunk.
 * @param initialValue - The initial value for the accumulator.
 * @param readableStream - The readable stream to transform.
 * @returns A new readable stream with the accumulated result.
 */
export function scanStream<T, R>(fn: (acc: R, chunk: T) => R, initialValue: R, readableStream: ReadableStream<T>): ReadableStream<R> {
  let accumulator = initialValue;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      accumulator = fn(accumulator, chunk);
      controller.enqueue(accumulator);
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for scan function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('scan', () => {
    it('should accumulate values using the provided function and initial value', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, scan((acc: number, x: number) => acc + x, 0));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([1, 3, 6]);
    });
  });
}
