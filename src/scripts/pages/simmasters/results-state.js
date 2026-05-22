const smResultsState = {
  currentData: [],
  races: [],
  qualis: [],
  teams: {}
};

const smResultsConfig = {
  databasePath: "../../database/SM",
  totalRaces: 8
};

function setCurrentData(data) {
  smResultsState.currentData = data;
}

function getCurrentData() {
  return smResultsState.currentData;
}

function getResultsConfig() {
  return smResultsConfig;
}

function getDriverTeam(name) {
  return smResultsState.teams[name] || "Független";
}
