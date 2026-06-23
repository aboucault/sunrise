const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { sunRotationForScroll } = require('./masthead.js');

test('sunRotationForScroll maps vertical scroll to clockwise degrees', () => {
  assert.equal(sunRotationForScroll(0), 0);
  assert.equal(sunRotationForScroll(120), 42);
});

test('sunRotationForScroll ignores negative scroll values', () => {
  assert.equal(sunRotationForScroll(-80), 0);
});

test('sleep hero video is rendered after the questionnaire', () => {
  const html = fs.readFileSync(path.join(__dirname, 'apnee-du-sommeil.html'), 'utf8');

  assert.ok(
    html.indexOf('<section class="quiz-hero"') < html.indexOf('<video'),
    'expected the questionnaire section to appear before the video',
  );
});

test('sleep hero video participates in page flow below the questionnaire', () => {
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  const match = css.match(/\.sleep-hero-video\s*\{(?<rules>[^}]+)\}/);

  assert.ok(match, 'expected .sleep-hero-video styles to exist');
  assert.doesNotMatch(match.groups.rules, /position:\s*fixed/);
});
