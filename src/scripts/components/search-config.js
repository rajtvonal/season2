function getSearchConfig(mode) {
  const configs = {
    settings: {
      elements: () => document.querySelectorAll(".container.settings"),
      getText: el => el.innerText.toLowerCase(),
      getHighlightTargets: el => el.querySelectorAll(".level-1-title, .level-2, .level-3, span")
    },
    rules: {
      elements: () => document.querySelectorAll(".level-1, .level-2, .level-3"),
      getText: el => el.innerText.toLowerCase(),
      getHighlightTargets: el => el.querySelectorAll(".level-text, .level-1-title, .level-2-title, .level-3-title")
    },
    table: {
      elements: () => document.querySelectorAll("#tbody tr"),
      getText: el => {
        const nameEl = el.querySelector(".name");
        return nameEl ? nameEl.innerText.toLowerCase() : "";
      },
      getHighlightTargets: el => {
        const nameEl = el.querySelector(".name");
        return nameEl ? [nameEl] : [];
      }
    },
    list: {
      elements: () => document.querySelectorAll(".search-item"),
      getText: el => el.innerText.toLowerCase(),
      getHighlightTargets: el => [el]
    }
  };

  if (!configs[mode]) {
    console.warn("Unknown search mode:", mode);
    return null;
  }

  return configs[mode];
}
