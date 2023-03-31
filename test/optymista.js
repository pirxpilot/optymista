const assert = require('node:assert/strict');
const test = require('node:test');
const optymista = require('../lib/optymista');

test('boolean', function () {
  const { argv } = optymista(['--test']).boolean('test');
  assert.ok(argv.test);
});

test('string', function () {
  const { argv } = optymista(['--name', 'abc']).string('name');
  assert.equal(argv.name, 'abc');
});

test('describe', function () {
  const { argv } = optymista(['--name', 'freon'])
    .string('name').describe('name', 'set the name of a thing');
  assert.equal(argv.name, 'freon');
});

test('describe', function () {
  const { argv } = optymista([])
    .string('name').default('argon');
  assert.equal(argv.name, 'argon');
});

test('short', function () {
  const { argv } = optymista(['-n', 'argon'])
    .string('name').short('n');
  assert.equal(argv.name, 'argon');
});

test('multiple', function () {
  const { argv } = optymista(['--name', 'argon', '--name', 'freon'])
    .string('name').multiple('name');
  assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('multiple with short', function () {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon'])
    .string('name').short('n').multiple();
  assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('option', function () {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon'])
    .option('name', { short: 'n', multiple: true, type: 'string' });
  assert.deepEqual(argv.name, ['argon', 'freon']);
});

test('option', function () {
  const { argv } = optymista(['-n', 'argon', '--name', 'freon'])
    .option({
      name: { short: 'n', multiple: true, type: 'string' },
      flag: { type: 'boolean', default: true }
    });
  assert.deepEqual(argv.name, ['argon', 'freon']);
  assert.ok(argv.flag);
});
