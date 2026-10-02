// js/final-surprise.js

(function () {
  "use strict";

  function initializeSurprise() {
    const section = document.getElementById("surprise");

    if (!section) {
      console.error("[SURPRISE] #surprise section not found.");
      return;
    }

    console.log("[SURPRISE] Initializing...");

    // --------------------------------------------------
    // INITIAL FINAL SURPRISE SCREEN
    // --------------------------------------------------

    section.innerHTML = `
      <div class="surprise-wrapper">

        <div class="surprise-label">
          ONE LAST THING
        </div>

        <h2 class="surprise-heading">
          One Last Thing
        </h2>

        <div class="surprise-card">

          <div class="surprise-heart-decoration">
            ♡
          </div>

          <div class="surprise-content">

            <div class="surprise-emoji">
              🎁
            </div>

            <h3 class="surprise-result-title">
              Your final surprise is waiting...
            </h3>

            <p class="surprise-result-text">
              You made it all the way here.
            </p>

            <p class="surprise-result-text">
              But there's one last little thing
              I want you to do. ♡
            </p>

            <button
              type="button"
              class="surprise-button surprise-final-button"
              id="reveal-final-surprise"
            >
              REVEAL MY FINAL SURPRISE ♡
            </button>

          </div>

        </div>

      </div>
    `;

    const revealButton =
      document.getElementById(
        "reveal-final-surprise"
      );

    if (!revealButton) {
      console.error(
        "[SURPRISE] Reveal button not found."
      );

      return;
    }

    // --------------------------------------------------
    // SHOW THE YES / NO QUESTION
    // --------------------------------------------------

    function showQuestion() {
      section.innerHTML = `
        <div class="surprise-wrapper">

          <div class="surprise-label">
            ONE LAST THING
          </div>

          <h2 class="surprise-heading">
            One Last Thing
          </h2>

          <div class="surprise-card">

            <div class="surprise-heart-decoration">
              ♡
            </div>

            <div class="surprise-content">

              <div class="surprise-emoji">
                🥺
              </div>

              <h3 class="surprise-question">
                Are you with him right now?
              </h3>

              <p class="surprise-subtitle">
                Be honest. I know you're tempted to cheat. 😭
              </p>

              <div class="surprise-buttons">

                <button
                  type="button"
                  class="surprise-button surprise-yes"
                  id="surprise-yes"
                >
                  YES ♡
                </button>

                <button
                  type="button"
                  class="surprise-button surprise-no"
                  id="surprise-no"
                >
                  NO 😭
                </button>

              </div>

            </div>

          </div>

        </div>
      `;

      setupQuestion();
    }

    // --------------------------------------------------
    // NO
    // --------------------------------------------------

    function showNo() {
      const card =
        section.querySelector(
          ".surprise-card"
        );

      card.innerHTML = `
        <div class="surprise-content surprise-no-result">

          <div class="surprise-emoji">
            😭
          </div>

          <h3 class="surprise-result-title">
            Hawwww 😭
          </h3>

          <p class="surprise-result-text">
            Still not together?
          </p>

          <p class="surprise-result-text">
            Get him on the phone.<br>
            Tell him to come.
          </p>

          <p class="surprise-waiting">
            Your surprise is waiting. ♡
          </p>

          <div class="surprise-result-heart">
            ♡
          </div>

        </div>
      `;
    }

    // --------------------------------------------------
    // YES
    // --------------------------------------------------

    function showEyesClosed() {
      const card =
        section.querySelector(
          ".surprise-card"
        );

      card.innerHTML = `
        <div class="surprise-content surprise-before-countdown">

          <div class="surprise-emoji">
            🙈
          </div>

          <h3 class="surprise-result-title">
            Okay…
          </h3>

          <p class="surprise-result-text">
            Close your eyes.
          </p>

          <p class="surprise-result-text">
            Seriously. Don't cheat. ♡
          </p>

          <div
            class="surprise-countdown"
            id="surprise-countdown"
            aria-live="assertive"
          >
            5
          </div>

        </div>
      `;

      startCountdown();
    }

    // --------------------------------------------------
    // COUNTDOWN
    // --------------------------------------------------

    function startCountdown() {
      const countdown =
        document.getElementById(
          "surprise-countdown"
        );

      if (!countdown) {
        return;
      }

      let number = 5;

      const timer = setInterval(
        function () {
          number--;

          if (number > 0) {
            countdown.textContent = number;
            return;
          }

          clearInterval(timer);

          countdown.textContent = "♡";

          setTimeout(
            function () {
              showFinalMessage();
            },
            800
          );
        },
        1000
      );
    }

    // --------------------------------------------------
    // FINAL MESSAGE
    // --------------------------------------------------

    function showFinalMessage() {
      const card =
        section.querySelector(
          ".surprise-card"
        );

      card.innerHTML = `
        <div class="surprise-content surprise-final-result">

          <div class="surprise-final-heart">
            ♡
          </div>

          <div class="surprise-emoji">
            🥹
          </div>

          <p class="surprise-small-label">
            MY FAVOURITE PERSON
          </p>

          <h3 class="surprise-final-title">
            You made it.
          </h3>

          <p class="surprise-final-text">
            One year later…
          </p>

          <p class="surprise-final-text">
            and somehow I still look at you
            and think,
          </p>

          <p class="surprise-big-text">
            "Yep. Still her."
          </p>

          <p class="surprise-final-text">
            My favourite baddie.<br>
            My favourite person.<br>
            My favourite us. ♡
          </p>

          <div class="surprise-final-decoration">
            ✦ ♡ ✦
          </div>

        </div>
      `;
    }

    // --------------------------------------------------
    // YES / NO SETUP
    // --------------------------------------------------

    function setupQuestion() {
      const yesButton =
        document.getElementById(
          "surprise-yes"
        );

      const noButton =
        document.getElementById(
          "surprise-no"
        );

      if (yesButton) {
        yesButton.addEventListener(
          "click",
          showEyesClosed
        );
      }

      if (noButton) {
        noButton.addEventListener(
          "click",
          showNo
        );
      }
    }

    // --------------------------------------------------
    // REVEAL BUTTON
    // --------------------------------------------------

    revealButton.addEventListener(
      "click",
      function () {
        revealButton.disabled = true;

        showQuestion();
      }
    );

    // --------------------------------------------------
    // PUBLIC API
    // --------------------------------------------------

    window.Surprise = {
      reveal: showQuestion,
      yes: showEyesClosed,
      no: showNo
    };

    console.log(
      "[SURPRISE] Ready."
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initializeSurprise
    );
  } else {
    initializeSurprise();
  }

})();