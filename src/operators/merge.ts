/**
 * Merges multiple readable streams into a single readable stream.
 * @param streams - The streams to merge.
 * @returns A new readable stream with the merged chunks.
 * 
 * @example
 * const stream1 = from([1, 2, 3]);
 * const stream2 = from(['a', 'b', 'c']);
 * const mergedStream = merge([stream1, stream2]);
 * for await (const chunk of mergedStream) {
 *   console.log(chunk);
 *   // Output:
 *   // 1
 *   // 'a'
 *   // 2
 *   // 'b'
 *   // 3
 *   // 'c'
 * }
 */
export const merge = <T>(streams: ReadableStream<T>[]) => {
  let readers = streams.map(stream => stream.getReader())
  const readersRead = new WeakMap<ReadableStreamDefaultReader<T>, Promise<{done: boolean, value: T | undefined}>>()
  async function read(reader: ReadableStreamDefaultReader<T>){
    if (readersRead.has(reader)) {
      return readersRead.get(reader)!
    }
    const promise = reader.read().then(({done, value}) => {
        readersRead.delete(reader)
        if (done) {
          readers = readers.filter(r => r !== reader)
        }
        return {done, value}
    })
    readersRead.set(reader, promise)
    return promise
  }
  return new ReadableStream<T>({
    async pull(controller) {
      if (readers.length === 0) {
        controller.close()
        return
      }
      while (readers.length > 0){
        const {value, done} = await Promise.race(readers.map(read))
        if (!done){
          controller.enqueue(value)
          return;
        }
      }
      controller.close()
    },
    async cancel(reason) {
      await Promise.allSettled(readers.map(reader => reader.cancel(reason)))
    },
  })
}

// Tests for merge function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { from } = await import('../conversions/from');
  const { toPromise } = await import('../conversions/toPromise');

  describe('merge', () => {
    it('should merge multiple streams into a single stream', async () => {
      const stream1 = from([1, 2, 3]);
      const stream2 = from(['a', 'b', 'c']);
      const mergedStream = merge([stream1, stream2]);
      const result = await toPromise(mergedStream);
      expect(result).toEqual(expect.arrayContaining([1, 'a', 2, 'b', 3, 'c']));
    });

    it('should handle streams with different lengths', async () => {
      const stream1 = from([1, 2]);
      const stream2 = from(['a', 'b', 'c']);
      const mergedStream = merge([stream1, stream2]);
      const result = await toPromise(mergedStream);
      expect(result).toEqual(expect.arrayContaining([1, 'a', 2, 'b', 'c']));
    });

    it('should handle an empty stream', async () => {
      const stream1 = from([]);
      const stream2 = from(['a', 'b', 'c']);
      const mergedStream = merge([stream1, stream2]);
      const result = await toPromise(mergedStream);
      expect(result).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    });

    it('should not drop values', async () => {
      const stream1 = from([1, 2, 3]);
      const stream2 = from(['a', 'b', 'c']);
      const mergedStream = merge([stream1, stream2]);
      const result = await toPromise(mergedStream);
      expect(result).toEqual(expect.arrayContaining([1, 'a', 2, 'b', 3, 'c']));
    });
  });
}
