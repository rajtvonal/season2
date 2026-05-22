function initSearch({ inputId, noResultId, mode }) {
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById(inputId);
    const noResult = document.getElementById(noResultId);

    if (!input) {
      console.warn("Search input not found:", inputId);
      return;
    }

    const config = getSearchConfig(mode);
    if (!config) return;

    input.addEventListener("input", () => runSearch(input, noResult, config));
    bindSearchShortcut(input);
  });
}

function runSearch(input, noResult, config) {
  const val = input.value.toLowerCase().trim();
  const elements = Array.from(config.elements());

  saveOriginalHtml(elements, config.getHighlightTargets);
  resetSearch(elements, config.getHighlightTargets);

  if (val === "") {
    setNoResult(noResult, false);
    return;
  }

  const found = filterSearchResults(elements, val, config);
  setNoResult(noResult, !found);
}

function saveOriginalHtml(elements, getHighlightTargets) {
  elements.forEach(el => {
    getHighlightTargets(el).forEach(child => {
      if (!child.dataset.original) child.dataset.original = child.innerHTML;
    });
  });
}

function resetSearch(elements, getHighlightTargets) {
  elements.forEach(el => {
    el.style.display = "";
    getHighlightTargets(el).forEach(child => {
      child.innerHTML = child.dataset.original;
    });
  });
}

function filterSearchResults(elements, search, config) {
  let found = false;

  elements.forEach(el => {
    if (config.getText(el).includes(search)) {
      found = true;
      config.getHighlightTargets(el).forEach(child => highlightPreserveHTML(child, search));
      return;
    }

    el.style.display = "none";
  });

  return found;
}

function highlightPreserveHTML(element, search) {
  const regex = new RegExp(`(${escapeRegExp(search)})`, "gi");

  element.childNodes.forEach(node => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const span = document.createElement("span");
    span.innerHTML = node.textContent.replace(regex, `<span class="highlight">$1</span>`);
    node.replaceWith(span);
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setNoResult(noResult, isVisible) {
  if (noResult) noResult.style.display = isVisible ? "block" : "none";
}

function bindSearchShortcut(input) {
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
      e.preventDefault();
      input.focus();
    }
  });
}
