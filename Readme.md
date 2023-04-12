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
  .usage('noble-gas [options]')
  .boolean('verbose').describe('says everything')
  .describe('name', 'name of the gas').short('N').default('argon');

if (argv.verbose) {
  console.log('starting');
}

console.log('name:', argv.name);
```

## API

Fluid API corresponding to [`util.parseArgs`][util-parse-args] options:

- `boolean()`, `string()` - set option type to `boolean` or `string` - `boolean` is the default
- `default()` - sets option default value
- `multiple()` - option can be provided multiple times and all values will be collected in an array
- `short()` - provides a one letter alternative to longer POSIX style option
- `option()` - can be used to directly provide one or more option properties
- `version()` - implements `--version,-V` support - if no version is passed `optymista` will try to read
  one from the `package.json` file

Help is automatically generated based on the information provided through `usage` and `descibe`

- `usage()` - one or more strings that will form help text header
- `describe()` - option description
- `showHelp()` - display the help text on standard output 

`-h|--help` is automatically added to the list of options and treated as a request to show help text.

In case of any parsing errors help and the message associated with thrown exception is displayed.

Methods can be chained with option name used only in the first method:

```js
string('width').short('w').string('height').short('h')
```

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[npm-image]: https://img.shields.io/npm/v/optymista
[npm-url]: https://npmjs.org/package/optymista

[build-url]: https://github.com/pirxpilot/optymista/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/optymista/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/optymista
[deps-url]: https://libraries.io/npm/optymista

[util-parse-args]: https://nodejs.org/api/util.html#utilparseargsconfig
[optimist]: https://npmjs.org/package/optimist
