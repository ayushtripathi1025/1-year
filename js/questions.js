// js/questions.js

// ------------------------------------------------------------
// TILE-BASED QUESTION GAME
// ------------------------------------------------------------
//
// FLOW
//
// Wrong #1:
//   → Wrong answer
//
// Wrong #2:
//   → Wrong answer
//   → Hint appears
//
// Wrong #3:
//   → Wrong answer
//   → Hint remains
//
// Wrong #4 and onward:
//   → "Hawwww 😭 Wrong answer."
//   → "Want to try again or increase your incorrect count?"
//
// YES:
//   → Forgiven
//   → Kiss him 💋
//   → 10 second punishment
//   → Same question unlocks again
//
// NO:
//   → Question officially becomes INCORRECT
//   → Real answer is revealed
//   → Next question unlocks
//
// CORRECT:
//   → Question officially becomes CORRECT
//   → Next question unlocks
//
// ------------------------------------------------------------


// ------------------------------------------------------------
// QUESTION DATA
// ------------------------------------------------------------

let QUESTION_DATA = [];


// Support both variable names so the existing
// data/questions.js does not need to be rewritten.

if (
  typeof QUESTIONS_DATA !== "undefined"
) {
  QUESTION_DATA = QUESTIONS_DATA;
}
else if (
  typeof CROSSWORD_DATA !== "undefined"
) {
  QUESTION_DATA = CROSSWORD_DATA;
}
else {
  console.error(
    "[OUR ANNIVERSARY] No question data found."
  );
}


// ------------------------------------------------------------
// SETTINGS
// ------------------------------------------------------------

const QUESTION_GAME_CONFIG = {

  // Number of seconds for the kiss punishment.
  punishmentSeconds: 10,

  // Number of wrong attempts before the
  // YES / NO decision appears.
  decisionAfterAttempts: 4,

  // Number of wrong attempts before the hint appears.
  hintAfterAttempts: 2
};


// ------------------------------------------------------------
// QUESTIONS
// ------------------------------------------------------------

const questions = Array.isArray(QUESTION_DATA)
  ? QUESTION_DATA
      .map((question, index) => {

        return {
          id:
            question.id ??
            index + 1,

          question:
            String(
              question.question ?? ""
            ),

          answer:
            normalizeQuestionAnswer(
              question.answer ?? ""
            ),

          hint:
            String(
              question.hint ?? ""
            ),

          wrongAttempts: 0,

          completed: false,

          result: null
        };

      })
      .filter(
        (question) =>
          question.question &&
          question.answer
      )
  : [];


// ------------------------------------------------------------
// GAME STATE
// ------------------------------------------------------------

let questionIndex = 0;

let correctQuestionCount = 0;

let incorrectQuestionCount = 0;

let currentQuestionWrongAttempts = 0;

let questionLocked = false;

let punishmentInterval = null;

let punishmentSecondsRemaining = 0;


// ------------------------------------------------------------
// DOM
// ------------------------------------------------------------

const questionBoard =
  document.getElementById(
    "question-board"
  ) ||
  document.getElementById(
    "crossword-board"
  );


const questionProgress =
  document.getElementById(
    "question-progress"
  ) ||
  document.getElementById(
    "crossword-status"
  );


const questionCorrect =
  document.getElementById(
    "question-correct"
  );


const questionIncorrect =
  document.getElementById(
    "question-incorrect"
  );


const questionAttempts =
  document.getElementById(
    "question-attempts"
  ) ||
  document.getElementById(
    "crossword-attempts"
  );


const questionContinue =
  document.getElementById(
    "question-continue"
  ) ||
  document.getElementById(
    "crossword-continue"
  );


// ------------------------------------------------------------
// NORMALIZE ANSWER
// ------------------------------------------------------------

function normalizeQuestionAnswer(
  answer
) {

  return String(answer)
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}


// ------------------------------------------------------------
// UPDATE TOP COUNTERS
// ------------------------------------------------------------

