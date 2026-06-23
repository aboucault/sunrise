const questions = [
  {
    title: 'Vous sentez-vous souvent fatigué(e) pendant la journée ?',
    detail: 'Même après une nuit de sommeil complète.',
    options: ['Oui, presque tous les jours', 'Parfois', 'Non, rarement']
  },
  {
    title: 'Vous a-t-on déjà parlé de ronflements marqués ?',
    detail: 'Par exemple un proche qui remarque le bruit ou des respirations irrégulières.',
    options: ['Oui, souvent', 'Cela arrive', 'Non, pas vraiment']
  },
  {
    title: 'Votre sommeil vous semble-t-il peu réparateur ?',
    detail: 'Réveils fréquents, sensation de nuit hachée ou énergie basse au réveil.',
    options: ['Oui, clairement', 'Par moments', 'Rarement']
  },
  {
    title: 'Avez-vous déjà cherché une explication à cette fatigue ?',
    detail: 'Stress, rythme de vie, sommeil, ou autre piste déjà envisagée.',
    options: ['Oui, sans réponse claire', 'Un peu', 'Non']
  },
  {
    title: 'Si un test à domicile pouvait clarifier la situation, seriez-vous prêt(e) à le commander ?',
    detail: 'Il ne s’agit pas d’un diagnostic ici, seulement d’une aide pour choisir le prochain pas.',
    options: ['Oui, je veux avancer', 'J’aimerais en savoir plus', 'Pas maintenant']
  }
];

const state = {
  index: 0,
  answers: []
};

const questionRoot = document.getElementById('question-root');
const progressLabel = document.getElementById('progress-label');
const backButton = document.getElementById('back-button');
const continueButton = document.getElementById('continue-button');
const quizCard = document.querySelector('.quiz-card');

function selectedAnswer() {
  return state.answers[state.index];
}

function resultDestination() {
  const preference = state.answers[questions.length - 1];

  if (preference === 1) {
    return {
      href: '../app/index.html',
      label: "Continuer dans l'app",
      helper: 'Pour mieux comprendre avant de commander.'
    };
  }

  if (preference === 2) {
    return {
      href: './blog.html',
      label: 'Lire le blog sommeil',
      helper: 'Pour revenir au test plus tard.'
    };
  }

  return {
    href: './commander.html',
    label: 'Commander le kit Sunrise',
    helper: 'Pour passer du doute a une prochaine etape concrete.'
  };
}

function renderQuestion() {
  const question = questions[state.index];

  quizCard.dataset.progress = String(state.index + 1);
  progressLabel.textContent = `Question ${state.index + 1} sur ${questions.length}`;
  backButton.hidden = state.index === 0;
  continueButton.disabled = selectedAnswer() === undefined;
  continueButton.textContent = state.index === questions.length - 1 ? 'Voir mon résultat' : 'Continuer';

  questionRoot.innerHTML = `
    <h2>${question.title}</h2>
    <p class="question-detail">${question.detail}</p>
    <div class="answer-list">
      ${question.options
        .map(
          (option, optionIndex) => `
            <button class="answer-option${selectedAnswer() === optionIndex ? ' is-selected' : ''}" type="button" data-option="${optionIndex}">
              <span>${option}</span>
              <span class="radio-indicator" aria-hidden="true"></span>
            </button>
          `
        )
        .join('')}
    </div>
  `;

  questionRoot.querySelectorAll('[data-option]').forEach((button) => {
    button.addEventListener('click', () => {
      state.answers[state.index] = Number(button.dataset.option);
      renderQuestion();
    });
  });
}

function renderResult() {
  const score = state.answers.reduce((sum, answer) => sum + (2 - answer), 0);
  const highSignal = score >= 7;
  const destination = resultDestination();

  quizCard.dataset.progress = String(questions.length);
  progressLabel.textContent = 'Résultat';
  backButton.hidden = false;
  continueButton.textContent = 'Recommencer';
  continueButton.disabled = false;

  questionRoot.innerHTML = `
    <h2>${highSignal ? 'Un test à domicile peut être une suite utile.' : 'Commencer par mieux observer peut suffire.'}</h2>
    <p class="question-detail">
      ${
        highSignal
          ? "Vos réponses montrent plusieurs signaux qui méritent d’être explorés. Sunrise peut vous aider à passer d’un doute à une prochaine étape concrète."
          : "Vos réponses ne pointent pas vers une urgence d’action. Vous pouvez continuer à suivre votre sommeil et revenir au test si les signaux se répètent."
      }
    </p>
    <div class="result-action">
      <strong>${destination.label}</strong>
      <span>${destination.helper} Orientation non diagnostique.</span>
      <a class="result-button" href="${destination.href}">${destination.label}</a>
    </div>
  `;
}

continueButton.addEventListener('click', () => {
  if (state.index === questions.length) {
    state.index = 0;
    state.answers = [];
    renderQuestion();
    return;
  }

  if (selectedAnswer() === undefined) {
    return;
  }

  state.index += 1;

  if (state.index === questions.length) {
    renderResult();
    return;
  }

  renderQuestion();
});

backButton.addEventListener('click', () => {
  if (state.index === 0) {
    return;
  }

  if (state.index === questions.length) {
    state.index = questions.length - 1;
  } else {
    state.index -= 1;
  }

  renderQuestion();
});

renderQuestion();
