(() => {
  let mode = document.documentElement.dataset.famoriseColorMode || "night";
  try {
    const saved = localStorage.getItem("famorise.web.color-mode");
    if (saved === "day" || saved === "night") {
      document.documentElement.dataset.famoriseColorMode = saved;
      mode = saved;
    }
  } catch {
    // Storage can be unavailable in hardened browser contexts.
  }
  document
    .querySelector("#theme-color-meta")
    ?.setAttribute("content", mode === "night" ? "#070706" : "#f8f7f3");
})();
