[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# optymista

Argv parser. Like [`optimist`][optimist] but using node's [`util.parseArgs`][util-parse-args].

## Install

```sh
$ npm install --save optymista
```

## Usage

```js
const { argv } = require('optymista')
  .boolean('verbose').describe('says everything')
  .describe('name', 'name of the thing').short('N').default('argon');

if (argv.verbose) {
  console.log('starting');
}

console.log('name:', argv.name);
```

## API

Fluid API with `boolean()`, `string()`, `describe()`, `default()`, `multiple()`.

`-h|--help` is automatically implemented.

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/optymista
[npm-url]: https://npmjs.org/package/optymista

[build-url]: https://github.com/pirxpilot/optymista/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/optymista/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/optymista
[deps-url]: https://libraries.io/npm/optymista

[util-parse-args]: https://nodejs.org/api/util.html#utilparseargsconfig
[optimist]: https://img.shields.io/npm/v/optimist
