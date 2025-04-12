# hi-stream 🚀

Welcome to **hi-stream**! This library provides higher-order utility functions for working with web streams' readable streams. It offers an Rx/Ix-like API with operators such as `map`, `flatMap`, `scan`, and more. The library leverages transform streams internally for operators and integrates with promises and async iterables. It supports tacit style programming by currying all operators and provides utilities for currying and piping functions.

## Benefits of Using This Library 🌟

- **Target Modern Environments**: This library is designed to work seamlessly with modern environments such as WinterCG, Node.js, Deno, Bun, and browsers.
- **Native Support for Async Iterators**: Webstreams work natively with async iterators and `for...await` syntax, making it easy and idiomatic to consume streams.
- **Ease of Use with LLM Libraries**: This library is easy to work with LLM libraries that have adopted webstreams for representing AI streams.

## Installation 📦

To install the library, use npm or yarn:

```sh
npm install hi-stream
```

or

```sh
yarn add hi-stream
```

## Usage 📚

Here are some examples of how to use the provided operators and utilities:

### Importing the library

```ts
import { map, flatMap, scan, filter, skip, skipWhile, skipUntil, take, takeWhile, takeUntil, zip, pairwise, fromPromise, toPromise, curry, pipe } from 'hi-stream';
```

### Complete Example with Multiple Operators 💡

Below is a complete example that demonstrates the usage of multiple operators with `pipe` and `for..await` consumption. This example simulates a real-world stream, such as a tweets stream.

```ts
import { from, map, filter, scan, pipe, toPromise } from 'hi-stream';

// Simulate a stream of tweets
const tweets = [
  { id: 1, text: 'Hello world', likes: 10 },
  { id: 2, text: 'Hi there', likes: 5 },
  { id: 3, text: 'JavaScript is awesome', likes: 20 },
  { id: 4, text: 'TypeScript is great', likes: 15 },
];

const tweetStream = from(tweets);

const processedTweets = pipe(
  tweetStream,
  filter(tweet => tweet.likes > 10),
  map(tweet => ({ ...tweet, text: tweet.text.toUpperCase() })),
  scan((acc, tweet) => [...acc, tweet], [])
);

(async () => {
  for await (const chunk of processedTweets) {
    console.log(chunk);
  }
})();
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
const stream = from([1,2,3])
await pipe(stream, filter(x=>x%2===0), toPromise) // Output: [2]
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
const stream = from([1,2,3])
await pipe(stream, flatMap(x=>[x,x*2]), toPromise) // Output: [1,2,2,4,3,6]
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
const stream = from([1,2,3])
await pipe(stream, map(x=>x*2), toPromise) // Output: [2,4,6]
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
const stream = from([1,2,3])
await pipe(stream, pairwise(), toPromise) // Output: [[1,2],[2,3]]
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
const stream = from([1,2,3])
await pipe(stream, scan((acc,x)=>acc+x,0), toPromise) // Output: [1,3,6]
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
const stream = from([1,2,3,4])
await pipe(stream, skip(2), toPromise) // Output: [3,4]
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
const stream = from([1,2,3,4])
await pipe(stream, skipUntil(x=>x>=3), toPromise) // Output: [3,4]
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
const stream = from([1,2,3,4])
await pipe(stream, skipWhile(x=>x<3), toPromise) // Output: [3,4]
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
const stream = from([1,2,3,4])
await pipe(stream, take(2), toPromise) // Output: [1,2]
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
const stream = from([1,2,3,4])
await pipe(stream, takeUntil(x=>x>=3), toPromise) // Output: [1,2]
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

## Project Status and Contributions 🚧

This project is in its early stages but is functional and working. It has been generated completely by the Copilot workspace AI agent. Contributions are welcome, and you can open issues for any bugs or feature requests. The implementation is driven and maintained by AI with human reviews.
