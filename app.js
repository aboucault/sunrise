const state = {
  stepIndex: 0,
  answers: {
    awareness: null,
    symptoms: [],
    daytime: null,
    risk: [],
    readiness: null
  }
};

const steps = [
  {
    id: 'welcome',
    type: 'intro',
    progress: '',
    title: 'Could your sleep be more than a rough patch?',
    body: 'This short check helps you decide whether a home sleep test may be worth exploring.',
    bullets: [
      { title: 'No diagnosis', body: 'Just a first layer of guidance.' },
      { title: 'Takes about a minute', body: 'A few short questions, then a clear next step.' }
    ],
    button: "Let's get started"
  },
  {
    id: 'stakes',
    type: 'story',
    progress: 'Why this matters',
    title: 'Sleep issues can spill into the rest of life.',
    body: 'Low energy, foggy focus, and health concerns can build slowly. Many people wait because it is easy to dismiss the pattern.',
    stat: '170M+',
    statLabel: 'lives covered through Sunrise insurance network',
    button: 'Continue'
  },
  {
    id: 'awareness',
    type: 'choice',
    progress: 'Question 1 of 5',
    title: 'Do you already think sleep apnea may be the problem?',
    body: 'Pick the answer that feels closest.',
    key: 'awareness',
    multi: false,
    options: [
      {
        id: 'known',
        title: 'Yes, I already suspect it',
        detail: 'I want help choosing the next step.'
      },
      {
        id: 'unsure',
        title: 'I am not sure',
        detail: 'I want help deciding whether this is worth testing.'
      }
    ],
    button: 'Next'
  },
  {
    id: 'symptoms',
    type: 'choice',
    progress: 'Question 2 of 5',
    title: 'What are you noticing at night?',
    body: 'Choose any that fit.',
    key: 'symptoms',
    multi: true,
    options: [
      { id: 'snoring', title: 'Loud snoring', detail: 'Someone points it out, or you notice it yourself.' },
      { id: 'gasping', title: 'Gasping or choking', detail: 'You wake up short of breath, or someone has seen this happen.' },
      { id: 'restless', title: 'Broken sleep', detail: 'You wake often, or sleep feels fragmented.' },
      { id: 'none', title: 'None of these', detail: 'Nothing here feels familiar.' }
    ],
    button: 'Next'
  },
  {
    id: 'daytime',
    type: 'choice',
    progress: 'Question 3 of 5',
    title: 'How is this affecting your days?',
    body: 'Pick the closest fit.',
    key: 'daytime',
    multi: false,
    options: [
      {
        id: 'high',
        title: 'It is clearly affecting me',
        detail: 'Fatigue, low focus, headaches, or low energy are getting in the way.'
      },
      {
        id: 'medium',
        title: 'I feel it sometimes',
        detail: 'It is noticeable, but not every day.'
      },
      {
        id: 'low',
        title: 'I am mostly just curious',
        detail: 'I do not feel much daytime impact right now.'
      }
    ],
    button: 'Next'
  },
  {
    id: 'risk',
    type: 'choice',
    progress: 'Question 4 of 5',
    title: 'Do any of these sound true for you?',
    body: 'Choose any that fit.',
    key: 'risk',
    multi: true,
    options: [
      { id: 'partner', title: 'Someone close to me is concerned', detail: 'They notice your breathing or snoring.' },
      { id: 'bp', title: 'I already think about heart or blood pressure risk', detail: 'Overall health is part of the concern.' },
      { id: 'old-study', title: 'Sleep has come up before', detail: 'You had a past referral, study, or related conversation.' },
      { id: 'none', title: 'None of these', detail: 'Nothing here fits.' }
    ],
    button: 'Next'
  },
  {
    id: 'readiness',
    type: 'choice',
    progress: 'Question 5 of 5',
    title: 'If this looked worth checking, what would you prefer?',
    body: 'This shapes the next step we show you.',
    key: 'readiness',
    multi: false,
    options: [
      {
        id: 'test',
        title: 'I would rather test from home',
        detail: 'If it seems relevant, I want the fastest next step.'
      },
      {
        id: 'talk',
        title: 'I would rather talk to someone first',
        detail: 'I want reassurance before I commit to a test.'
      },
      {
        id: 'wait',
        title: 'I would rather monitor for now',
        detail: 'I am not ready to take action yet.'
      }
    ],
    button: 'See my result'
  },
  {
    id: 'result',
    type: 'result',
    progress: 'Your next step',
    button: 'Restart demo'
  }
];

const screenContent = document.getElementById('screen-content');
const primaryButton = document.getElementById('primary-button');
const backButton = document.getElementById('back-button');
const progressFill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

