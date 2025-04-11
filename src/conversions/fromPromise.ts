import { ReadableStream } from 'web-streams-polyfill/ponyfill';

export function fromPromise<T>(promise: Promise<T>): ReadableStream<T> {
  return new ReadableStream({
    start(controller) {
      promise
        .then(value => {
          controller.enqueue(value);
          controller.close();
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            controller.error(err);
          } else {
            controller.error(new Error(String(err)));
          }
        });
    }
  });
}

// Tests for fromPromise function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('fromPromise', () => {
    it('should create a readable stream from a resolved promise', async () => {
      const promise = Promise.resolve(42);
      const readableStream = fromPromise(promise);
      const reader = readableStream.getReader();
      const { value, done } = await reader.read();
      expect(value).toBe(42);
      expect(done).toBe(false);
    });

    it('should handle a rejected promise', async () => {
      const promise = Promise.reject(new Error('Test error'));
      const readableStream = fromPromise(promise);
      const reader = readableStream.getReader();
      try {
        await reader.read();
      } catch (err) {
        expect(err instanceof Error ? err.message : String(err)).toBe('Test error');
      }
    });
  });
}
