const assert = require('node:assert/strict');
const test = require('node:test');
const { fluid } = require('../lib/fluid');

test('set should set value', function () {
  const f = fluid({ p: { a: 5 } });
  f.set('p', 'b', 7).set('p', 'a', 8);
  assert.deepEqual(f.data, {
    p: { a: 8, b: 7 }
  });
});

test('soft should preserve existing value', function () {
  const f = fluid({ p: { a: 'old' } });
  f.soft('p', 'b', 7).soft('p', 'a', 'new');
  assert.deepEqual(f.data, {
    p: { a: 'old', b: 7 }
  });
});

test('set without key should reuse last key', function () {
  const f = fluid({ p: { a: 5 } });
  f.set('p', 'b', 7).set(undefined, 'd', 8);
  assert.deepEqual(f.data, {
    p: { a: 5, b: 7, d: 8 }
  });
});

test('many soft', function () {
  const f = fluid({ p: { a: 5 } });
  f.soft('q', 'b', 7).soft('r', 'a', 8);
  assert.deepEqual(f.data, {
    p: { a: 5 },
    q: { b: 7 },
    r: { a: 8 }
  });
});

test('setAll should update all keys', function () {
  const f = fluid({ p: { a: 5 } });
  f.setAll(['q', 'r'], 'b', 15);
  assert.deepEqual(f.data, {
    p: { a: 5 },
    q: { b: 15 },
    r: { b: 15 }
  });
});

test('setAll should overwrite existing values', function () {
  const f = fluid({ p: { a: 5, d: 0 } });
  f.setAll(['p', 'q', 'r'], 'a', 15);
  assert.deepEqual(f.data, {
    p: { a: 15, d: 0 },
    q: { a: 15 },
    r: { a: 15 }
  });
});
