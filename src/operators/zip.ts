import { curry } from '../utils/curry';
import { from } from '../conversions/from';
import { toPromise } from '../conversions/toPromise';

/**
 * Combines chunks from multiple streams into a single stream.
 * @param streams - The streams to combine.
 * @returns A function that takes a readable stream and returns a new readable stream with the combined chunks.
 * 
 * @example
 * ```ts
 * const stream1 = from([1,2,3])
 * const stream2 = from(['a','b','c'])
 * await pipe(stream1, zip(stream2), toPromise) // Output: [[1,'a'],[2,'b'],[3,'c']]
 * ```
 */
export function zip<T1>(stream1: ReadableStream<T1>): <T>(readableStream: ReadableStream<T>) => ReadableStream<[T, T1]>;
export function zip<T1, T2>(stream1: ReadableStream<T1>, stream2: ReadableStream<T2>): <T>(readableStream: ReadableStream<T>) => ReadableStream<[T, T1, T2]>;
export function zip<T1, T2, T3>(stream1: ReadableStream<T1>, stream2: ReadableStream<T2>, stream3: ReadableStream<T3>): <T>(readableStream: ReadableStream<T>) => ReadableStream<[T, T1, T2, T3]>;
export function zip<T1, T2, T3, T4>(stream1: ReadableStream<T1>, stream2: ReadableStream<T2>, stream3: ReadableStream<T3>, stream4: ReadableStream<T4>): <T>(readableStream: ReadableStream<T>) => ReadableStream<[T, T1, T2, T3, T4]>;
export function zip<T>(...streams: ReadableStream<any>[]): (readableStream: ReadableStream<T>) => ReadableStream<any[]> {
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
      const stream = from([1, 2, 3]);
      const resultStream = from(['a', 'b', 'c']);

      const combinedStream = pipe(stream, zip(resultStream));
      expect(await toPromise(combinedStream)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
    });
  });
}
