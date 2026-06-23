const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

test('intro call to action opens the questionnaire screen', () => {
  assert.match(
    html,
    /class="primary-action"\s+href="#questionnaire"/,
    'expected intro CTA to route into the second app screen',
  );
});

test('app uses app-scoped assets on routed URLs', () => {
  assert.match(
    html,
    /<link rel="icon" href="\/assets\/favicon\.ico" sizes="any" \/>/,
  );
  assert.match(
    html,
    /<link rel="stylesheet" href="\/app\/styles\.css" \/>/,
  );
});

test('questionnaire screen includes intake controls', () => {
  assert.match(html, /id="questionnaire"/);
  assert.match(html, /name="concern"/);
  assert.match(html, /name="frequency"/);
  assert.match(html, /name="energy"/);
});

test('menu preview represents free education, coaching subscription, and kit purchase', () => {
  assert.match(html, /<h3>Education<\/h3>/);
  assert.match(html, /<span class="menu-label">Free<\/span>/);
  assert.match(html, /<h3>Coaching<\/h3>/);
  assert.match(html, /EUR 2\.99\/month/);
  assert.match(html, /<h3>At-home test<\/h3>/);
  assert.match(html, /href="\.\.\/website\/commander\.html"/);
});

test('second screen uses Sunrise app styling hooks', () => {
  assert.match(css, /\.questionnaire-screen,\s*[\r\n\s]*\.story-screen,\s*[\r\n\s]*\.paywall-screen\s*\{/);
  assert.match(css, /\.questionnaire-card fieldset\s*\{/);
  assert.match(css, /\.menu-preview\s*\{/);
  assert.match(css, /\.coaching-panel\s*\{/);
});
