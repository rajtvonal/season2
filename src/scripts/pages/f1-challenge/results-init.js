runWhenF1ResultsReady(async () => {
  await loadPoints();
  loadResults(document.getElementById("defaultBtn"));
});

function runWhenF1ResultsReady(callback) {
  if (document.readyState === "loading") {
    window.addEventListener("load", callback);
    return;
  }

  callback();
}