function updateQuestionCounters() {

  const total =
    questions.length;


  const currentNumber =
    Math.min(
      questionIndex + 1,
      total
    );


  // ----------------------------------------------------------
  // QUESTION X / TOTAL
  // ----------------------------------------------------------

  if (questionProgress) {

    questionProgress.textContent =
      `${currentNumber} / ${total}`;
  }


  // ----------------------------------------------------------
  // CORRECT
  // ----------------------------------------------------------

  if (questionCorrect) {

    questionCorrect.textContent =
      `Correct: ${correctQuestionCount}`;
  }


  // ----------------------------------------------------------
  // INCORRECT
  // ----------------------------------------------------------

  if (questionIncorrect) {

    questionIncorrect.textContent =
      `Incorrect: ${incorrectQuestionCount}`;
  }


  // Fallback for the old element.
  if (
    !questionCorrect &&
    questionAttempts
  ) {

    questionAttempts.textContent =
      `Correct: ${correctQuestionCount} • Incorrect: ${incorrectQuestionCount}`;
  }
}


// ------------------------------------------------------------
// CREATE QUESTION CARD
// ------------------------------------------------------------

function createQuestionCard(
  question
) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "question-card";


  // ----------------------------------------------------------
  // QUESTION NUMBER
  // ----------------------------------------------------------

  const number =
    document.createElement(
      "div"
    );

  number.className =
    "question-card-number";

  number.textContent =
    `Question ${questionIndex + 1}`;


  // ----------------------------------------------------------
  // QUESTION
  // ----------------------------------------------------------

  const questionText =
    document.createElement(
      "h3"
    );

  questionText.className =
    "question-card-text";

  questionText.textContent =
    question.question;


  // ----------------------------------------------------------
  // ANSWER AREA
  // ----------------------------------------------------------

  const answerArea =
    document.createElement(
      "div"
    );

  answerArea.className =
    "question-answer-area";


  const input =
    document.createElement(
      "input"
    );

  input.type =
    "text";

  input.className =
    "question-answer-input";

  input.placeholder =
    "Type your answer...";

  input.autocomplete =
    "off";

  input.autocapitalize =
    "characters";

  input.spellcheck =
    false;


  const checkButton =
    document.createElement(
      "button"
    );

  checkButton.type =
    "button";

  checkButton.className =
    "question-check-button";

  checkButton.textContent =
    "Check ♡";


  answerArea.appendChild(
    input
  );

  answerArea.appendChild(
    checkButton
  );


  // ----------------------------------------------------------
  // FEEDBACK
  // ----------------------------------------------------------

  const feedback =
    document.createElement(
      "div"
    );

  feedback.className =
    "question-feedback";

  feedback.setAttribute(
    "aria-live",
    "polite"
  );


  // ----------------------------------------------------------
  // HINT
  // ----------------------------------------------------------

  const hint =
    document.createElement(
      "div"
    );

  hint.className =
    "question-hint";


  // ----------------------------------------------------------
  // DECISION AREA
  // ----------------------------------------------------------

  const decision =
    document.createElement(
      "div"
    );

  decision.className =
    "question-decision";


  // ----------------------------------------------------------
  // PUNISHMENT AREA
  // ----------------------------------------------------------

  const punishment =
    document.createElement(
      "div"
    );

  punishment.className =
    "question-punishment";


  // ----------------------------------------------------------
  // ANSWER REVEAL
  // ----------------------------------------------------------

  const reveal =
    document.createElement(
      "div"
    );

  reveal.className =
    "question-answer-reveal";


  // ----------------------------------------------------------
  // ASSEMBLE
  // ----------------------------------------------------------

  card.appendChild(
    number
  );

  card.appendChild(
    questionText
  );

  card.appendChild(
    answerArea
  );

  card.appendChild(
    feedback
  );

  card.appendChild(
    hint
  );

  card.appendChild(
    decision
  );

  card.appendChild(
    punishment
  );

  card.appendChild(
    reveal
  );


  // ----------------------------------------------------------
  // CHECK BUTTON
  // ----------------------------------------------------------

  checkButton.addEventListener(
    "click",
    () => {

      submitQuestionAnswer(
        question,
        input,
        feedback,
        hint,
        decision,
        punishment,
        reveal,
        checkButton
      );

    }
  );


  // ----------------------------------------------------------
  // ENTER KEY
  // ----------------------------------------------------------

  input.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        submitQuestionAnswer(
          question,
          input,
          feedback,
          hint,
          decision,
          punishment,
          reveal,
          checkButton
        );

      }

    }
  );


  return card;
}


// ------------------------------------------------------------
// RENDER CURRENT QUESTION
// ------------------------------------------------------------

