const f1ResultsState = {
  pointsMap: {},
  sprintPointsMap: {},
  currentData: [],
  drivers: {},
  teams: {},
  teamRosters: {},
  races: [],
  sprints: [],
  qualis: [],
  eventColumns: []
};

const defaultResultsConfig = {
  databasePath: "../../database/F1",
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

function getPointsForPosition(position, isSprint = false) {
  const pointsMap = isSprint ? f1ResultsState.sprintPointsMap : f1ResultsState.pointsMap;
  return pointsMap[String(position).trim()] ?? 0;
}

function getDriverMeta(name) {
  return f1ResultsState.drivers[name] || { country: "hu", division: "" };
}

function getDriverTeam(name) {
  return f1ResultsState.teams[name] || "Fuggetlen";
}
