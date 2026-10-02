// js/memories.js

(function () {
  "use strict";

  let memories = [];
  let currentIndex = 0;

  function getElements() {
    const section = document.getElementById("memories");

    if (!section) {
      console.error("[MEMORIES] #memories not found.");
      return null;
    }

    return {
      section,

      media: section.querySelector(".memory-media"),

      caption: section.querySelector(".memory-caption"),

      counter: section.querySelector(".memory-counter"),

      previous:
        section.querySelector(
          '[data-memory-action="previous"]'
        ) ||
        section.querySelector("#memory-previous") ||
        section.querySelector("#memory-prev"),

      next:
        section.querySelector(
          '[data-memory-action="next"]'
        ) ||
        section.querySelector("#memory-next")
    };
  }

  function updateCounter(elements) {
    if (!elements.counter) return;

    elements.counter.textContent =
      `${currentIndex + 1} / ${memories.length}`;
  }

  function renderMemory(elements) {
    if (!memories.length || !elements.media) {
      return;
    }

    const memory = memories[currentIndex];

    if (!memory) {
      return;
    }

    elements.media.innerHTML = "";

    let mediaElement;

    if (memory.type === "video") {
      mediaElement = document.createElement("video");

      mediaElement.controls = true;
      mediaElement.playsInline = true;
      mediaElement.preload = "metadata";

      mediaElement.setAttribute(
        "aria-label",
        memory.alt || "Memory video"
      );

      if (
        typeof SITE_CONFIG !== "undefined" &&
        SITE_CONFIG.memories &&
        SITE_CONFIG.memories.videoLoop === true
      ) {
        mediaElement.loop = true;
      }

    } else {
      mediaElement = document.createElement("img");

      mediaElement.loading = "lazy";
      mediaElement.decoding = "async";

      mediaElement.alt =
        memory.alt || "A special memory ♡";
    }

    mediaElement.src = memory.src;

    mediaElement.addEventListener("error", function () {
      console.error(
        "[MEMORIES] Could not load:",
        memory.src
      );

      elements.media.innerHTML = `
        <div class="memory-empty">
          <p>Couldn't load this memory ♡</p>
          <small>${memory.src}</small>
        </div>
      `;
    });

    elements.media.appendChild(mediaElement);

    // Caption
    if (elements.caption) {
      elements.caption.textContent =
        memory.caption || "";
    }

    // Counter
    updateCounter(elements);
  }

  function nextMemory(elements) {
    if (!memories.length) return;

    currentIndex =
      (currentIndex + 1) % memories.length;

    renderMemory(elements);
  }

  function previousMemory(elements) {
    if (!memories.length) return;

    currentIndex =
      (currentIndex - 1 + memories.length) %
      memories.length;

    renderMemory(elements);
  }

  function goToMemory(elements, index) {
    if (
      typeof index !== "number" ||
      index < 0 ||
      index >= memories.length
    ) {
      return;
    }

    currentIndex = index;

    renderMemory(elements);
  }

  function setupTouch(elements) {
    if (!elements.media) return;

    let touchStartX = 0;
    let touchEndX = 0;

    elements.media.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches.length) return;

        touchStartX =
          event.touches[0].clientX;
      },
      { passive: true }
    );

    elements.media.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches.length) return;

        touchEndX =
          event.changedTouches[0].clientX;

        const difference =
          touchStartX - touchEndX;

        if (Math.abs(difference) < 50) {
          return;
        }

        if (difference > 0) {
          nextMemory(elements);
        } else {
          previousMemory(elements);
        }
      },
      { passive: true }
    );
  }

  function setupKeyboard(elements) {
    document.addEventListener(
      "keydown",
      function (event) {
        const active =
          document.activeElement;

        if (
          active &&
          (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT"
          )
        ) {
          return;
        }

        if (event.key === "ArrowRight") {
          nextMemory(elements);
        }

        if (event.key === "ArrowLeft") {
          previousMemory(elements);
        }
      }
    );
  }

  function initialize() {
    const elements = getElements();

    if (!elements) return;

    memories = Array.isArray(window.MEMORIES)
      ? window.MEMORIES
      : [];

    if (!memories.length) {
      console.error(
        "[MEMORIES] No memory data found."
      );

      if (elements.counter) {
        elements.counter.textContent = "0 / 0";
      }

      return;
    }

    console.log(
      `[MEMORIES] ${memories.length} memories loaded.`
    );

    // Next
    if (elements.next) {
      elements.next.addEventListener(
        "click",
        function () {
          nextMemory(elements);
        }
      );
    }

    // Previous
    if (elements.previous) {
      elements.previous.addEventListener(
        "click",
        function () {
          previousMemory(elements);
        }
      );
    }

    setupTouch(elements);
    setupKeyboard(elements);

    // Show first memory
    renderMemory(elements);

    // Public API
    window.Memories = {
      next: function () {
        nextMemory(elements);
      },

      previous: function () {
        previousMemory(elements);
      },

      goTo: function (index) {
        goToMemory(elements, index);
      },

      getCurrentIndex: function () {
        return currentIndex;
      },

      getTotal: function () {
        return memories.length;
      },

      refresh: function () {
        renderMemory(elements);
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();