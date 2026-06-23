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

test('sleep hero video is layered behind the questionnaire in the hero block', () => {
  const html = fs.readFileSync(path.join(__dirname, 'apnee-du-sommeil.html'), 'utf8');

  assert.match(
    html,
    /<main class="sleep-page">\s*<video[\s\S]*<\/video>\s*<section class="quiz-hero"/,
    'expected the video to be the hero background before the questionnaire layer',
  );
});

test('sleep hero video is contained by the hero block instead of fixed to the viewport', () => {
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  const match = css.match(/\.sleep-hero-video\s*\{(?<rules>[^}]+)\}/);

  assert.ok(match, 'expected .sleep-hero-video styles to exist');
  assert.match(match.groups.rules, /position:\s*absolute/);
  assert.doesNotMatch(match.groups.rules, /position:\s*fixed/);
});

test('website pages request versioned stylesheet to avoid stale production CSS', () => {
  const stylesheetName = 'styles-2208b4e.css';

  assert.ok(
    fs.existsSync(path.join(__dirname, stylesheetName)),
    'expected versioned stylesheet file to exist',
  );

  for (const page of ['apnee-du-sommeil.html', 'blog.html', 'commander.html']) {
    const html = fs.readFileSync(path.join(__dirname, page), 'utf8');

    assert.match(
      html,
      new RegExp(`<link rel="stylesheet" href="\\.\\/${stylesheetName}" \\/>`),
      `${page} should request the versioned stylesheet file`,
    );
  }
});

test('quiz result gives recommended free articles before the kit call to action', () => {
  const js = fs.readFileSync(path.join(__dirname, 'quiz.js'), 'utf8');
  const recommendationsIndex = js.indexOf('recommended-articles');
  const storyPanelsIndex = js.indexOf('result-story-panels');
  const kitIndex = js.indexOf('Commander le kit Sunrise');

  assert.ok(recommendationsIndex > -1, 'expected recommended article cards in result');
  assert.ok(storyPanelsIndex > -1, 'expected emotional story panels in result');
  assert.ok(kitIndex > -1, 'expected kit call to action to remain available');
  assert.ok(
    recommendationsIndex > js.indexOf('questionRoot.querySelector'),
    'expected recommendations to be inserted into the rendered result',
  );
  assert.ok(
    storyPanelsIndex > recommendationsIndex,
    'expected story panels after the free article recommendations',
  );
  assert.match(
    js,
    /querySelector\(["']\.result-action["']\)\.insertAdjacentHTML\(\s*["']beforebegin["']/,
  );
});

test('versioned stylesheet includes quiz result recommendation layout', () => {
  const css = fs.readFileSync(path.join(__dirname, 'styles-2208b4e.css'), 'utf8');

  assert.match(css, /\.recommended-articles\s*\{/);
  assert.match(css, /\.result-story-panels\s*\{/);
  assert.match(css, /\.story-panel\s*\{/);
  assert.match(css, /\.result-article-card\s*\{/);
});
