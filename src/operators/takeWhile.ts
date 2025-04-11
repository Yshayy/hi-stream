import { curry } from '../utils/curry';

/**
 * Takes chunks from the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @returns A function that takes a readable stream and returns a new readable stream with the taken chunks.
 */
export function takeWhile<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T> {
  return curry(takeWhileStream)(predicate);
}

/**
 * Takes chunks from the readable stream while a predicate function is true.
 * @param predicate - The predicate function to apply to each chunk.
 * @param readableStream - The readable stream to take chunks from.
 * @returns A new readable stream with the taken chunks.
 */
export function takeWhileStream<T>(predicate: (chunk: T) => boolean, readableStream: ReadableStream<T>): ReadableStream<T> {
  let taking = true;
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      if (taking && predicate(chunk)) {
        controller.enqueue(chunk);
      } else {
        taking = false;
        controller.terminate();
      }
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for takeWhile function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('takeWhile', () => {
    it('should take chunks while the predicate is true', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.enqueue(4);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, takeWhile((x: number) => x < 3));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([1, 2]);
    });
  });
}
