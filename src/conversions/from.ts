export function from<T>(array: T[]): ReadableStream<T> {
  return new ReadableStream({
    start(controller) {
      for (const item of array) {
        controller.enqueue(item);
      }
      controller.close();
    }
  });
}

// Tests for from function using vitest
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('from', () => {
    it('should create a readable stream from an array', async () => {
      const array = [1, 2, 3];
      const resultStream = from(array);
      const result = [];
      for await (const chunk of resultStream) {
        result.push(chunk);
      }
      expect(result).toEqual(array);
    });

    it('should handle an empty array', async () => {
      const array: number[] = [];
      const resultStream = from(array);
      const result = [];
      for await (const chunk of resultStream) {
        result.push(chunk);
      }
      expect(result).toEqual(array);
    });

    it('should handle an array with a single element', async () => {
      const array = [42];
      const resultStream = from(array);
      const result = [];
      for await (const chunk of resultStream) {
        result.push(chunk);
      }
      expect(result).toEqual(array);
    });
  });
}
