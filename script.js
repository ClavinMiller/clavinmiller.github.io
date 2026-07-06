document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");

  // Mobile navigation: keep aria state synchronized for keyboard users.
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuButton.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Automatically highlight the current primary navigation item.
  const path = window.location.pathname.replace(/\\/g, "/");
  const currentFile = path.split("/").pop() || "index.html";
  const activeFile = path.includes("/projects/") ? "projects.html" : currentFile;
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.endsWith(activeFile)) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Subtle entrance animation; disabled by CSS when reduced motion is preferred.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Notes category filter.
  const filters = document.querySelectorAll("[data-filter]");
  const notes = document.querySelectorAll("[data-category]");
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const selected = button.dataset.filter;
      notes.forEach((note) => {
        note.hidden = selected !== "all" && note.dataset.category !== selected;
      });
    });
  });
});