function renderCurrentQuestion() {

  if (!questionBoard) {

    console.error(
      "[OUR ANNIVERSARY] Question board not found."
    );

    return;
  }


  clearPunishmentTimer();


  questionLocked =
    false;


  currentQuestionWrongAttempts =
    0;


  questionBoard.innerHTML =
    "";


  // ----------------------------------------------------------
  // FINISHED
  // ----------------------------------------------------------

  if (
    questionIndex >=
    questions.length
  ) {

    renderQuestionComplete();

    return;
  }


  const question =
    questions[
      questionIndex
    ];


  const card =
    createQuestionCard(
      question
    );


  questionBoard.appendChild(
    card
  );


  updateQuestionCounters();


  const input =
    card.querySelector(
      ".question-answer-input"
    );


  if (input) {

    setTimeout(
      () => {
        input.focus();
      },
      150
    );
  }


  debugLog(
    `Showing question ${questionIndex + 1}/${questions.length}.`
  );
}


// ------------------------------------------------------------
// SUBMIT ANSWER
// ------------------------------------------------------------

function submitQuestionAnswer(
  question,
  input,
  feedback,
  hint,
  decision,
  punishment,
  reveal,
  checkButton
) {

  if (
    questionLocked
  ) {
    return;
  }


  const userAnswer =
    normalizeQuestionAnswer(
      input.value
    );


  // ----------------------------------------------------------
  // EMPTY
  // ----------------------------------------------------------

  if (!userAnswer) {

    feedback.textContent =
      "Come onnn... give me an answer. 🥺";

    feedback.classList.add(
      "is-empty"
    );

    input.focus();

    return;
  }


  feedback.classList.remove(
    "is-empty"
  );


  // ----------------------------------------------------------
  // CORRECT
  // ----------------------------------------------------------

  if (
    userAnswer ===
    question.answer
  ) {

    handleCorrectAnswer(
      question,
      input,
      feedback,
      checkButton
    );

    return;
  }


  // ----------------------------------------------------------
  // WRONG
  // ----------------------------------------------------------

  handleWrongAnswer(
    question,
    input,
    feedback,
    hint,
    decision,
    punishment,
    reveal,
    checkButton
  );
}


// ------------------------------------------------------------
// CORRECT
// ------------------------------------------------------------

function handleCorrectAnswer(
  question,
  input,
  feedback,
  checkButton
) {

  question.completed =
    true;

  question.result =
    "correct";


  correctQuestionCount++;


  feedback.textContent =
    "Yesss! You know me. ♡";

  feedback.classList.remove(
    "is-wrong"
  );

  feedback.classList.add(
    "is-correct"
  );


  input.disabled =
    true;

  checkButton.disabled =
    true;


  updateQuestionCounters();


  debugLog(
    `Question ${question.id} completed correctly.`
  );


  setTimeout(
    () => {

      questionIndex++;

      renderCurrentQuestion();

    },
    1200
  );
}


// ------------------------------------------------------------
// WRONG
// ------------------------------------------------------------

function handleWrongAnswer(
  question,
  input,
  feedback,
  hint,
  decision,
  punishment,
  reveal,
  checkButton
) {

  currentQuestionWrongAttempts++;

  question.wrongAttempts =
    currentQuestionWrongAttempts;


  feedback.textContent =
    "Hawwww 😭 Wrong answer.";

  feedback.classList.remove(
    "is-correct"
  );

  feedback.classList.add(
    "is-wrong"
  );


  // ----------------------------------------------------------
  // HINT AFTER 2 WRONG ATTEMPTS
  // ----------------------------------------------------------

  if (
    currentQuestionWrongAttempts >=
    QUESTION_GAME_CONFIG.hintAfterAttempts
  ) {

    showQuestionHint(
      question,
      hint
    );
  }


  // ----------------------------------------------------------
  // DECISION AFTER 4 WRONG ATTEMPTS
  // ----------------------------------------------------------

  if (
    currentQuestionWrongAttempts >=
    QUESTION_GAME_CONFIG.decisionAfterAttempts
  ) {

    showQuestionDecision(
      question,
      input,
      feedback,
      decision,
      punishment,
      reveal,
      checkButton
    );

    return;
  }


  // ----------------------------------------------------------
  // BELOW 4 ATTEMPTS
  // ----------------------------------------------------------

  input.value =
    "";

  input.focus();


  debugLog(
    `Question ${question.id}: wrong attempt ${currentQuestionWrongAttempts}.`
  );
}


// ------------------------------------------------------------
// SHOW HINT
// ------------------------------------------------------------

