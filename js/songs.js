// js/songs.js

(function () {
  "use strict";

  let songs = [];
  let currentIndex = 0;

  function initialize() {
    const section = document.getElementById("songs");

    if (!section) {
      console.error("[SONGS] #songs section not found.");
      return;
    }

    songs = Array.isArray(window.SONGS)
      ? window.SONGS
      : [];

    if (!songs.length) {
      console.error("[SONGS] No song data found.");
      return;
    }

    // Create the complete songs interface
    let interfaceElement =
      section.querySelector(".songs-interface");

    if (!interfaceElement) {
      interfaceElement =
        document.createElement("div");

      interfaceElement.className =
        "songs-interface";

      section.appendChild(interfaceElement);
    }

    interfaceElement.innerHTML = `
      <div class="song-card">

        <!-- SINGLE MUSIC NOTE -->
        <div class="song-card-icon">
        </div>

        <div class="song-player-content">

          <p class="song-artist"></p>

          <h3 class="song-title"></h3>

          <div class="song-lines"></div>

          <p class="song-caption"></p>

          <a
            class="song-youtube-button"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            ♪ Listen on YouTube ↗
          </a>

        </div>

      </div>

      <div class="song-navigation">

        <button
          type="button"
          class="song-navigation-button"
          id="song-previous"
          aria-label="Previous song"
        >
          ←
        </button>

        <span
          class="song-counter"
          id="song-counter"
        >
          1 / ${songs.length}
        </span>

        <button
          type="button"
          class="song-navigation-button"
          id="song-next"
          aria-label="Next song"
        >
          →
        </button>

      </div>
    `;

    const elements = {
      card:
        interfaceElement.querySelector(
          ".song-card"
        ),

      icon:
        interfaceElement.querySelector(
          ".song-card-icon"
        ),

      artist:
        interfaceElement.querySelector(
          ".song-artist"
        ),

      title:
        interfaceElement.querySelector(
          ".song-title"
        ),

      lines:
        interfaceElement.querySelector(
          ".song-lines"
        ),

      caption:
        interfaceElement.querySelector(
          ".song-caption"
        ),

      youtube:
        interfaceElement.querySelector(
          ".song-youtube-button"
        ),

      previous:
        interfaceElement.querySelector(
          "#song-previous"
        ),

      next:
        interfaceElement.querySelector(
          "#song-next"
        ),

      counter:
        interfaceElement.querySelector(
          "#song-counter"
        )
    };

    function renderSong() {
      const song = songs[currentIndex];

      if (!song) {
        return;
      }

      // Artist
      elements.artist.textContent =
        song.artist || "";

      // Title
      elements.title.textContent =
        song.title || "";

      // Lyrics
      elements.lines.innerHTML = "";

      const lines =
        typeof song.lines === "string"
          ? song.lines.trim()
          : "";

      if (lines) {

        // IMPORTANT:
        // Split every newline into a separate lyric line.
        const lyricLines =
          lines
            .split(/\r?\n/)
            .map(function (line) {
              return line.trim();
            })
            .filter(Boolean);

        lyricLines.forEach(
          function (line) {

            const p =
              document.createElement("p");

            p.textContent = line;

            elements.lines.appendChild(p);
          }
        );
      }

      // Personal caption
      elements.caption.textContent =
        song.caption || "";

      // YouTube button
      elements.youtube.href =
        song.youtubeUrl || "#";

      if (!song.youtubeUrl) {
        elements.youtube.style.display =
          "none";
      } else {
        elements.youtube.style.display =
          "inline-flex";
      }

      // Counter
      elements.counter.textContent =
        `${currentIndex + 1} / ${songs.length}`;
    }

    function nextSong() {
      currentIndex =
        (currentIndex + 1) % songs.length;

      renderSong();
    }

    function previousSong() {
      currentIndex =
        (currentIndex - 1 + songs.length) %
        songs.length;

      renderSong();
    }

    // Buttons
    elements.next.addEventListener(
      "click",
      nextSong
    );

    elements.previous.addEventListener(
      "click",
      previousSong
    );

    // Keyboard navigation
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
          nextSong();
        }

        if (event.key === "ArrowLeft") {
          previousSong();
        }
      }
    );

    // Public API
    window.Songs = {
      next: nextSong,

      previous: previousSong,

      goTo: function (index) {
        if (
          index < 0 ||
          index >= songs.length
        ) {
          return;
        }

        currentIndex = index;

        renderSong();
      },

      getCurrentIndex: function () {
        return currentIndex;
      },

      getTotal: function () {
        return songs.length;
      },

      refresh: renderSong
    };

    // First song
    renderSong();

    console.log(
      `[SONGS] Loaded ${songs.length} songs.`
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();