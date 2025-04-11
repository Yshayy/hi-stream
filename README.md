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
