// ===== QUIZ DATA =====
const questions = [
  {
    question: "Which company manufactures the Mustang?",
    options: ["Chevrolet", "Ford", "Dodge", "Pontiac"],
    correct: 1,
    explanation: "The Ford Mustang is an iconic American muscle car manufactured by Ford Motor Company, first introduced in 1964."
  },
  {
    question: "What does 'RPM' stand for in a car's engine?",
    options: ["Rapid Power Movement", "Revolutions Per Mile", "Revolutions Per Minute", "Rotational Power Meter"],
    correct: 2,
    explanation: "RPM stands for Revolutions Per Minute — it measures how many times the engine's crankshaft makes a full rotation in one minute."
  },
  {
    question: "Which car brand uses the slogan 'The Ultimate Driving Machine'?",
    options: ["Mercedes-Benz", "Audi", "BMW", "Lexus"],
    correct: 2,
    explanation: "BMW has used the famous slogan 'The Ultimate Driving Machine' since the 1970s to emphasize its focus on performance and driving experience."
  },
  {
    question: "What is the primary function of a car's alternator?",
    options: [
      "To start the engine",
      "To charge the battery while the engine runs",
      "To control the fuel injection",
      "To cool the engine"
    ],
    correct: 1,
    explanation: "The alternator generates electricity while the engine is running, which charges the battery and powers the car's electrical systems."
  },
  {
    question: "Which country is the car brand Ferrari originally from?",
    options: ["Germany", "France", "United Kingdom", "Italy"],
    correct: 3,
    explanation: "Ferrari was founded in 1939 by Enzo Ferrari in Maranello, Italy. It is one of the world's most iconic luxury sports car brands."
  },
  {
    question: "What type of engine layout has the engine placed between the driver and the rear axle?",
    options: ["Front-engine", "Rear-engine", "Mid-engine", "Flat engine"],
    correct: 2,
    explanation: "A mid-engine layout places the engine between the front and rear axles, providing better weight distribution and handling — common in sports cars like the Ferrari 458."
  },
  {
    question: "What does 'ABS' stand for in automotive terms?",
    options: [
      "Automatic Braking System",
      "Anti-lock Braking System",
      "Advanced Brake Stabilizer",
      "Axle Brake Support"
    ],
    correct: 1,
    explanation: "ABS stands for Anti-lock Braking System. It prevents wheels from locking up during hard braking, helping the driver maintain steering control."
  },
  {
    question: "Which of the following is a fully electric car manufacturer?",
    options: ["Subaru", "Tesla", "Mazda", "Kia"],
    correct: 1,
    explanation: "Tesla is the world's leading dedicated electric vehicle manufacturer, known for models like the Model S, Model 3, Model X, and Model Y."
  },
  {
    question: "What is the purpose of a car's catalytic converter?",
    options: [
      "To increase fuel efficiency",
      "To reduce harmful exhaust emissions",
      "To boost engine power",
      "To regulate engine temperature"
    ],
    correct: 1,
    explanation: "A catalytic converter reduces toxic gases and pollutants in exhaust emissions by converting them into less harmful substances through chemical reactions."
  },
  {
    question: "Which car holds the record as the world's best-selling car of all time?",
    options: ["Honda Civic", "Ford F-Series", "Volkswagen Golf", "Toyota Corolla"],
    correct: 3,
    explanation: "The Toyota Corolla is the best-selling car of all time, with over 50 million units sold worldwide since its introduction in 1966."
  }
];


// ===== STATE =====
let currentQ = 0;
let userAnswers = [];
let questionTimers = [];
let totalStartTime = null;
let questionStartTime = null;
let timerInterval = null;
let questionElapsed = 0;

// ===== ELEMENTS =====
const startScreen  = document.getElementById('start-screen');
const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn   = document.getElementById('start-btn');
const nextBtn    = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const qCounter     = document.getElementById('q-counter');
const qTimer       = document.getElementById('q-timer');
const progressBar  = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const optionsGrid  = document.getElementById('options-grid');

const gradeBadge      = document.getElementById('grade-badge');
const resultTitle     = document.getElementById('result-title');
const resultFeedback  = document.getElementById('result-feedback');
const correctCount    = document.getElementById('correct-count');
const wrongCount      = document.getElementById('wrong-count');
const percentDisplay  = document.getElementById('percent-display');
const totalTimeDisplay= document.getElementById('total-time-display');
const reviewList      = document.getElementById('review-list');

