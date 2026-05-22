const f1ResultsState = {
  pointsMap: {},
  currentData: []
};

const defaultResultsConfig = {
  databasePath: "../../database/F1",
  resultsFile: "F1Challenge_results.csv",
  totalRaces: 12
};

function getResultsConfig() {
  return {
    ...defaultResultsConfig,
    ...(window.RAJTVONAL_RESULTS_CONFIG || {})
  };
}

function setCurrentData(data) {
  f1ResultsState.currentData = data;
}

function getCurrentData() {
  return f1ResultsState.currentData;
}

function getPointsForPosition(position) {
  return f1ResultsState.pointsMap[position.trim()] ?? 0;
}