function renderSunrise() {
  return `
    <div class="hero-illustration" style="${getSunriseStyle(state.stepIndex)}">
      <div class="hero-glow-band"></div>
      <div class="hero-sun"></div>
      <div class="hero-star hero-star-one"></div>
      <div class="hero-star hero-star-two"></div>
      <div class="hero-star hero-star-three"></div>
      <div class="hero-ridge hero-ridge-back"></div>
      <div class="hero-ridge hero-ridge-mid"></div>
      <div class="hero-ridge hero-ridge-front"></div>
    </div>
  `;
}

function isSelected(step, optionId) {
  const value = state.answers[step.key];
  return Array.isArray(value) ? value.includes(optionId) : value === optionId;
}

function toggleOption(step, optionId) {
  if (step.multi) {
    const current = Array.isArray(state.answers[step.key]) ? [...state.answers[step.key]] : [];
    const index = current.indexOf(optionId);

    if (index >= 0) {
      current.splice(index, 1);
      state.answers[step.key] = current;
      return;
    }

    if (optionId === 'none') {
      state.answers[step.key] = ['none'];
      return;
    }

    state.answers[step.key] = current.filter((item) => item !== 'none').concat(optionId);
    return;
  }

  state.answers[step.key] = optionId;
}

function currentStep() {
  return steps[state.stepIndex];
}

