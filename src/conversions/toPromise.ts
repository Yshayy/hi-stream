export function toPromise<T>(readableStream: ReadableStream<T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = readableStream.getReader();
    const chunks: T[] = [];

    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          resolve(chunks);
        } else {
          chunks.push(value);
          read();
        }
      }).catch(reject);
    }

    read();
  });
}

// Tests for toPromise function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('toPromise', () => {
    it('should resolve a promise with accumulated chunks from the stream', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.enqueue(3);
          controller.close();
        }
      });

      const result = await toPromise(readableStream);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle an empty stream', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.close();
        }
      });

      const result = await toPromise(readableStream);
      expect(result).toEqual([]);
    });

    it('should handle a stream with a single chunk', async () => {
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(42);
          controller.close();
        }
      });

      const result = await toPromise(readableStream);
      expect(result).toEqual([42]);
    });
  });
}
