# hi-stream 🚀

**Supercharge your Web Streams with familiar, powerful operators!**

Welcome to **hi-stream**! If you're working with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) (specifically `ReadableStream`), `hi-stream` makes your life easier. It provides a rich set of **higher-order utility functions** inspired by reactive programming libraries like [RxJS](https://rxjs.dev/) and [IxJS](https://github.com/ReactiveX/IxJS), allowing you to manipulate streams with operators like `map`, `filter`, `flatMap`, `scan`, and many more.

`hi-stream` embraces modern JavaScript features, leveraging native `TransformStream` for performance and integrating seamlessly with `Promise`s and `async/await` iteration. It's designed with a functional approach, offering curried operators and utilities like `pipe` for elegant, point-free style programming.

## ✨ Why Choose hi-stream?

* **Simplified Stream Manipulation:** Forget manual stream plumbing. Use intuitive operators you might already know from libraries like RxJS/IxJS.
* **Modern & Compatible:** Built for today's JavaScript environments:
    * [Node.js](https://nodejs.org/)
    * [Deno](https://deno.land/)
    * [Bun](https://bun.sh/)
    * Browsers
    * [WinterCG](https://wintercg.org/) runtimes (Cloudflare Workers, etc.)
* **Async Native:** Works perfectly with `async function*` and the `for await...of` loop, the standard way to consume Web Streams.
* **Performant:** Utilizes the browser's (or runtime's) built-in `TransformStream` mechanism for efficient data processing.
* **Functional Programming Friendly:** All operators are automatically curried, enabling easy composition using functions like `pipe`.
* **LLM & AI Ready:** Web Streams are increasingly used by AI/LLM libraries (like Langchain, OpenAI SDK) to handle streaming responses. `hi-stream` makes processing these streams straightforward.
* **TypeScript First:** Written in TypeScript for strong typing and improved developer experience.

## 📦 Installation

Choose your favorite package manager:

```bash
# npm
npm install hi-stream

# yarn
yarn add hi-stream

# pnpm
pnpm add hi-stream
```

## 📚 Usage Examples

Get started quickly with these examples:

### Importing Operators

```typescript
import {
  from, // Create streams from iterables, promises, etc.
  pipe, // Chain operators together
  map, filter, scan, flatMap, // Common operators
  take, skip, takeWhile, skipWhile, // Filtering/limiting operators
  zip, pairwise, // Combination operators
  toPromise, // Convert stream result back to a Promise
  curry, // Utility for currying functions (operators are pre-curried)
  // ... and more!
} from 'hi-stream';
```

### Basic Transformation

Let's create a stream from an array, filter it, and map the values.

```typescript
import { from, pipe, filter, map } from 'hi-stream';

const numbers = [1, 2, 3, 4, 5, 6];
const numberStream = from(numbers); // Create a ReadableStream

const processedStream = pipe(
  numberStream,
  filter(n => n % 2 === 0),    // Keep only even numbers
  map(n => n * 10)             // Multiply them by 10
);

for await (const value of processedStream) {
  console.log(value);
  // Output:
  // 20
  // 40
  // 60
}
```

### Processing a Stream of Objects (e.g., Tweets)

This example demonstrates chaining multiple operators to process a stream resembling real-world data, like tweets.

```typescript
import { from, pipe, filter, map, scan } from 'hi-stream';

// Simulate a stream of tweet objects
const tweets = [
  { id: 1, text: 'Hello world', likes: 10 },
  { id: 2, text: 'Hi there', likes: 5 },
  { id: 3, text: 'JavaScript is awesome', likes: 20 },
  { id: 4, text: 'TypeScript is great', likes: 15 },
];

const tweetStream = from(tweets); // Create stream from array

// Define the processing pipeline
const processedTweets = pipe(
  tweetStream,
  filter(tweet => tweet.likes > 10), // Only keep tweets with more than 10 likes
  map(tweet => ({ ...tweet, text: tweet.text.toUpperCase() })), // Uppercase the text
  // Accumulate results: scan emits the intermediate accumulated array for each input item
  scan((accumulator, currentTweet) => [...accumulator, currentTweet], [])
);
for await (const chunk of processedTweets) {
  // scan emits the accumulated array at each step
  console.log('Current accumulated popular tweets:', chunk);
}
console.log('Stream finished.');

/* Output:
Processing tweet stream...
Current accumulated popular tweets: [ { id: 3, text: 'JAVASCRIPT IS AWESOME', likes: 20 } ]
Current accumulated popular tweets: [ { id: 3, text: 'JAVASCRIPT IS AWESOME', likes: 20 }, { id: 4, text: 'TYPESCRIPT IS GREAT', likes: 15 } ]
Stream finished.
*/
```

## Operators

<!-- OPERATORS_BEGIN -->
### buffer

**Signature:**
```ts
export function buffer<T>(predicate: (chunk: T) => boolean): (readableStream: ReadableStream<T>) => ReadableStream<T[]>;
```

**Description:**
Buffers chunks in the readable stream based on a predicate function.

<details><summary>Example</summary>

```ts
const stream = from([1, 2, 3, 4, 5]);
const resultStream = pipe(stream, buffer(x => x % 2 === 0));
await toPromise(resultStream); // Output: [[1, 2], [3, 4], [5]]
```

</details>

### bufferCount

**Signature:**
```ts
export function bufferCount<T>(count: number): (readableStream: ReadableStream<T>) => ReadableStream<T[]>;
```

**Description:**
Buffers a specified number of items in the readable stream.

<details><summary>Example</summary>

```ts
const stream = from([1, 2, 3, 4, 5]);
const resultStream = pipe(stream, bufferCount(2));
await toPromise(resultStream); // Output: [[1, 2], [3, 4], [5]]
```

</details>

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
const stream1 = from([1,2,3])
const stream2 = from(['a','b','c'])
await pipe(stream1, zip(stream2), toPromise) // Output: [[1,'a'],[2,'b'],[3,'c']]
```

</details>
<!-- OPERATORS_END -->

## Project Status and Contributions 🚧

This project is in its early stages but is functional and working. It has been generated completely by the Copilot workspace AI agent. Contributions are welcome, and you can open issues for any bugs or feature requests. The implementation is driven and maintained by AI with human reviews.
