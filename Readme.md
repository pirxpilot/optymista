[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]

# optymista

Argv parser. Like [`optimist`][optimist] but using node's [`util.parseArgs`][util-parse-args].

## Install

```sh
$ npm install --save optymista
```

## Usage

### Basic Example

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

### Working with Different Option Types

```js
const { argv } = require('optymista')
  .usage('my-app [options]')
  .string('config').describe('path to config file').short('c')
  .boolean('dry-run').describe('show what would be done without executing')
  .string('output').describe('output directory').short('o').default('./dist')
  .boolean('verbose').describe('enable verbose logging').short('v');

console.log('Config file:', argv.config || 'default');
console.log('Output directory:', argv.output);
console.log('Dry run mode:', argv['dry-run'] ? 'enabled' : 'disabled');
console.log('Verbose logging:', argv.verbose ? 'on' : 'off');
```

### Multiple Values and Short Options

```js
const { argv } = require('optymista')
  .usage('bundler --input <files...> [options]')
  .string('input').multiple().describe('input files to process').short('i')
  .string('exclude').multiple().describe('patterns to exclude')
  .boolean('minify').describe('minify output').short('m')
  .string('target').describe('target environment').default('es2020');

console.log('Input files:', argv.input || []);
console.log('Exclude patterns:', argv.exclude || []);
console.log('Minify:', argv.minify);
console.log('Target:', argv.target);
```

### Using option()

```js
const { argv } = require('optymista')
  .usage('server [options]')
  .option('port', {
    type: 'string',
    short: 'p',
    default: '3000',
    description: 'server port number'
  })
  .option('host', {
    type: 'string',
    default: 'localhost',
    description: 'server hostname'
  })
  .boolean('ssl').describe('enable SSL/HTTPS');

console.log(`Server will run on ${argv.ssl ? 'https' : 'http'}://${argv.host}:${argv.port}`);
```

### Version Support

```js
// Automatically reads version from package.json
const parser = require('optymista')
  .usage('my-tool [options]')
  .version()
  .boolean('quiet').describe('suppress output');

// Or specify version explicitly
const parser2 = require('optymista')
  .usage('my-tool [options]')
  .version('2.1.0')
  .string('format').describe('output format').default('json');
```

### Method Chaining

```js
const { argv } = require('optymista')
  .usage('image-processor [options]')
  .string('width').short('w').describe('image width').default('800')
  .string('height').short('h').describe('image height').default('600')
  .string('format').short('f').describe('output format').default('png')
  .boolean('optimize').short('O').describe('optimize output')
  .multiple('filter').describe('apply image filters');

console.log(`Processing image: ${argv.width}x${argv.height} ${argv.format}`);
if (argv.optimize) console.log('Optimization enabled');
if (argv.filter?.length) console.log('Filters:', argv.filter.join(', '));
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

[util-parse-args]: https://nodejs.org/api/util.html#utilparseargsconfig
[optimist]: https://npmjs.org/package/optimist
