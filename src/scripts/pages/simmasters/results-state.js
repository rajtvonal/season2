const smResultsState = {
  currentData: [],
  races: [],
  qualis: [],
  teams: {},
  drivers: {}
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
  return smResultsState.teams[name] || "Fuggetlen";
}

function getDriverCountry(name) {
  return smResultsState.drivers[name]?.country || "hu";
}
