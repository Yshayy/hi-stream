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

### Using `map` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const transformStream = map((x: number) => x * 2);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 2
});
```

### Using `flatMap` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const transformStream = flatMap((x: number) => [x, x * 2]);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 1
});
```

### Using `scan` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const transformStream = scan((acc: number, x: number) => acc + x, 0);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 1
});
```

### Using `filter` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const transformStream = filter((x: number) => x % 2 === 0);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 2
});
```

### Using `skip` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = skip(2);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 3
});
```

### Using `skipWhile` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = skipWhile((x: number) => x < 3);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 3
});
```

### Using `skipUntil` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = skipUntil((x: number) => x >= 3);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 3
});
```

### Using `take` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = take(2);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 1
});
```

### Using `takeWhile` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = takeWhile((x: number) => x < 3);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 1
});
```

### Using `takeUntil` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.enqueue(4);
    controller.close();
  }
});

const transformStream = takeUntil((x: number) => x >= 3);

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // 1
});
```

### Using `zip` operator

```ts
const readableStream1 = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const readableStream2 = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
    controller.close();
  }
});

const transformStream = zip(readableStream2);

const reader = transformStream(readableStream1).getReader();
reader.read().then(({ value }) => {
  console.log(value); // [1, 'a']
});
```

### Using `pairwise` operator

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

const transformStream = pairwise();

const reader = transformStream(readableStream).getReader();
reader.read().then(({ value }) => {
  console.log(value); // [1, 2]
});
```

### Using `fromPromise` and `toPromise` functions

```ts
const promise = Promise.resolve(42);
const readableStream = fromPromise(promise);

toPromise(readableStream).then(value => {
  console.log(value); // 42
});
```

### Using `curry` and `pipe` utilities

```ts
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)); // 3

const multiply = (a: number, b: number) => a * b;
const addAndMultiply = pipe(curriedAdd(1), multiply(2));

console.log(addAndMultiply(3)); // 8
```

### Using async iterators for consumption of readable streams

```ts
async function consumeStream<T>(readableStream: ReadableStream<T>) {
  const reader = readableStream.getReader();
  const result = [];
  let readResult;
  while (!(readResult = await reader.read()).done) {
    result.push(readResult.value);
  }
  return result;
}

const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.enqueue(3);
    controller.close();
  }
});

consumeStream(readableStream).then(result => {
  console.log(result); // [1, 2, 3]
});
```
