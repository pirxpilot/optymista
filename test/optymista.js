const test = require('node:test');
const optymista = require('../lib/optymista');

test('boolean', t => {
  const { argv } = optymista(['--test']).boolean('test');
  t.assert.ok(argv.test);
});

test('string', t => {
  const { argv } = optymista(['--name', 'abc']).string('name');
  t.assert.equal(argv.name, 'abc');
});

test('strict', t => {
  const { argv } = optymista(['--name', 'abc']).strict(false);
  t.assert.equal(argv.name, true);
  t.assert.deepEqual(argv._, ['abc']);
});

test('describe', t => {
  const { argv } = optymista(['--name', 'freon']).string('name').describe('name', 'set the name of a thing');
  t.assert.equal(argv.name, 'freon');
});

test('describe', t => {
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

test('option', t => {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon']).option({
    name: { short: 'n', multiple: true, type: 'string' },
    flag: { type: 'boolean', default: true }
  });
  t.assert.deepEqual(argv.name, ['argon', 'freon']);
  t.assert.ok(argv.flag);
});

test('specific version', t => {
  t.mock.method(console, 'log');
  t.mock.method(process, 'exit');
  const { argv } = optymista(['--version']).version('1.2.7');
  t.assert.ok(argv.version);

  const { calls: cl } = console.log.mock;
  t.assert.strictEqual(cl.length, 1);
  t.assert.strictEqual(cl[0].arguments, ['1.2.7']);

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.strictEqual(pe[0].arguments, 0);
});

test('unknown version', t => {
  t.mock.method(console, 'log');
  t.mock.method(process, 'exit');
  const { argv } = optymista(['-V']).version();
  t.assert.ok(argv.version);

  const { calls: cl } = console.log.mock;
  t.assert.strictEqual(cl.length, 1);
  t.assert.strictEqual(cl[0].arguments, ['unknown']);

  const { calls: pe } = process.exit.mock;
  t.assert.strictEqual(pe.length, 1);
  t.assert.strictEqual(pe[0].arguments, 0);
});
