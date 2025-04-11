import { curry } from '../utils/curry';

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
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.enqueue(4);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, take(2));

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
