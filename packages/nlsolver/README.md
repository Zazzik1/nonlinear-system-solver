# nlsolver

> 🏗️ **Work in progress**

A TypeScript-based numerical solver for systems of nonlinear equations with custom variable names.

# Usage

## CLI

Run nlsolver directly with npx:

```sh
npx @zazzik/nlsolver@latest
```

## CommonJS

```js
const { tokenize, parse, evaluate } = require('@zazzik/nlsolver');

const tokens = tokenize('2 * 2');
const result = evaluate(parse(tokens));

console.log(result); // [4]
```

## ESM

```js
import { tokenize, parse, evaluate } from '@zazzik/nlsolver';

const tokens = tokenize('3 + 3; 2 * 4');
const result = evaluate(parse(tokens));

console.log(result); // [6, 8]
```
