export const ReadableStream: typeof import("stream/web").ReadableStream =
  globalThis.ReadableStream as any;
export const TransformStream: typeof import("stream/web").TransformStream =
  globalThis.TransformStream as any;

export type ReadableStream<T = unknown> = import("stream/web").ReadableStream<T>;
export type TransformStream<T = unknown, U = unknown> = import("stream/web").TransformStream<T, U>;
