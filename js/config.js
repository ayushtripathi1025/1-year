/* ============================================================
   OUR ANNIVERSARY
   Global configuration
   ============================================================

   IMPORTANT:
   - Keep personal/content data in the /data folder.
   - Keep website behaviour/settings here.
   - During development TEST_MODE should stay true.
   - Before deployment, set TEST_MODE to false.
   ============================================================ */

const SITE_CONFIG = {

    /* --------------------------------------------------------
       DEVELOPMENT / TESTING
       -------------------------------------------------------- */

    development: {

        /*
         * Master development switch.
         *
         * true  = testing features are available
         * false = production behaviour
         */
        TEST_MODE: false,

        /*
         * Skip the midnight lock while testing.
         *
         * true  = website opens immediately
         * false = real October 3 unlock is used
         *
         * Keep TEST_MODE = true when using this.
         */
        FORCE_UNLOCK: false,

        /*
         * Show useful debug information in the browser console.
         */
        DEBUG: true
    },


    /* --------------------------------------------------------
       IMPORTANT DATES
       -------------------------------------------------------- */

    dates: {

        /*
         * Relationship timer starts:
         *
         * January 10, 2025 at 12:00 PM
         */
        relationshipStart: "2025-01-10T12:00:00",

        /*
         * Celebration website unlocks:
         *
         * October 3, 2026 at 12:00 AM
         */
        celebrationUnlock: "2026-10-03T00:00:00",

        /*
         * Anniversary date:
         *
         * October 3, 2025
         */
        anniversaryDate: "2025-10-03"
    },


    /* --------------------------------------------------------
       PUZZLE SETTINGS
       -------------------------------------------------------- */

    puzzle: {

        /*
         * Grid size used on mobile.
         *
         * 3 = 3 × 3
         */
        mobileGridSize: 3,

        /*
         * Grid size used on desktop.
         *
         * 4 = 4 × 4
         */
        desktopGridSize: 4,

        /*
         * We will replace this with your actual photo path
         * when we build the puzzle.
         */
        image: "public/images/puzzle/puzzle-photo.jpg",

        /*
         * Allow the player to shuffle the puzzle again.
         */
        allowReset: true
    },


    /* --------------------------------------------------------
       CROSSWORD SETTINGS
       -------------------------------------------------------- */

    crossword: {

        /*
         * Show a hint after 2 incorrect attempts.
         */
        hintAfterAttempts: 2,

        /*
         * Expected number of questions.
         *
         * Actual questions will live in:
         *
         * data/crossword.js
         */
        minimumQuestions: 8,
        maximumQuestions: 12
    },


    /* --------------------------------------------------------
       MEMORY SLIDESHOW SETTINGS
       -------------------------------------------------------- */

    memories: {

        /*
         * Automatic slideshow is disabled.
         */
        autoPlay: false,

        /*
         * Used only if autoPlay is enabled later.
         *
         * 6000 milliseconds = 6 seconds.
         */
        autoPlayInterval: 6000,

        /*
         * Videos should not automatically play.
         */
        videoAutoplay: false,

        /*
         * Videos do not loop by default.
         */
        videoLoop: false
    },


    /* --------------------------------------------------------
       SONG SETTINGS
       -------------------------------------------------------- */

    songs: {

        /*
         * YouTube embeds only.
         */
        provider: "youtube",

        /*
         * Never automatically start music with sound.
         */
        autoplay: false,

        /*
         * Show YouTube player controls.
         */
        controls: true
    },


    /* --------------------------------------------------------
       MONTH HIGHLIGHTS
       -------------------------------------------------------- */

    months: {

        /*
         * Exactly 12 monthly photos.
         */
        total: 12,

        names: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
    },


    /* --------------------------------------------------------
       FINAL SURPRISE
       -------------------------------------------------------- */

    surprise: {

        /*
         * Final countdown:
         *
         * 5 → 4 → 3 → 2 → 1
         */
        countdownSeconds: 5
    },


    /* --------------------------------------------------------
       SITE BEHAVIOUR
       -------------------------------------------------------- */

    site: {

        /*
         * Sections will unlock progressively.
         */
        progressiveUnlock: true,

        /*
         * Enable smooth navigation.
         */
        smoothNavigation: true
    }
};


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

/*
 * Check whether the website is running in test mode.
 */
function isTestMode() {
    return SITE_CONFIG.development.TEST_MODE === true;
}


/*
 * Check whether we should bypass the real midnight lock.
 */
function shouldForceUnlock() {
    return (
        SITE_CONFIG.development.TEST_MODE === true &&
        SITE_CONFIG.development.FORCE_UNLOCK === true
    );
}


/*
 * Debug helper.
 *
 * Example:
 *
 * debugLog("Puzzle loaded");
 *
 * Messages only appear when DEBUG is enabled.
 */
function debugLog(...messages) {

    if (
        SITE_CONFIG.development.TEST_MODE === true &&
        SITE_CONFIG.development.DEBUG === true
    ) {
        console.log("[OUR ANNIVERSARY]", ...messages);
    }
}


/* ============================================================
   DATE INITIALIZATION
   ============================================================ */

const relationshipStartDate = new Date(
    SITE_CONFIG.dates.relationshipStart
);

const celebrationUnlockDate = new Date(
    SITE_CONFIG.dates.celebrationUnlock
);


/* ============================================================
   DATE VALIDATION
   ============================================================ */

if (Number.isNaN(relationshipStartDate.getTime())) {

    console.error(
        "[OUR ANNIVERSARY] Invalid relationship start date."
    );
}


if (Number.isNaN(celebrationUnlockDate.getTime())) {

    console.error(
        "[OUR ANNIVERSARY] Invalid celebration unlock date."
    );
}


/* ============================================================
   PARSED APPLICATION DATES
   ============================================================ */

const APP_DATES = {

    relationshipStart: relationshipStartDate,

    celebrationUnlock: celebrationUnlockDate

};


/* ============================================================
   DEBUG INFORMATION
   ============================================================ */

debugLog(
    "Configuration loaded.",
    {
        testMode: SITE_CONFIG.development.TEST_MODE,
        forceUnlock: SITE_CONFIG.development.FORCE_UNLOCK,
        relationshipStart: APP_DATES.relationshipStart,
        celebrationUnlock: APP_DATES.celebrationUnlock
    }
);