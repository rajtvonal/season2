function generateRules(text) {
  const container = document.querySelector(".container.rule");
  if (!container) return;

  container.innerHTML = "";
  const state = { currentL1: null, currentL2: null, currentL3: null };

  text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .forEach(line => appendRuleLine(container, state, line));
}

function appendRuleLine(container, state, line) {
  if (isLevel1(line)) {
    appendRuleLevel(container, state, "currentL1", "level-1", "level-1-title", line);
    state.currentL2 = null;
    state.currentL3 = null;
    return;
  }

  if (isLevel2(line)) {
    if (!state.currentL1) return;
    appendRuleLevel(state.currentL1, state, "currentL2", "level-2", "level-2-title", line);
    state.currentL3 = null;
    return;
  }

  if (isLevel3(line)) {
    if (!state.currentL2) return;
    appendRuleLevel(state.currentL2, state, "currentL3", "level-3", "level-3-title", line);
    return;
  }

  appendRuleText(state, line);
}

function appendRuleLevel(parent, state, key, className, titleClass, line) {
  const level = createDiv(className);
  level.innerHTML = `<div class="${titleClass}">${line}</div>`;
  parent.appendChild(level);
  state[key] = level;
}

function appendRuleText(state, line) {
  const textDiv = `<div class="level-text">${line}</div>`;
  const target = state.currentL3 || state.currentL2 || state.currentL1;
  if (target) target.innerHTML += textDiv;
}

function isLevel1(line) {
  return /^\d+\.\s/.test(line);
}

function isLevel2(line) {
  return /^\d+\.\d+\s/.test(line);
}

function isLevel3(line) {
  return /^\d+\.\d+\.\d+$/.test(line);
}

