document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("open");
      }
    });
  }

  const fadeElements = document.querySelectorAll(".fade-up");
  if (fadeElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.14 });

    fadeElements.forEach((el) => observer.observe(el));
  }

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  setupHeroSlider();
  setupHomeStatsSlider();
  setupHomeServicesSlider();
  setupServicesMetricsSlider();
  setupTestimonials();
  setupGalleryFilters();
  setupModals();
});

function submitForm() {
  const name = document.getElementById("fname");
  const email = document.getElementById("femail");
  const message = document.getElementById("fmessage");
  const successEl = document.getElementById("form-success");

  if (!name || !email || !message || !successEl) {
    return;
  }

  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    alert("Please fill in the required fields: name, email, and message.");
    return;
  }

  successEl.style.display = "block";

  ["fname", "femail", "fphone", "fservice", "fmessage"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = "";
    }
  });

  setTimeout(() => {
    successEl.style.display = "none";
  }, 5000);
}

function setupHeroSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");

  if (!slides.length || !dots.length) {
    return;
  }

  let currentSlide = 0;

  const showSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  window.setInterval(nextSlide, 5000);
}

function setupTestimonials() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialDots = document.querySelectorAll(".testi-dot");
  const track = document.querySelector(".testimonial-track");

  if (!testimonialSlides.length || !testimonialDots.length || !track) {
    return;
  }

  let currentTestimonial = 0;

  const showTestimonial = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    testimonialDots.forEach((dot) => dot.classList.remove("active"));
    testimonialDots[index].classList.add("active");
    currentTestimonial = index;
  };

  const nextTestimonial = () => {
    const nextIndex = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(nextIndex);
  };

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => showTestimonial(index));
  });

  window.setInterval(nextTestimonial, 4000);
}

function setupHomeServicesSlider() {
  const track = document.querySelector(".home-services-slider");
  const sliderWindow = document.querySelector(".services-slider-window");

  if (!track || !sliderWindow) {
    return;
  }

  const baseCards = Array.from(track.children).filter((card) => !card.hasAttribute("data-clone"));
  if (!baseCards.length) {
    return;
  }

  let currentIndex = 0;
  let visibleCards = 0;
  let autoSlideId = null;

  const getVisibleCards = () => {
    if (window.innerWidth <= 560) {
      return 1;
    }

    if (window.innerWidth <= 880) {
      return 2;
    }

    return Math.min(3, baseCards.length);
  };

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || "0");
  };

  const getStep = () => {
    const firstCard = track.querySelector(".service-card");
    return firstCard ? firstCard.getBoundingClientRect().width + getGap() : 0;
  };

  const resetTrackPosition = (animate) => {
    track.style.transition = animate ? "transform 0.8s ease" : "none";
    track.style.transform = `translateX(-${currentIndex * getStep()}px)`;
  };

  const rebuildClones = () => {
    track.querySelectorAll("[data-clone='true']").forEach((clone) => clone.remove());

    visibleCards = getVisibleCards();
    baseCards.slice(0, visibleCards).forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("data-clone", "true");
      track.appendChild(clone);
    });

    currentIndex = 0;
    resetTrackPosition(false);
  };

  const startAutoSlide = () => {
    if (autoSlideId) {
      window.clearInterval(autoSlideId);
    }

    autoSlideId = window.setInterval(() => {
      currentIndex += 1;
      resetTrackPosition(true);
    }, 3200);
  };

  track.addEventListener("transitionend", () => {
    if (currentIndex < baseCards.length) {
      return;
    }

    currentIndex = 0;
    resetTrackPosition(false);
  });

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      rebuildClones();
      startAutoSlide();
    }, 150);
  });

  rebuildClones();
  startAutoSlide();
}

function setupHomeStatsSlider() {
  const track = document.querySelector(".stats-bar .stats-grid");

  if (!track) {
    return;
  }

  const baseItems = Array.from(track.children).filter((item) => !item.hasAttribute("data-clone"));
  if (!baseItems.length) {
    return;
  }

  let currentIndex = 0;
  let visibleItems = 0;
  let autoSlideId = null;

  const isMobile = () => window.innerWidth <= 600;

  const getVisibleItems = () => (window.innerWidth <= 420 ? 1 : 2);

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || "0");
  };

  const getStep = () => {
    const firstItem = track.querySelector(".stat-item");
    return firstItem ? firstItem.getBoundingClientRect().width + getGap() : 0;
  };

  const resetTrackPosition = (animate) => {
    if (!isMobile()) {
      track.style.transition = "";
      track.style.transform = "";
      return;
    }

    track.style.transition = animate ? "transform 0.75s ease" : "none";
    track.style.transform = `translateX(-${currentIndex * getStep()}px)`;
  };

  const rebuildClones = () => {
    track.querySelectorAll("[data-clone='true']").forEach((clone) => clone.remove());

    if (!isMobile()) {
      currentIndex = 0;
      resetTrackPosition(false);
      return;
    }

    visibleItems = getVisibleItems();
    baseItems.slice(0, visibleItems).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("data-clone", "true");
      track.appendChild(clone);
    });

    currentIndex = 0;
    resetTrackPosition(false);
  };

  const startAutoSlide = () => {
    if (autoSlideId) {
      window.clearInterval(autoSlideId);
      autoSlideId = null;
    }

    if (!isMobile()) {
      return;
    }

    autoSlideId = window.setInterval(() => {
      currentIndex += 1;
      resetTrackPosition(true);
    }, 2600);
  };

  track.addEventListener("transitionend", () => {
    if (!isMobile() || currentIndex < baseItems.length) {
      return;
    }

    currentIndex = 0;
    resetTrackPosition(false);
  });

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      rebuildClones();
      startAutoSlide();
    }, 150);
  });

  rebuildClones();
  startAutoSlide();
}

