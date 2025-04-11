import { curry } from '../utils/curry';

/**
 * Skips a specified number of chunks in the readable stream.
 * @param count - The number of chunks to skip.
 * @returns A function that takes a readable stream and returns a new readable stream with the skipped chunks.
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
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.enqueue(4);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, skip(2));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([3, 4]);
    });
  });
}
