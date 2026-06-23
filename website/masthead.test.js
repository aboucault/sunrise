const assert = require('node:assert/strict');
const test = require('node:test');

const { sunRotationForScroll } = require('./masthead.js');

test('sunRotationForScroll maps vertical scroll to clockwise degrees', () => {
  assert.equal(sunRotationForScroll(0), 0);
  assert.equal(sunRotationForScroll(120), 42);
});

test('sunRotationForScroll ignores negative scroll values', () => {
  assert.equal(sunRotationForScroll(-80), 0);
});