function showQuestionHint(
  question,
  hintElement
) {

  if (
    !question.hint
  ) {
    return;
  }


  hintElement.innerHTML = `
    <span class="question-hint-label">
      Hint ♡
    </span>

    <span class="question-hint-text">
      ${escapeQuestionHTML(question.hint)}
    </span>
  `;


  hintElement.classList.add(
    "is-visible"
  );
}


// ------------------------------------------------------------
// SHOW YES / NO DECISION
// ------------------------------------------------------------

function showQuestionDecision(
  question,
  input,
  feedback,
  decision,
  punishment,
  reveal,
  checkButton
) {

  questionLocked =
    true;


  input.disabled =
    true;

  checkButton.disabled =
    true;


  decision.innerHTML = `
    <div class="question-decision-title">
      Want to try again? ♡
    </div>

    <div class="question-decision-text">
      Or increase your incorrect answer count?
    </div>

    <div class="question-decision-buttons">

      <button
        type="button"
        class="question-decision-yes"
      >
        YES, I'LL TRY AGAIN
      </button>

      <button
        type="button"
        class="question-decision-no"
      >
        NO, COUNT IT
      </button>

    </div>
  `;


  decision.classList.add(
    "is-visible"
  );


  const yesButton =
    decision.querySelector(
      ".question-decision-yes"
    );


  const noButton =
    decision.querySelector(
      ".question-decision-no"
    );


  // ----------------------------------------------------------
  // YES
  // ----------------------------------------------------------

  yesButton.addEventListener(
    "click",
    () => {

      startKissPunishment(
        question,
        input,
        feedback,
        decision,
        punishment,
        reveal,
        checkButton
      );

    }
  );


  // ----------------------------------------------------------
  // NO
  // ----------------------------------------------------------

  noButton.addEventListener(
    "click",
    () => {

      markQuestionIncorrect(
        question,
        input,
        feedback,
        decision,
        punishment,
        reveal
      );

    }
  );
}


// ------------------------------------------------------------
// YES → KISS HIM PUNISHMENT
// ------------------------------------------------------------

function startKissPunishment(
  question,
  input,
  feedback,
  decision,
  punishment,
  reveal,
  checkButton
) {

  questionLocked =
    true;


  decision.classList.remove(
    "is-visible"
  );


  punishmentSecondsRemaining =
    QUESTION_GAME_CONFIG.punishmentSeconds;


  punishment.innerHTML = `
    <div class="question-punishment-title">
      Okay... you're forgiven. ♡
    </div>

    <div class="question-punishment-text">
      But first...
    </div>

    <div class="question-punishment-kiss">
      KISS HIM 💋
    </div>

    <div class="question-punishment-timer">
      ${punishmentSecondsRemaining}
    </div>

    <div class="question-punishment-small">
      seconds
    </div>
  `;


  punishment.classList.add(
    "is-active"
  );


  clearPunishmentTimer();


  punishmentInterval =
    setInterval(
      () => {

        punishmentSecondsRemaining--;


        const timer =
          punishment.querySelector(
            ".question-punishment-timer"
          );


        if (timer) {

          timer.textContent =
            punishmentSecondsRemaining;
        }


        if (
          punishmentSecondsRemaining <=
          0
        ) {

          clearPunishmentTimer();


          finishKissPunishment(
            question,
            input,
            feedback,
            decision,
            punishment,
            reveal,
            checkButton
          );

        }

      },
      1000
    );


  debugLog(
    "Kiss punishment started."
  );
}


// ------------------------------------------------------------
// FINISH KISS PUNISHMENT
// ------------------------------------------------------------

function finishKissPunishment(
  question,
  input,
  feedback,
  decision,
  punishment,
  reveal,
  checkButton
) {

  questionLocked =
    false;


  punishment.classList.remove(
    "is-active"
  );


  punishment.innerHTML = `
    <div class="question-punishment-finished">
      Okay... you're forgiven. ♡
    </div>
  `;


  feedback.textContent =
    "Now try again. ♡";


  feedback.classList.remove(
    "is-wrong"
  );


  input.disabled =
    false;

  checkButton.disabled =
    false;


  input.value =
    "";


  setTimeout(
    () => {

      input.focus();

    },
    100
  );


  debugLog(
    `Question ${question.id} unlocked after punishment.`
  );
}


// ------------------------------------------------------------
// NO → INCORRECT
// ------------------------------------------------------------

