runWhenSmResultsReady(() => {
  loadResults(document.getElementById("defaultBtn"));
});

function runWhenSmResultsReady(callback) {
  if (document.readyState === "loading") {
    window.addEventListener("load", callback);
    return;
  }

  callback();
}
