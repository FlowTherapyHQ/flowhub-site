"use strict";

/* =========================================================
   SPAFLOW — PREMIUM INTERACTION SYSTEM
   Clean version: no lights, no ambient drift
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const spaFlow = document.querySelector(".spaflow-luxury");

  if (!spaFlow) {
    return;
  }

  const treatments = [
    ...spaFlow.querySelectorAll(".spaflow-treatment"),
  ];

  const revealItems = [
    ...treatments,
    spaFlow.querySelector(".spaflow-seasonal"),
    spaFlow.querySelector(".spaflow-final-cta"),
  ].filter(Boolean);

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;


  /* =======================================================
     01. REDUCED MOTION
     ======================================================= */

  if (prefersReducedMotion) {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });

    return;
  }


  /* =======================================================
     02. SCROLL REVEAL
     ======================================================= */

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible",
          );

          observer.unobserve(
            entry.target,
          );
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });


  /* =======================================================
     03. CURRENT TREATMENT EMPHASIS
     ======================================================= */

  const activeObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-active",
            entry.isIntersecting,
          );
        });
      },
      {
        threshold: 0.52,
      },
    );

  treatments.forEach((treatment) => {
    activeObserver.observe(treatment);
  });


  /* =======================================================
     04. SUBTLE IMAGE DEPTH
     ======================================================= */

  let ticking = false;

  const updateImageDepth = () => {
    const viewportCenter =
      window.innerHeight / 2;

    treatments.forEach((treatment) => {
      const media =
        treatment.querySelector(
          ".spaflow-treatment-media",
        );

      if (!media) {
        return;
      }

      const bounds =
        treatment.getBoundingClientRect();

      const treatmentCenter =
        bounds.top +
        bounds.height / 2;

      const distance =
        treatmentCenter -
        viewportCenter;

      const imageShift =
        Math.max(
          -6,
          Math.min(
            6,
            distance * -0.012,
          ),
        );

      media.style.setProperty(
        "--spaflow-image-shift",
        `${imageShift}px`,
      );
    });

    ticking = false;
  };


  const requestImageDepthUpdate = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(
      updateImageDepth,
    );

    ticking = true;
  };


  window.addEventListener(
    "scroll",
    requestImageDepthUpdate,
    {
      passive: true,
    },
  );

  window.addEventListener(
    "resize",
    requestImageDepthUpdate,
  );

  updateImageDepth();
});