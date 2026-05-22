let currentQuestionIndex = 0;

let sessionCorrect = 0;
let sessionWrong = 0;

let answered = false;

let globalCorrect =
  Number(localStorage.getItem("globalCorrect")) || 0;

let globalWrong =
  Number(localStorage.getItem("globalWrong")) || 0;

const questionElement =
  document.getElementById("question");

const answersElement =
  document.getElementById("answers");

const questionNumber =
  document.getElementById("questionNumber");

const remainingQuestions =
  document.getElementById("remainingQuestions");

const correctCount =
  document.getElementById("correctCount");

const wrongCount =
  document.getElementById("wrongCount");

const progressBar =
  document.getElementById("progressBar");

const percentage =
  document.getElementById("percentage");

const totalPlayed =
  document.getElementById("totalPlayed");

const shuffledQuestions = [...questions];

shuffleArray(shuffledQuestions);

let usedQuestions = [];

function shuffleArray(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] =
      [array[j], array[i]];
  }
}

function getRandomQuestion() {

  if (
    usedQuestions.length >=
    shuffledQuestions.length
  ) {

    finishQuiz();

    return null;
  }

  let randomIndex;

  do {

    randomIndex = Math.floor(
      Math.random() *
      shuffledQuestions.length
    );

  } while (
    usedQuestions.includes(randomIndex)
  );

  usedQuestions.push(randomIndex);

  return shuffledQuestions[randomIndex];
}

let currentQuestion =
  getRandomQuestion();

function loadQuestion() {

  if (!currentQuestion) return;

  answered = false;

  answersElement.innerHTML = "";

  questionElement.textContent =
    currentQuestion.question;

  questionNumber.textContent =
    `Savol ${usedQuestions.length}`;

  const remain =
    shuffledQuestions.length -
    usedQuestions.length;

  remainingQuestions.textContent =
    remain > 0
      ? `${remain} ta qoldi`
      : "Oxirgi savol";

  const answers =
    [...currentQuestion.answers];

  shuffleArray(answers);

  answers.forEach(answer => {

    const button =
      document.createElement("button");

    button.className = "answer-btn";

    button.innerText =
      answer.text;

    button.onclick = () =>
      selectAnswer(
        button,
        answer.correct
      );

    answersElement.appendChild(button);
  });

  updateProgress();
}

function selectAnswer(
  button,
  isCorrect
) {

  if (answered) return;

  answered = true;

  const buttons =
    document.querySelectorAll(
      ".answer-btn"
    );

  buttons.forEach(btn => {
    btn.disabled = true;
  });

  if (isCorrect) {

    button.classList.add("correct");

    sessionCorrect++;
    globalCorrect++;

  } else {

    button.classList.add(
      "wrong-answer"
    );

    sessionWrong++;
    globalWrong++;

    buttons.forEach(btn => {

      const found =
        currentQuestion.answers.find(
          a =>
            a.text ===
              btn.innerText &&
            a.correct
        );

      if (found) {

        btn.classList.add(
          "correct"
        );
      }
    });
  }

  updateStats();
}

function nextQuestion() {

  if (!answered) {

    alert(
      "Avval javob tanlang"
    );

    return;
  }

  currentQuestion =
    getRandomQuestion();

  loadQuestion();
}

function randomQuestion() {

  if (!answered) {

    alert(
      "Avval javob tanlang"
    );

    return;
  }

  currentQuestion =
    getRandomQuestion();

  loadQuestion();
}

function restartQuiz() {

  sessionCorrect = 0;
  sessionWrong = 0;

  answered = false;

  currentQuestionIndex = 0;

  usedQuestions = [];

  shuffleArray(
    shuffledQuestions
  );

  correctCount.innerText = 0;
  wrongCount.innerText = 0;

  currentQuestion =
    getRandomQuestion();

  updateStats();

  loadQuestion();
}

function finishQuiz() {

  setTimeout(() => {

    const result =
      Math.floor(
        (
          sessionCorrect /
          (sessionCorrect +
            sessionWrong)
        ) * 100
      ) || 0;

    alert(
`Test tugadi!

To‘g‘ri: ${sessionCorrect}
Xato: ${sessionWrong}
Natija: ${result}%`
    );

    restartQuiz();

  }, 300);
}

function updateProgress() {

  const percent =
    (
      usedQuestions.length /
      shuffledQuestions.length
    ) * 100;

  progressBar.style.width =
    percent + "%";
}

function updateStats() {

  correctCount.innerText =
    sessionCorrect;

  wrongCount.innerText =
    sessionWrong;

  localStorage.setItem(
    "globalCorrect",
    globalCorrect
  );

  localStorage.setItem(
    "globalWrong",
    globalWrong
  );

  const total =
    globalCorrect +
    globalWrong;

  totalPlayed.innerText =
    total;

  let result = 0;

  if (total > 0) {

    result = Math.floor(
      (
        globalCorrect /
        total
      ) * 100
    );
  }

  percentage.innerText =
    result + "%";
}

function clearStatistics() {

  localStorage.removeItem(
    "globalCorrect"
  );

  localStorage.removeItem(
    "globalWrong"
  );

  globalCorrect = 0;
  globalWrong = 0;

  updateStats();
}

document
  .getElementById("nextBtn")
  .addEventListener(
    "click",
    nextQuestion
  );

document
  .getElementById("randomBtn")
  .addEventListener(
    "click",
    randomQuestion
  );

document
  .getElementById("restartBtn")
  .addEventListener(
    "click",
    restartQuiz
  );

updateStats();

loadQuestion();