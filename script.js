document.addEventListener("DOMContentLoaded", () => {
  // Shared social links are injected once so every page stays consistent.
  const socialRail = document.createElement("aside");
  socialRail.className = "social-rail";
  socialRail.setAttribute("aria-label", "Social links");
  socialRail.innerHTML = `
    <span class="social-rail-label">Elsewhere</span>
    <a href="https://github.com/ClavinMiller" target="_blank" rel="noreferrer" aria-label="GitHub profile">GH</a>
    <a href="https://www.instagram.com/YUNHE1957" target="_blank" rel="noreferrer" aria-label="Instagram profile">IG</a>
  `;
  document.body.appendChild(socialRail);

  // Replace the original footer placeholder with the real profile URL.
  document.querySelectorAll('.footer-links a[href*="github.com/your-username"]').forEach((link) => {
    link.setAttribute("href", "https://github.com/ClavinMiller");
  });

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
  const noteCount = document.querySelector("[data-note-count]");
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const selected = button.dataset.filter;
      let visibleCount = 0;
      notes.forEach((note) => {
        const isVisible = selected === "all" || note.dataset.category === selected;
        note.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });
      if (noteCount) noteCount.textContent = String(visibleCount);
    });
  });
});
