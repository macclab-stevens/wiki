/**
 * Sidebar collapse toggle for MACC Lab docs.
 * Inserts a hamburger button into the header; clicking it slides the left
 * navigation sidebar off-screen and expands the content area.
 * State is persisted in localStorage so it survives page navigation.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "macc-nav-collapsed";
  var BODY_CLASS  = "nav-collapsed";

  function insertToggleButton() {
    // Avoid duplicates on instant-navigation re-runs
    if (document.getElementById("nav-toggle-btn")) return;

    var header = document.querySelector(".md-header__inner");
    if (!header) return;

    var btn = document.createElement("button");
    btn.id = "nav-toggle-btn";
    btn.className = "md-header__button nav-toggle";
    btn.setAttribute("aria-label", "Toggle navigation");
    btn.setAttribute("title", "Toggle navigation");
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">' +
        '<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor"/>' +
      '</svg>';

    // Place as first child so it sits at the far left of the header
    header.insertBefore(btn, header.firstChild);

    // Restore persisted state
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      document.body.classList.add(BODY_CLASS);
    }

    btn.addEventListener("click", function () {
      document.body.classList.toggle(BODY_CLASS);
      localStorage.setItem(
        STORAGE_KEY,
        document.body.classList.contains(BODY_CLASS) ? "1" : "0"
      );
    });
  }

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertToggleButton);
  } else {
    insertToggleButton();
  }

  // Material instant-navigation: re-run after each SPA navigation
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(insertToggleButton);
  }
})();
