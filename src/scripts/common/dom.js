function createDiv(className) {
  const div = document.createElement("div");
  div.className = className;
  return div;
}

function setClass(keepClasses, newClasses) {
  const selector = keepClasses
    .split(" ")
    .filter(Boolean)
    .map(cls => "." + cls)
    .join("");

  const el = document.querySelector(selector);
  if (!el) return;

  el.className = "";
  addClasses(el, keepClasses);
  addClasses(el, newClasses);
}

function addClasses(el, classNames = "") {
  classNames
    .split(" ")
    .filter(Boolean)
    .forEach(cls => el.classList.add(cls));
}
