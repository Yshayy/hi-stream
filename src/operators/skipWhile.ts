import { curry } from '../utils/curry';

/**
 * Skips chunks in the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the skipped chunks.
 */
export function skipWhile<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(skipWhileStream)(predicate);
}

/**
 * Skips chunks in the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @param readableStream - The readable stream to skip chunks from.
 * @returns A new readable stream with the skipped chunks.
 */
export function skipWhileStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T> {
  let skipping = true;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (skipping && predicate(chunk)) {
        return;
      }
      skipping = false;
      controller.enqueue(chunk);
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for skipWhile function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('skipWhile', () => {
    it('should skip chunks while the predicate is true', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.enqueue(4);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, skipWhile((x: number) => x < 3));

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
