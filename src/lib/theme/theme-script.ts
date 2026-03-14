export const themeScript = `
(() => {
  const root = document.documentElement;
  const storedMode = localStorage.getItem("openclaw-ui.theme.mode") || "system";
  const storedAccent = localStorage.getItem("openclaw-ui.theme.accent") || "claw";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = storedMode === "dark" || (storedMode === "system" && prefersDark);
  root.classList.toggle("dark", isDark);
  root.dataset.theme = storedAccent;
})();
`;
