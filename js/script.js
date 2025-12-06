
document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var body = document.body;

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var navLinks = document.querySelectorAll(".main-nav a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("nav-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  var productCards = document.querySelectorAll(".product-card[data-product-href]");
  productCards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        return;
      }
      var href = card.getAttribute("data-product-href");
      if (href) {
        window.location.href = href;
      }
    });
  });

  var galleries = document.querySelectorAll("[data-gallery]");
  galleries.forEach(function (gallery) {
    var mainImg = gallery.querySelector("[data-gallery-main]");
    var thumbs = gallery.querySelectorAll(".gallery-thumb");

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var src = thumb.getAttribute("data-gallery-src");
        if (src && mainImg) {
          mainImg.src = src;
        }
        thumbs.forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
      });
    });

    if (mainImg) {
      mainImg.addEventListener("click", function () {
        openLightbox(gallery, mainImg);
      });
    }
  });

  function openLightbox(gallery, mainImg) {
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-thumb"));
    if (!thumbs.length) return;

    var images = thumbs.map(function (thumb) {
      return thumb.getAttribute("data-gallery-src");
    });

    var currentIndex = 0;
    var currentSrc = mainImg.getAttribute("src");
    var initialIndex = images.indexOf(currentSrc);
    if (initialIndex >= 0) {
      currentIndex = initialIndex;
    }

    var overlay = document.createElement("div");
    overlay.className = "gallery-lightbox";

    var inner = document.createElement("div");
    inner.className = "gallery-lightbox-inner";

    var img = document.createElement("img");
    img.src = images[currentIndex] || currentSrc;

    var btnClose = document.createElement("button");
    btnClose.className = "gallery-lightbox-close";
    btnClose.type = "button";
    btnClose.innerHTML = "×";

    var btnPrev = document.createElement("button");
    btnPrev.className = "gallery-lightbox-prev";
    btnPrev.type = "button";
    btnPrev.innerHTML = "‹";

    var btnNext = document.createElement("button");
    btnNext.className = "gallery-lightbox-next";
    btnNext.type = "button";
    btnNext.innerHTML = "›";

    inner.appendChild(img);
    inner.appendChild(btnClose);
    inner.appendChild(btnPrev);
    inner.appendChild(btnNext);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Показываем
    requestAnimationFrame(function () {
      overlay.classList.add("is-visible");
    });

    function updateImage() {
      img.src = images[currentIndex];
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    }

    btnPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showPrev();
    });

    btnNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showNext();
    });

    btnClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeOverlay();
    });

    overlay.addEventListener("click", function () {
      closeOverlay();
    });

    inner.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    function closeOverlay() {
      overlay.classList.remove("is-visible");
      setTimeout(function () {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 200);
    }

    function keyHandler(e) {
      if (e.key === "Escape") {
        closeOverlay();
        document.removeEventListener("keydown", keyHandler);
      }
      if (e.key === "ArrowLeft") {
        showPrev();
      }
      if (e.key === "ArrowRight") {
        showNext();
      }
    }

    document.addEventListener("keydown", keyHandler);
  }
});
