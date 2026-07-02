const themeBtn = createThemeButton();

function createThemeButton() {
  const button = document.createElement("div");
  button.className = "theme-toggle";
  button.innerHTML = `🌙`;
  button.onclick = toggleTheme;

  document.body.appendChild(button);

  return button;
}

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