// ===== HELPERS =====
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function formatTime(seconds) {
  if (seconds < 60) return seconds + 's';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function getGrade(percent) {
  if (percent >= 90) return { grade: 'A+', title: 'Outstanding!', feedback: 'You aced this quiz! Exceptional knowledge and precision.' };
  if (percent >= 75) return { grade: 'A',  title: 'Great Job!',   feedback: 'You have a strong grasp of the material. Keep it up!' };
  if (percent >= 60) return { grade: 'B',  title: 'Good Work!',   feedback: 'Solid performance! Review the missed questions to sharpen your skills.' };
  if (percent >= 40) return { grade: 'C',  title: 'Keep Going!',  feedback: 'You\'re on your way. A bit more practice will make a big difference.' };
  return { grade: 'F', title: 'Don\'t Give Up!', feedback: 'This topic needs more study. Review the explanations and try again!' };
}

// ===== TIMER =====
function startQuestionTimer() {
  questionStartTime = Date.now();
  questionElapsed = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    questionElapsed = Math.floor((Date.now() - questionStartTime) / 1000);
    qTimer.textContent = questionElapsed + 's';
  }, 500);
}

function stopQuestionTimer() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
  questionTimers.push(elapsed);
  return elapsed;
}

// ===== RENDER QUESTION =====
function renderQuestion() {
  const q = questions[currentQ];

  qCounter.textContent = `Question ${currentQ + 1} / ${questions.length}`;
  progressBar.style.width = `${((currentQ + 1) / questions.length) * 100}%`;
  questionText.textContent = q.question;
  optionsGrid.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span>${opt}`;
    btn.addEventListener('click', () => handleAnswer(i));
    optionsGrid.appendChild(btn);
  });

  nextBtn.style.display = 'none';
  // Remove old explanation if any
  const oldExp = document.querySelector('.explanation-box');
  if (oldExp) oldExp.remove();

  startQuestionTimer();
}

// ===== HANDLE ANSWER =====
function handleAnswer(selectedIndex) {
  stopQuestionTimer();

  const q = questions[currentQ];
  const buttons = optionsGrid.querySelectorAll('.option-btn');

  // Disable all buttons
  buttons.forEach(b => b.disabled = true);

  // Mark correct and wrong
  buttons[q.correct].classList.add('correct');
  if (selectedIndex !== q.correct) {
    buttons[selectedIndex].classList.add('wrong');
  }

  // Store answer
  userAnswers[currentQ] = selectedIndex;

  // Show explanation
  const expBox = document.createElement('div');
  expBox.className = 'explanation-box';
  expBox.innerHTML = `<strong>Explanation</strong>${q.explanation}`;
  nextBtn.before(expBox);

  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = currentQ < questions.length - 1 ? 'Next →' : 'See Results';
}

// ===== NEXT QUESTION =====
nextBtn.addEventListener('click', () => {
  currentQ++;
  if (currentQ < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

// ===== SHOW RESULTS =====
function showResults() {
  showScreen(resultScreen);

  const totalTime = Math.floor((Date.now() - totalStartTime) / 1000);
  const correct = userAnswers.filter((ans, i) => ans === questions[i].correct).length;
  const wrong = questions.length - correct;
  const percent = Math.round((correct / questions.length) * 100);

  const { grade, title, feedback } = getGrade(percent);

  gradeBadge.textContent = grade;
  resultTitle.textContent = title;
  resultFeedback.textContent = feedback;
  correctCount.textContent = correct;
  wrongCount.textContent = wrong;
  percentDisplay.textContent = percent + '%';
  totalTimeDisplay.textContent = formatTime(totalTime);

  // Render review
  reviewList.innerHTML = '';
  questions.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.correct;
    const item = document.createElement('div');
    item.className = `review-item ${isCorrect ? 'correct-item' : 'wrong-item'}`;

    const userAns = userAnswers[i] !== undefined
      ? q.options[userAnswers[i]]
      : '<em>No answer</em>';
    const correctAns = q.options[q.correct];
    const timeSpent = questionTimers[i] !== undefined ? questionTimers[i] : 0;

    item.innerHTML = `
      <div class="review-q">${i + 1}. ${q.question}</div>
      <div class="review-meta">
        <div class="review-row">
          <span class="label">Your Answer</span>
          <span>${userAns}</span>
        </div>
        ${!isCorrect ? `
        <div class="review-row">
          <span class="label">Correct</span>
          <span>${correctAns}</span>
        </div>` : ''}
        <div class="review-row">
          <span class="label">Status</span>
          <span class="status-tag ${isCorrect ? 'status-correct' : 'status-wrong'}">
            ${isCorrect ? '✓ Correct' : '✗ Wrong'}
          </span>
        </div>
        <div class="review-time">⏱ Time spent: ${formatTime(timeSpent)}</div>
        <div class="review-explanation">${q.explanation}</div>
      </div>
    `;
    reviewList.appendChild(item);
  });
}

// ===== START =====
startBtn.addEventListener('click', () => {
  currentQ = 0;
  userAnswers = [];
  questionTimers = [];
  totalStartTime = Date.now();
  showScreen(quizScreen);
  renderQuestion();
});

// ===== RESTART =====
restartBtn.addEventListener('click', () => {
  showScreen(startScreen);
});