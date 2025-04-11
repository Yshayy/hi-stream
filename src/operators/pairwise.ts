/**
 * Emits pairs of consecutive chunks from the readable stream.
 * @returns A function that takes a readable stream and returns a new readable stream with pairs of consecutive chunks.
 */
export function pairwise<T>(): (readableStream: ReadableStream<T>) => ReadableStream<[T, T]> {
  return (readableStream: ReadableStream<T>) => {
    let previous: T | undefined;
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (previous !== undefined) {
          controller.enqueue([previous, chunk]);
        }
        previous = chunk;
      }
    });

    return readableStream.pipeThrough(transformStream);
  };
}

// Tests for pairwise function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { pipe } = await import('../utils/pipe');

  describe('pairwise', () => {
    it('should emit pairs of consecutive chunks', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, pairwise());

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([[1, 2], [2, 3]]);
    });

    it('should handle a stream with a single chunk', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(42);
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, pairwise());

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([]);
    });

    it('should handle an empty stream', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.close();
        }
      });

      const transformStream = pipe(readableStream, pairwise());

      const reader = transformStream.getReader();
      const result = [];
      let readResult;
      while (!(readResult = await reader.read()).done) {
        result.push(readResult.value);
      }

      expect(result).toEqual([]);
    });
  });
}