function markQuestionIncorrect(
  question,
  input,
  feedback,
  decision,
  punishment,
  reveal
) {

  clearPunishmentTimer();


  questionLocked =
    true;


  question.completed =
    true;

  question.result =
    "incorrect";


  incorrectQuestionCount++;


  decision.classList.remove(
    "is-visible"
  );


  feedback.textContent =
    "Okay... I'm counting that one. 😭";


  feedback.classList.remove(
    "is-wrong"
  );

  feedback.classList.add(
    "is-revealed"
  );


  // ----------------------------------------------------------
  // SHOW REAL ANSWER
  // ----------------------------------------------------------

  reveal.innerHTML = `
    <div class="question-reveal-title">
      The real answer was:
    </div>

    <div class="question-reveal-answer">
      ${escapeQuestionHTML(question.answer)}
    </div>
  `;


  reveal.classList.add(
    "is-visible"
  );


  input.value =
    question.answer;


  input.disabled =
    true;


  updateQuestionCounters();


  debugLog(
    `Question ${question.id} counted as incorrect.`
  );


  // Move to next question.
  setTimeout(
    () => {

      questionIndex++;

      renderCurrentQuestion();

    },
    2200
  );
}


// ------------------------------------------------------------
// CLEAR TIMER
// ------------------------------------------------------------

function clearPunishmentTimer() {

  if (
    punishmentInterval !== null
  ) {

    clearInterval(
      punishmentInterval
    );

    punishmentInterval =
      null;
  }
}


// ------------------------------------------------------------
// ESCAPE HTML
// ------------------------------------------------------------

function escapeQuestionHTML(
  text
) {

  const temporary =
    document.createElement(
      "div"
    );


  temporary.textContent =
    text;


  return temporary.innerHTML;
}


// ------------------------------------------------------------
// FINAL SCREEN
// ------------------------------------------------------------

function renderQuestionComplete() {

  clearPunishmentTimer();


  questionLocked =
    true;


  if (questionBoard) {

    questionBoard.innerHTML = `
      <div class="questions-complete-card">

        <div class="questions-complete-heart">
          ♡
        </div>

        <p class="questions-complete-kicker">
          You made it through all of them
        </p>

        <h3>
          You really do know us. 🥹
        </h3>

        <p>
          ${correctQuestionCount} correct
          ·
          ${incorrectQuestionCount} incorrect
        </p>

        <div class="questions-complete-message">
          Okay... I think you've earned the next part. ♡
        </div>

      </div>
    `;
  }


  if (questionProgress) {

    questionProgress.textContent =
      `${questions.length} / ${questions.length}`;
  }


  if (questionContinue) {

    questionContinue.disabled =
      false;

    questionContinue.setAttribute(
      "aria-disabled",
      "false"
    );
  }
}


// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

function resetQuestions() {

  clearPunishmentTimer();


  questionIndex =
    0;

  correctQuestionCount =
    0;

  incorrectQuestionCount =
    0;

  currentQuestionWrongAttempts =
    0;

  questionLocked =
    false;


  questions.forEach(
    (question) => {

      question.wrongAttempts =
        0;

      question.completed =
        false;

      question.result =
        null;
    }
  );


  renderCurrentQuestion();

  updateQuestionCounters();


  debugLog(
    "Question game reset."
  );
}


// ------------------------------------------------------------
// TEST MODE
// ------------------------------------------------------------

function revealAllQuestions() {

  if (
    !isTestMode()
  ) {
    return;
  }


  clearPunishmentTimer();


  questions.forEach(
    (question) => {

      question.completed =
        true;

      question.result =
        "incorrect";
    }
  );


  correctQuestionCount =
    0;

  incorrectQuestionCount =
    questions.length;

  questionIndex =
    questions.length;


  renderQuestionComplete();

  updateQuestionCounters();


  debugLog(
    "All questions marked complete in test mode."
  );
}


// ------------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------------

function initializeQuestions() {

  if (
    questions.length === 0
  ) {

    if (questionBoard) {

      questionBoard.innerHTML = `
        <div class="questions-error-card">
          No questions could be loaded.
        </div>
      `;
    }


    console.error(
      "[OUR ANNIVERSARY] Question game has no valid questions."
    );

    return;
  }


  updateQuestionCounters();

  renderCurrentQuestion();


  debugLog(
    `Question game initialized with ${questions.length} questions.`
  );
}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

initializeQuestions();