function canAdvance(step) {
  if (step.type === 'intro' || step.type === 'story' || step.type === 'result') {
    return true;
  }

  const value = state.answers[step.key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function scoreResult() {
  let score = 0;

  if (state.answers.awareness === 'known') {
    score += 2;
  }

  const symptoms = state.answers.symptoms || [];
  if (symptoms.includes('snoring')) {
    score += 1;
  }
  if (symptoms.includes('gasping')) {
    score += 2;
  }
  if (symptoms.includes('restless')) {
    score += 1;
  }

  if (state.answers.daytime === 'high') {
    score += 2;
  }
  if (state.answers.daytime === 'medium') {
    score += 1;
  }

  const risk = state.answers.risk || [];
  if (risk.includes('partner')) {
    score += 1;
  }
  if (risk.includes('bp')) {
    score += 1;
  }
  if (risk.includes('old-study')) {
    score += 1;
  }

  if (state.answers.readiness === 'test' && score >= 4) {
    return {
      tone: 'positive',
      eyebrow: 'Likely worth checking now',
      title: 'A Sunrise home test looks like the right next step.',
      body: 'Your answers suggest a meaningful pattern of night symptoms and daytime impact. A home sleep test may help you move from uncertainty to something clearer without waiting for an in-lab visit.',
      bullets: [
        'You reported signs commonly linked to disrupted breathing during sleep.',
        'Your daytime impact suggests this is showing up beyond the night itself.',
        'A home test is the fastest path to more certainty.'
      ],
      cta: 'Buy the test kit',
      subcopy: 'Insurance and pricing can be checked before you continue.'
    };
  }

  if (state.answers.readiness === 'wait' || score <= 2) {
    return {
      tone: 'neutral',
      eyebrow: 'Not enough signal yet',
      title: 'It may make sense to monitor for now.',
      body: 'Your answers do not strongly suggest that you need to jump straight to testing right now. It may be more useful to keep track of changes, especially if symptoms become more frequent or daytime fatigue grows.',
      bullets: [
        'You reported fewer of the common warning signs.',
        'There may not be enough signal yet to justify immediate testing.',
        'If things change, Sunrise can help you reassess later.'
      ],
      cta: 'Continue tracking symptoms',
      subcopy: 'A follow-up reminder or symptom journal could live here in a fuller product.'
    };
  }

  return {
    tone: 'caution',
    eyebrow: 'More guidance first',
    title: 'Talking to a specialist first may be the best next step.',
    body: 'There are enough signs here to take the issue seriously, but a short conversation may help you choose the right path before buying a test.',
    bullets: [
      'Your answers suggest this is worth exploring further.',
      'You may benefit from quick human reassurance before choosing testing.',
      'This keeps the experience supportive without over-automating a health decision.'
    ],
    cta: 'Talk to a specialist',
    subcopy: 'This path is useful when users need clarity before committing to a test kit.'
  };
}

function renderIntro(step) {
  return `
    <div class="hero-panel">
      ${renderSunrise()}
      <h2>${step.title}</h2>
      <p class="screen-body">${step.body}</p>
      <div class="highlight-card">
        <div class="trust-list">
          ${step.bullets
            .map(
              (item) => `
                <div class="trust-list-item">
                  <span class="trust-icon"></span>
                  <div>
                    <strong>${item.title}</strong>
                    <p>${item.body}</p>
                  </div>
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderStory(step) {
  return `
    <div class="hero-panel">
      ${renderSunrise()}
      <p class="screen-eyebrow">${step.progress}</p>
      <h2>${step.title}</h2>
      <p class="screen-body">${step.body}</p>
      <div class="story-stat">
        <strong>${step.stat}</strong>
        <span>${step.statLabel}</span>
      </div>
      <div class="story-bar"></div>
      <p class="screen-caption">This is the "aha" moment: the pattern may be worth taking seriously.</p>
    </div>
  `;
}

function renderChoice(step) {
  const cards = step.options
    .map(
      (option) => `
      <button
        type="button"
        class="choice-card${isSelected(step, option.id) ? ' is-selected' : ''}"
        data-option="${option.id}"
      >
        <span class="choice-copy">
          <span class="choice-kicker">${step.multi ? 'Option' : 'Answer'}</span>
          <strong>${option.title}</strong>
          <span>${option.detail}</span>
        </span>
        <span class="choice-indicator">${isSelected(step, option.id) ? '&#10003;' : ''}</span>
      </button>
    `
    )
    .join('');

  return `
    <div class="question-panel">
      ${renderSunrise()}
      <p class="screen-eyebrow">${step.progress}</p>
      <h2>${step.title}</h2>
      <p class="screen-body">${step.body}</p>
      <div class="answer-mode">${step.multi ? 'Choose any that fit' : 'Choose one answer'}</div>
      <div class="choices-stack">${cards}</div>
    </div>
  `;
}

function renderResult() {
  const result = scoreResult();
  return `
    <div class="result-panel ${result.tone}">
      ${renderSunrise()}
      <p class="screen-eyebrow">${result.eyebrow}</p>
      <h2>${result.title}</h2>
      <p class="screen-body">${result.body}</p>
      <div class="result-visual">
        <div class="result-device">
          <div class="device-chip"></div>
          <span>Home sleep test</span>
        </div>
      </div>
      <div class="result-list">
        ${result.bullets.map((item) => `<div class="result-item"><span>&bull;</span><p>${item}</p></div>`).join('')}
      </div>
      <div class="result-cta-card">
        <strong>${result.cta}</strong>
        <p>${result.subcopy}</p>
      </div>
    </div>
  `;
}

function getSunriseStyle(stepIndex) {
  const normalized = Math.min(stepIndex / (steps.length - 1), 1);
  const sunY = 82 - normalized * 50;
  const glow = 0.18 + normalized * 0.52;
  const sky = 0.1 + normalized * 0.42;
  const sunSize = 3 + normalized * 1.6;
  const starOpacity = Math.max(0, 0.7 - normalized * 0.95);
  const horizonLift = normalized * 1.1;

  return `--sun-y:${sunY}%; --sun-glow:${glow}; --sky-glow:${sky}; --sun-size:${sunSize}rem; --star-opacity:${starOpacity}; --horizon-lift:${horizonLift}rem;`;
}

function renderStep() {
  const step = currentStep();
  const ratio = (state.stepIndex / (steps.length - 1)) * 100;

  progressFill.style.width = `${Math.max(ratio, 6)}%`;
  progressLabel.textContent = step.progress;
  primaryButton.textContent = step.type === 'result' ? 'Restart demo' : step.button;
  primaryButton.disabled = !canAdvance(step);
  backButton.style.visibility = state.stepIndex === 0 ? 'hidden' : 'visible';

  if (step.type === 'intro') {
    screenContent.innerHTML = renderIntro(step);
  } else if (step.type === 'story') {
    screenContent.innerHTML = renderStory(step);
  } else if (step.type === 'choice') {
    screenContent.innerHTML = renderChoice(step);
  } else {
    screenContent.innerHTML = renderResult();
  }

  if (step.type === 'choice') {
    screenContent.querySelectorAll('[data-option]').forEach((button) => {
      button.addEventListener('click', () => {
        toggleOption(step, button.dataset.option);
        renderStep();
      });
    });
  }
}

primaryButton.addEventListener('click', () => {
  if (currentStep().type === 'result') {
    state.stepIndex = 0;
    state.answers = {
      awareness: null,
      symptoms: [],
      daytime: null,
      risk: [],
      readiness: null
    };
    renderStep();
    return;
  }

  if (!canAdvance(currentStep())) {
    return;
  }

  state.stepIndex += 1;
  renderStep();
});

backButton.addEventListener('click', () => {
  if (state.stepIndex === 0) {
    return;
  }

  state.stepIndex -= 1;
  renderStep();
});

renderStep();
