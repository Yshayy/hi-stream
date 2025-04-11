import { ReadableStream, TransformStream } from '../core';
import { curry } from '../utils/curry';

/**
 * Combines chunks from multiple streams into a single stream.
 * @param streams - The streams to combine.
 * @returns A function that takes a readable stream and returns a new readable stream with the combined chunks.
 */
export function zip<T>(...streams: ReadableStream<T>[]): (readableStream: ReadableStream<T>) => ReadableStream<T[]> {
  return curry(zipStreams)(streams);
}

/**
 * Combines chunks from multiple streams into a single stream.
 * @param streams - The streams to combine.
 * @param readableStream - The readable stream to transform.
 * @returns A new readable stream with the combined chunks.
 */
export function zipStreams<T>(streams: ReadableStream<T>[], readableStream: ReadableStream<T>): ReadableStream<T[]> {
  const readers = streams.map(stream => stream.getReader());

  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const results = [chunk];
      for (const reader of readers) {
        const { value, done } = await reader.read();
        if (done) {
          controller.terminate();
          return;
        }
        results.push(value);
      }
      controller.enqueue(results);
    }
  });

  return readableStream.pipeThrough(transformStream);
}

// Tests for zip function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('zip', () => {
    it('should combine chunks from multiple streams', async () => {
      const readableStream1 = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const readableStream2 = new ReadableStream({
        start(controller) {
          controller.enqueue('a');
          controller.enqueue('b');
          controller.enqueue('c');
          controller.close();
        }
      });

      const transformStream = pipe(readableStream1, zip(readableStream2));

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });
  });
}
