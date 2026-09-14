document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.dataset.famoriseColorMode === "night" ? "day" : "night";
  root.dataset.famoriseColorMode = next;
  document
    .querySelector("#theme-color-meta")
    ?.setAttribute("content", next === "night" ? "#070706" : "#f8f7f3");
  try {
    localStorage.setItem("famorise.web.color-mode", next);
  } catch {
    // The in-memory theme still works when persistent storage is disabled.
  }
});
