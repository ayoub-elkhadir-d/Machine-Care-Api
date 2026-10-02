const test = require('node:test');
const assert = require('node:assert/strict');

test('app can be loaded without throwing', () => {
  assert.doesNotThrow(() => require('../src/app'));
});
