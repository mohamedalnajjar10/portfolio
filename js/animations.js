/**
 * GloryTech Showcase - Animations & Numerical Counters Module
 * Dependencies: IntersectionObserver (Browser Native)
 * Exports: window.CounterController, window.GeneralController
 */

"use strict";

/* ==========================================================================
   4. HERO ANIMATED STAT COUNTERS
   ========================================================================== */
const CounterController = window.CounterController = (() => {
  const statCounters = document.querySelectorAll(".stat-counter");

  const init = () => {
    if (!statCounters.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounting(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    statCounters.forEach((counter) => observer.observe(counter));
  };

  const startCounting = (element) => {
    const targetVal = parseFloat(
      element.getAttribute("data-val") || element.getAttribute("data-target"),
    );
    const isDecimal = element.hasAttribute("data-decimals");
    const duration = 1800;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = ease * targetVal;

      element.textContent = isDecimal
        ? currentVal.toFixed(1)
        : Math.floor(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = isDecimal ? targetVal.toFixed(1) : targetVal;
      }
    };

    requestAnimationFrame(updateCount);
  };

  return { init };
})();


/* ==========================================================================
   11. GENERAL UTILITIES (SCROLL REVEAL, BACK TO TOP, YEAR)
   ========================================================================== */
const GeneralController = window.GeneralController = (() => {
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  const initBackToTop = () => {
    const backBtn = document.getElementById("back-to-top");
    if (!backBtn) return;

    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const initCurrentYear = () => {
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  const init = () => {
    initScrollReveal();
    initBackToTop();
    initCurrentYear();
  };

  return { init };
})();

