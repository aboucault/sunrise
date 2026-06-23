(function initMastheadModule(root) {
  function sunRotationForScroll(scrollY) {
    return Math.max(0, Math.round(scrollY * 0.35));
  }

  function applySunRotation(sun, scrollY) {
    sun.style.transform = `rotate(${sunRotationForScroll(scrollY)}deg)`;
  }

  function initSunScroll() {
    const suns = root.document ? root.document.querySelectorAll('.wordmark span') : [];

    if (!suns.length) {
      return;
    }

    let ticking = false;

    function update() {
      suns.forEach((sun) => applySunRotation(sun, root.scrollY || 0));
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      root.requestAnimationFrame(update);
    }

    update();
    root.addEventListener('scroll', requestUpdate, { passive: true });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sunRotationForScroll };
  }

  if (root.document) {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', initSunScroll);
    } else {
      initSunScroll();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