function setupServicesMetricsSlider() {
  const track = document.querySelector(".page-services .metrics-grid");

  if (!track) {
    return;
  }

  const baseItems = Array.from(track.children).filter((item) => !item.hasAttribute("data-clone"));
  if (!baseItems.length) {
    return;
  }

  let currentIndex = 0;
  let visibleItems = 0;
  let autoSlideId = null;

  const isResponsive = () => window.innerWidth <= 980;

  const getVisibleItems = () => 1;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || "0");
  };

  const getStep = () => {
    const firstItem = track.querySelector(".metric-card");
    return firstItem ? firstItem.getBoundingClientRect().width + getGap() : 0;
  };

  const resetTrackPosition = (animate) => {
    if (!isResponsive()) {
      track.style.transition = "";
      track.style.transform = "";
      return;
    }

    track.style.transition = animate ? "transform 0.75s ease" : "none";
    track.style.transform = `translateX(-${currentIndex * getStep()}px)`;
  };

  const rebuildClones = () => {
    track.querySelectorAll("[data-clone='true']").forEach((clone) => clone.remove());

    if (!isResponsive()) {
      currentIndex = 0;
      resetTrackPosition(false);
      return;
    }

    visibleItems = getVisibleItems();
    baseItems.slice(0, visibleItems).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("data-clone", "true");
      track.appendChild(clone);
    });

    currentIndex = 0;
    resetTrackPosition(false);
  };

  const startAutoSlide = () => {
    if (autoSlideId) {
      window.clearInterval(autoSlideId);
      autoSlideId = null;
    }

    if (!isResponsive()) {
      return;
    }

    autoSlideId = window.setInterval(() => {
      currentIndex += 1;
      resetTrackPosition(true);
    }, 2800);
  };

  track.addEventListener("transitionend", () => {
    if (!isResponsive() || currentIndex < baseItems.length) {
      return;
    }

    currentIndex = 0;
    resetTrackPosition(false);
  });

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      rebuildClones();
      startAutoSlide();
    }, 150);
  });

  rebuildClones();
  startAutoSlide();
}

function setupGalleryFilters() {
  const filterChips = document.querySelectorAll(".filter-chip");
  const galleryCards = document.querySelectorAll(".gallery-card");

  if (!filterChips.length || !galleryCards.length) {
    return;
  }

  const getCategory = (card) => {
    const tag = card.querySelector(".tag");
    return tag ? tag.textContent.trim().toLowerCase() : "";
  };

  filterChips.forEach((chip) => {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");

    const applyFilter = () => {
      const label = chip.textContent.trim().toLowerCase();

      filterChips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");

      galleryCards.forEach((card) => {
        const category = getCategory(card);
        const shouldShow =
          label === "all views" ||
          (label === "plantations" && ["plantation", "estate", "landscape", "highlands"].includes(category)) ||
          (label === "training" && category === "training") ||
          (label === "irrigation" && category === "water") ||
          (label === "operations" && ["operations", "mechanization"].includes(category));

        card.style.display = shouldShow ? "" : "none";
      });
    };

    chip.addEventListener("click", applyFilter);
    chip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyFilter();
      }
    });
  });
}

function setupModals() {
  const modalTriggers = document.querySelectorAll("[data-modal-target]");
  const modalClosers = document.querySelectorAll("[data-modal-close]");

  const closeModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.getAttribute("data-modal-target");
      if (!targetId) {
        return;
      }

      const modal = document.getElementById(targetId);
      openModal(modal);
    });
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener("click", () => {
      const modal = closer.closest(".site-modal");
      closeModal(modal);
    });
  });

  document.querySelectorAll(".site-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    document.querySelectorAll(".site-modal.open").forEach((modal) => {
      closeModal(modal);
    });
  });
}
