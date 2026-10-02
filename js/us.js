// js/us.js

(function () {
  "use strict";

  const photos = {
    "mini-you-photo": {
      src: "public/images/us/mini-you.jpg",
      alt: "Mini You"
    },

    "mine-me-photo": {
      src: "public/images/us/mine-me.jpg",
      alt: "Mine Me"
    },

    "us-photo": {
      src: "public/images/us/us.jpg",
      alt: "Us together"
    }
  };

  function loadUsPhotos() {
    Object.keys(photos).forEach(function (id) {
      const container =
        document.getElementById(id);

      if (!container) {
        return;
      }

      const image = document.createElement("img");

      image.src = photos[id].src;
      image.alt = photos[id].alt;
      image.loading = "lazy";

      image.className = "us-photo-image";

      image.onerror = function () {
        console.error(
          "[US] Could not load:",
          photos[id].src
        );
      };

      container.innerHTML = "";
      container.appendChild(image);
    });

    console.log("[US] Photos loaded.");
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      loadUsPhotos
    );
  } else {
    loadUsPhotos();
  }

})();