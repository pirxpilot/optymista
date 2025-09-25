const process = require('node:process');
const test = require('node:test');
const optymista = require('../lib/optymista');

test('boolean', t => {
  const { argv } = optymista(['--test']).boolean('test');
  t.assert.ok(argv.test);
});

test('many boolean', t => {
  const { argv } = optymista(['--test', '--fast']).boolean('test', 'fast');
  t.assert.ok(argv.test);
  t.assert.ok(argv.fast);
});

test('string', t => {
  const { argv } = optymista(['--name', 'abc']).string('name');
  t.assert.equal(argv.name, 'abc');
});

test('many string', t => {
  const { argv } = optymista(['--name', 'abc', '--value', 'def']).string('name', 'value');
  t.assert.deepEqual(argv.name, 'abc');
  t.assert.deepEqual(argv.value, 'def');
});

test('not strict', t => {
  const { argv } = optymista(['--name', 'abc']).strict(false);
  t.assert.equal(argv.name, true);
  t.assert.deepEqual(argv._, ['abc']);
});

test('describe', t => {
  const { argv } = optymista(['--name', 'freon']).string('name').describe('name', 'set the name of a thing');
  t.assert.equal(argv.name, 'freon');
});

test('default', t => {
  const { argv } = optymista([]).string('name').default('argon');
  t.assert.equal(argv.name, 'argon');
});

test('short', t => {
  const { argv } = optymista(['-n', 'argon']).string('name').short('n');
  t.assert.equal(argv.name, 'argon');
});

test('multiple', t => {
  const { argv } = optymista(['--name', 'argon', '--name', 'freon']).string('name').multiple('name');
  t.assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('multiple with short', t => {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon']).string('name').short('n').multiple();
  t.assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('option', t => {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon']).option('name', {
    short: 'n',
    multiple: true,
    type: 'string'
  });
  t.assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('options object', t => {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon']).option({
    name: { short: 'n', multiple: true, type: 'string' },
    flag: { type: 'boolean', default: true }
  });
  t.assert.deepEqual(argv.name, ['argon', 'freon']);
  t.assert.ok(argv.flag);
});

test('positionals', t => {
  const { argv } = optymista(['argon', 'freon']);
  t.assert.deepEqual(argv._, ['argon', 'freon']);
});

test('negative', t => {
  const { argv } = optymista(['--no-flag']).boolean('flag').default(true);
  t.assert.deepEqual(argv.flag, false);
});

test('specific version', t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});
  const { argv } = optymista(['--version']).version('1.2.7');
  t.assert.ok(argv.version);

  const { calls: cl } = console.log.mock;
  t.assert.strictEqual(cl.length, 1);
  t.assert.deepStrictEqual(cl[0].arguments, ['1.2.7']);

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.deepStrictEqual(pe[0].arguments, []);
});

test('unknown version', t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});
  const { argv } = optymista(['-V']).version();
  t.assert.ok(argv.version);

  const { calls: cl } = console.log.mock;
  t.assert.strictEqual(cl.length, 1);
  t.assert.deepStrictEqual(cl[0].arguments, ['unknown']);

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.deepStrictEqual(pe[0].arguments, []);
});

test('alias', t => {
  const { argv } = optymista(['-n', 'test']).string('name').alias('n', 'name');
  t.assert.equal(argv.name, 'test');
});

test('help flag', t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});
  const { argv } = optymista(['--help']);
  t.assert.ok(argv.help);

  t.assert.strictEqual(process.exit.mock.callCount(), 1);
});

test('help flag short', t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});
  const { argv } = optymista(['-h']);
  t.assert.ok(argv.help);

  t.assert.strictEqual(process.exit.mock.callCount(), 1);
});

test('usage', t => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});

  const { argv } = optymista(['--help']).usage('Usage: myapp [options]', 'Example usage here');
  t.assert.ok(argv.help);

  const { calls: cl } = console.log.mock;
  t.assert.strictEqual(cl.length, 1);
  t.assert.deepStrictEqual(cl[0].arguments, ['Usage: myapp [options]\nExample usage here\n\n']);
});

test('showHelp with custom function', t => {
  const messages = [];
  const customLog = msg => messages.push(msg);
  const parser = optymista([]).usage('Test usage');
  parser.showHelp(customLog);
  t.assert.deepStrictEqual(messages, ['Test usage\n\n']);
});

test('allowNegative false', t => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});

  const parser = optymista(['--no-flag']).boolean('flag').allowNegative(false);
  parser.argv;

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.deepStrictEqual(pe[0].arguments, [1]);
});

test('allowPositionals false', t => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});

  const parser = optymista(['arg1', 'arg2']).allowPositionals(false);
  parser.argv;

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.deepStrictEqual(pe[0].arguments, [1]);
});

test('strict mode error handling', t => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'log', () => {});
  t.mock.method(process, 'exit', () => {});

  const parser = optymista(['--unknown-flag']).strict(true);
  parser.argv;

  const { calls: ce } = console.error.mock;
  t.assert.strictEqual(ce.length, 1);
  t.assert.ok(ce[0].arguments[0].includes('Unknown option'));

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.deepStrictEqual(pe[0].arguments, [1]);
});

test('default with object', t => {
  const { argv } = optymista([]).string('name', 'count').default({
    name: 'default-name',
    count: '42'
  });
  t.assert.equal(argv.name, 'default-name');
  t.assert.equal(argv.count, '42');
});

test('describe with object', t => {
  const { argv } = optymista(['--name', 'test']).string('name').describe({
    name: 'The name option',
    other: 'Another option'
  });
  t.assert.equal(argv.name, 'test');
});
