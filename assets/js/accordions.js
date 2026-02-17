(function () {
  const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

  const initGroup = ({ accordions, toggleButton, openText = "Open all", collapseText = "Collapse all" }) => {
    const items = Array.isArray(accordions) ? accordions : [];
    const reduceMotion = reducedMotionMedia.matches;
    const toggleLabel = toggleButton ? toggleButton.querySelector(".accordion-control-label") : null;
    let labelTimer = null;

    const allOpen = (controllers) =>
      controllers.length > 0 && controllers.every((controller) => controller.isOpen());

    const setToggleLabel = (controllers, animate) => {
      if (!toggleButton) {
        return;
      }

      const nextLabel = allOpen(controllers) ? collapseText : openText;

      if (!toggleLabel) {
        toggleButton.textContent = nextLabel;
        return;
      }

      if (toggleLabel.textContent === nextLabel) {
        return;
      }

      if (!animate || reduceMotion) {
        toggleLabel.textContent = nextLabel;
        return;
      }

      if (labelTimer) {
        clearTimeout(labelTimer);
      }

      toggleButton.classList.add("is-label-changing");
      labelTimer = window.setTimeout(() => {
        toggleLabel.textContent = nextLabel;
        toggleButton.classList.remove("is-label-changing");
        labelTimer = null;
      }, 120);
    };

    let controllers = [];

    const updateToggle = (animate = false) => {
      if (!toggleButton) {
        return;
      }

      toggleButton.disabled = controllers.length === 0;
      setToggleLabel(controllers, animate);
    };

    const createController = (accordion) => {
      const summary = accordion.querySelector(".project-summary");
      const content = accordion.querySelector(".project-content");

      if (!summary || !content) {
        return null;
      }

      if (reduceMotion) {
        return {
          isOpen: () => accordion.open,
          open: () => {
            accordion.open = true;
            updateToggle(true);
          },
          close: () => {
            accordion.open = false;
            updateToggle(true);
          }
        };
      }

      let isClosing = false;
      let isExpanding = false;
      accordion.classList.add("is-animated");

      const clearInlineContentStyles = () => {
        content.style.height = "";
        content.style.opacity = "";
        content.style.overflow = "";
      };

      const expand = () => {
        if (accordion.classList.contains("is-expanded") && !isClosing) {
          return;
        }

        const startHeight = isClosing ? content.offsetHeight : 0;

        isClosing = false;
        isExpanding = true;

        accordion.open = true;
        accordion.classList.add("is-expanded");
        content.style.overflow = "hidden";
        content.style.height = `${startHeight}px`;
        content.style.opacity = "0";
        void content.offsetHeight;
        content.style.height = `${content.scrollHeight}px`;
        content.style.opacity = "1";
        updateToggle(true);
      };

      const shrink = () => {
        if (!accordion.classList.contains("is-expanded") && !isExpanding) {
          return;
        }

        const startHeight = content.offsetHeight || content.scrollHeight;

        isExpanding = false;
        isClosing = true;
        content.style.overflow = "hidden";
        content.style.height = `${startHeight}px`;
        content.style.opacity = "1";
        accordion.classList.remove("is-expanded");
        void content.offsetHeight;
        content.style.height = "0px";
        content.style.opacity = "0";
        updateToggle(true);
      };

      summary.addEventListener("click", (event) => {
        if (event.target.closest(".project-summary-link")) {
          return;
        }

        event.preventDefault();

        if (isClosing || !accordion.classList.contains("is-expanded")) {
          expand();
          return;
        }

        if (isExpanding || accordion.classList.contains("is-expanded")) {
          shrink();
        }
      });

      content.addEventListener("transitionend", (event) => {
        if (event.propertyName !== "height" || event.target !== content) {
          return;
        }

        if (isClosing) {
          isClosing = false;
          accordion.open = false;
          clearInlineContentStyles();
          return;
        }

        if (isExpanding) {
          isExpanding = false;
          content.style.height = `${content.scrollHeight}px`;
          content.style.overflow = "";
          content.style.opacity = "";
        }
      });

      if (accordion.open) {
        accordion.classList.add("is-expanded");
        content.style.height = `${content.scrollHeight}px`;
        content.style.opacity = "1";
      }

      return {
        isOpen: () => accordion.classList.contains("is-expanded"),
        open: expand,
        close: shrink
      };
    };

    controllers = items.map(createController).filter(Boolean);

    const toggleAll = () => {
      const shouldCollapse = allOpen(controllers);

      controllers.forEach((controller) => {
        if (shouldCollapse && controller.isOpen()) {
          controller.close();
          return;
        }

        if (!shouldCollapse && !controller.isOpen()) {
          controller.open();
        }
      });
    };

    if (toggleButton) {
      toggleButton.addEventListener("click", toggleAll);
    }

    updateToggle();

    return {
      controllers,
      destroy: () => {
        if (toggleButton) {
          toggleButton.removeEventListener("click", toggleAll);
        }
        if (labelTimer) {
          clearTimeout(labelTimer);
        }
      }
    };
  };

  window.AccordionUtils = { initGroup };
})();
