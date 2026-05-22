const themeBtn = document.querySelector(".theme-toggle");

function setThemeButton(isLight) {
  if (!themeBtn) return;
  themeBtn.textContent = isLight ? "☀️" : "🌙";
}

function applySavedTheme() {
  const isLight = localStorage.getItem("theme") === "light";
  document.body.classList.toggle("light", isLight);
  setThemeButton(isLight);
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  setThemeButton(isLight);
}

applySavedTheme();
