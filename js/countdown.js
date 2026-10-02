/* ============================================================
   OUR ANNIVERSARY
   Celebration unlock countdown
   ============================================================

   RESPONSIBILITY:
   - Keep the website locked before October 3, 2026 at 12:00 AM.
   - Display the remaining time.
   - Unlock the website when the target time is reached.
   - Respect TEST_MODE / FORCE_UNLOCK from config.js.

   config.js MUST load before this file.
   ============================================================ */


/* ------------------------------------------------------------
   DOM ELEMENTS
   ------------------------------------------------------------ */

const siteLock = document.getElementById("site-lock");
const mainSite = document.getElementById("main-site");

const countdownDays = document.getElementById("countdown-days");
const countdownHours = document.getElementById("countdown-hours");
const countdownMinutes = document.getElementById("countdown-minutes");
const countdownSeconds = document.getElementById("countdown-seconds");

let unlockTimer = null;


/* ------------------------------------------------------------
   FORMAT NUMBER
   ------------------------------------------------------------ */

/*
 * Turns:
 *
 * 5 → "05"
 * 12 → "12"
 */
function formatCountdownNumber(number) {

    return String(number).padStart(2, "0");

}


/* ------------------------------------------------------------
   UPDATE COUNTDOWN DISPLAY
   ------------------------------------------------------------ */

function updateCountdownDisplay(timeRemaining) {

    const totalSeconds = Math.max(
        0,
        Math.floor(timeRemaining / 1000)
    );


    const days = Math.floor(
        totalSeconds / (24 * 60 * 60)
    );


    const hours = Math.floor(
        (totalSeconds % (24 * 60 * 60)) / (60 * 60)
    );


    const minutes = Math.floor(
        (totalSeconds % (60 * 60)) / 60
    );


    const seconds = totalSeconds % 60;


    countdownDays.textContent =
        formatCountdownNumber(days);

    countdownHours.textContent =
        formatCountdownNumber(hours);

    countdownMinutes.textContent =
        formatCountdownNumber(minutes);

    countdownSeconds.textContent =
        formatCountdownNumber(seconds);

}


/* ------------------------------------------------------------
   UNLOCK WEBSITE
   ------------------------------------------------------------ */

function unlockWebsite() {

    debugLog("Unlocking anniversary website.");


    /*
     * Stop the countdown interval.
     */
    if (unlockTimer !== null) {

        clearInterval(unlockTimer);

        unlockTimer = null;

    }


    /*
     * Mark the main website as available.
     */
    mainSite.classList.add("is-unlocked");

    mainSite.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Hide the lock screen.
     */
    siteLock.classList.add("is-hidden");

    siteLock.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Give the browser a chance to update the visual state
     * before moving focus/navigation.
     */
    setTimeout(() => {

        const hero = document.getElementById("hero");

        if (hero) {

            hero.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 150);


    /*
     * Tell the rest of the application that the website
     * has been unlocked.
     */
    document.dispatchEvent(
        new CustomEvent("anniversaryUnlocked")
    );

}


/* ------------------------------------------------------------
   KEEP WEBSITE LOCKED
   ------------------------------------------------------------ */

function keepWebsiteLocked() {

    mainSite.classList.remove("is-unlocked");

    mainSite.setAttribute(
        "aria-hidden",
        "true"
    );


    siteLock.classList.remove("is-hidden");

    siteLock.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ------------------------------------------------------------
   CHECK REAL UNLOCK TIME
   ------------------------------------------------------------ */

function checkUnlockTime() {

    /*
     * If testing has FORCE_UNLOCK enabled, bypass the
     * real date completely.
     */
    if (shouldForceUnlock()) {

        debugLog(
            "FORCE_UNLOCK is enabled."
        );

        unlockWebsite();

        return;

    }


    /*
     * Normal production behaviour.
     */
    const now = new Date();

    const unlockTime =
        APP_DATES.celebrationUnlock;


    const timeRemaining =
        unlockTime.getTime() - now.getTime();


    /*
     * Still locked.
     */
    if (timeRemaining > 0) {

        keepWebsiteLocked();

        updateCountdownDisplay(
            timeRemaining
        );

        return;

    }


    /*
     * Target time has arrived.
     */
    unlockWebsite();

}


/* ------------------------------------------------------------
   START COUNTDOWN
   ------------------------------------------------------------ */

function startUnlockCountdown() {

    debugLog(
        "Starting celebration unlock countdown."
    );


    /*
     * FORCE_UNLOCK means we don't need an interval.
     */
    if (shouldForceUnlock()) {

        unlockWebsite();

        return;

    }


    /*
     * Make the initial check immediately.
     */
    checkUnlockTime();


    /*
     * Update once every second.
     */
    unlockTimer = setInterval(() => {

        checkUnlockTime();

    }, 1000);

}


/* ------------------------------------------------------------
   INITIALIZE
   ------------------------------------------------------------ */

startUnlockCountdown();