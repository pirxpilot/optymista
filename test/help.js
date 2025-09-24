const test = require('node:test');
const { readFile } = require('node:fs/promises');
const { help } = require('../lib/help');

test('empty', t => {
  const s = help();
  t.assert.equal('', s);
});

test('no options', t => {
  const s = help(['some', 'info text']);
  t.assert.equal(s, 'some\ninfo text\n\n');
});

test('options', async t => {
  const s = help([], {
    name: {
      description: 'Name of the thing',
      short: 'n',
      type: 'string',
      default: 'boom'
    },
    place: { short: 'p', type: 'string' },
    verbose: { description: 'Print everything', type: 'boolean' }
  });
  const expected = await readFile(`${__dirname}/fixtures/no-usage.txt`, 'utf-8');
  t.assert.equal(s, expected);
});

test('usage and options', async t => {
  const s = help(['Test some things'], {
    name: {
      description: 'Name of the thing',
      short: 'n',
      type: 'string',
      default: 'boom'
    },
    place: { short: 'p', type: 'string' },
    verbose: { description: 'Print everything', type: 'boolean' }
  });
  const expected = await readFile(`${__dirname}/fixtures/help.txt`, 'utf-8');
  t.assert.equal(s, expected);
});
