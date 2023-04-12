const assert = require('node:assert/strict');
const test = require('node:test');
const { readFile } = require('node:fs/promises');
const { help } = require('../lib/help');

test('empty', function () {
  const s = help();
  assert.equal('', s);
});


test('no options', function () {
  const s = help(['some','info text']);
  assert.equal(s, 'some\ninfo text\n\n');
});

test('options', async function () {
  const s = help([], {
    name: { description: 'Name of the thing', short: 'n', type: 'string', default: 'boom' },
    place: { short: 'p', type: 'string' },
    verbose: { description: 'Print everything', type: 'boolean' }
  });
  const expected = await readFile(__dirname + '/fixtures/no-usage.txt', 'utf-8');
  assert.equal(s, expected);
});

test('usage and options', async function () {
  const s = help(['Test some things'], {
    name: { description: 'Name of the thing', short: 'n', type: 'string', default: 'boom' },
    place: { short: 'p', type: 'string' },
    verbose: { description: 'Print everything', type: 'boolean' }
  });
  const expected = await readFile(__dirname + '/fixtures/help.txt', 'utf-8');
  assert.equal(s, expected);
});
