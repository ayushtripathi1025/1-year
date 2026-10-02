// js/app.js

(function () {
  "use strict";

  function initializeApp() {
    console.log("[APP] Our Anniversary website starting...");

    setupSmoothNavigation();
    setupUnlockListener();
    setupSectionReveal();

    console.log("[APP] Website initialized.");
  }

  // --------------------------------------------------
  // SMOOTH NAVIGATION
  // --------------------------------------------------

  function setupSmoothNavigation() {
    const navigationLinks =
      document.querySelectorAll(
        'a[href^="#"]'
      );

    navigationLinks.forEach(function (link) {
      link.addEventListener(
        "click",
        function (event) {
          const targetId =
            link.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      );
    });
  }

  // --------------------------------------------------
  // UNLOCK EVENT
  // --------------------------------------------------

  function setupUnlockListener() {
    document.addEventListener(
      "anniversaryUnlocked",
      function () {
        console.log(
          "[APP] Anniversary website unlocked."
        );

        const mainSite =
          document.getElementById(
            "main-site"
          );

        if (mainSite) {
          mainSite.setAttribute(
            "aria-hidden",
            "false"
          );
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  // --------------------------------------------------
  // SECTION REVEAL
  // --------------------------------------------------

  function setupSectionReveal() {
    const sections =
      document.querySelectorAll(
        "main section"
      );

    if (!sections.length) {
      return;
    }

    // If IntersectionObserver isn't supported,
    // simply show everything.
    if (
      !("IntersectionObserver" in window)
    ) {
      sections.forEach(function (section) {
        section.classList.add(
          "section-visible"
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(
            function (entry) {
              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add(
                "section-visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // --------------------------------------------------
  // DEBUG INFORMATION
  // --------------------------------------------------

  function showDebugInfo() {
    if (
      typeof debugLog === "function"
    ) {
      debugLog(
        "Application ready.",
        {
          memories:
            window.Memories
              ? window.Memories.getTotal()
              : 0,

          songs:
            window.Songs
              ? window.Songs.getTotal()
              : 0,

          surprise:
            !!window.Surprise
        }
      );
    }
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        initializeApp();
        showDebugInfo();
      }
    );
  } else {
    initializeApp();
    showDebugInfo();
  }

})();