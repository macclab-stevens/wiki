/**
 * Move Material's search component from the hidden header into the top of
 * the left sidebar, so search is accessible without a top nav bar.
 * Material's own search JS uses the data-md-component attribute and element-level
 * event listeners — moving the element keeps all that wiring intact.
 */
(function () {
  "use strict";

  function moveSearchToSidebar() {
    var search = document.querySelector(".md-header .md-search");
    var sidebarInner = document.querySelector(
      ".md-sidebar--primary .md-sidebar__inner"
    );
    if (!search || !sidebarInner) return;
    if (sidebarInner.querySelector(".md-search")) return; // already moved
    sidebarInner.insertBefore(search, sidebarInner.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", moveSearchToSidebar);
  } else {
    moveSearchToSidebar();
  }

  // Re-run after each Material instant-navigation page swap
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(moveSearchToSidebar);
  }
})();
