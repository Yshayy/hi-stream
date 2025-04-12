# hi-stream

This library provides higher-order utility functions for working with web streams' readable streams. It offers an Rx/Ix-like API with operators such as `map`, `flatMap`, `scan`, and more. The library leverages transform streams internally for operators and integrates with promises and async iterables. It supports tacit style programming by currying all operators and provides utilities for currying and piping functions.

## Installation

To install the library, use npm or yarn:

```sh
npm install hi-stream
```

or

```sh
yarn add hi-stream
```

## Usage

Here are some examples of how to use the provided operators and utilities:

### Importing the library

```ts
import { map, flatMap, scan, filter, skip, skipWhile, skipUntil, take, takeWhile, takeUntil, zip, pairwise, fromPromise, toPromise, curry, pipe } from 'hi-stream';
```

<!-- OPERATORS_BEGIN -->
### filter

**Signature:**
```ts
export function filter<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Filters chunks in the readable stream based on a predicate function.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3])
await pipe(stream, filter(x=>x%2===0), toPromise) // Output: [2]
```
```

</details>

### flatMap

**Signature:**
```ts
export function flatMap<T, R>(fn: (chunk: T) => R[]): (readableStream: ReadableStream<T>) => ReadableStream<R>;
```

**Description:**
Applies a given function to each chunk in the readable stream and flattens the result.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3])
await pipe(stream, flatMap(x=>[x,x*2]), toPromise) // Output: [1,2,2,4,3,6]
```
```

</details>

### map

**Signature:**
```ts
export function map<T, R>(fn: (chunk: T) => R): (readableStream: ReadableStream<T>) => ReadableStream<R>;
```

**Description:**
Applies a given function to each chunk in the readable stream.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3])
await pipe(stream, map(x=>x*2), toPromise) // Output: [2,4,6]
```
```

</details>

### pairwise

**Signature:**
```ts
export function pairwise<T>(): (readableStream: ReadableStream<T>) => ReadableStream<[T, T]>;
```

**Description:**
Emits pairs of consecutive chunks from the readable stream.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3])
await pipe(stream, pairwise(), toPromise) // Output: [[1,2],[2,3]]
```
```

</details>

### scan

**Signature:**
```ts
export function scan<T, R>(fn: (acc: R, chunk: T) => R, initialValue: R): (readableStream: ReadableStream<T>) => ReadableStream<R>;
```

**Description:**
Applies a given function to each chunk in the readable stream, accumulating the result.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3])
await pipe(stream, scan((acc,x)=>acc+x,0), toPromise) // Output: [1,3,6]
```
```

</details>

### skip

**Signature:**
```ts
export function skip<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Skips a specified number of chunks in the readable stream.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, skip(2), toPromise) // Output: [3,4]
```
```

</details>

### skipUntil

**Signature:**
```ts
export function skipUntil<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Skips chunks in the readable stream until a predicate function is true.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, skipUntil(x=>x>=3), toPromise) // Output: [3,4]
```
```

</details>

### skipWhile

**Signature:**
```ts
export function skipWhile<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Skips chunks in the readable stream while a predicate function is true.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, skipWhile(x=>x<3), toPromise) // Output: [3,4]
```
```

</details>

### take

**Signature:**
```ts
export function take<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Takes a specified number of chunks from the readable stream.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, take(2), toPromise) // Output: [1,2]
```
```

</details>

### takeUntil

**Signature:**
```ts
export function takeUntil<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Takes chunks from the readable stream until a predicate function is true.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, takeUntil(x=>x>=3), toPromise) // Output: [1,2]
```
```

</details>

### takeWhile

**Signature:**
```ts
export function takeWhile<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T>;
```

**Description:**
Takes chunks from the readable stream while a predicate function is true.

<details><summary>Example</summary>

```ts
```ts
const stream = from([1,2,3,4])
await pipe(stream, takeWhile(x=>x<3), toPromise) // Output: [1,2]
```
```

</details>

### zipStreams

**Signature:**
```ts
export function zipStreams<T>(streams: ReadableStream<T>[], readableStream: ReadableStream<T>): ReadableStream<T[]>;
```

**Description:**
Combines chunks from multiple streams into a single stream.

<details><summary>Example</summary>

```ts
```ts
const stream1 = from([1,2,3])
const stream2 = from(['a','b','c'])
await pipe(stream1, zip(stream2), toPromise) // Output: [[1,'a'],[2,'b'],[3,'c']]
```
```

</details>
<!-- OPERATORS_END -->
