const smResultsState = {
  currentData: [],
  races: [],
  qualis: [],
  teams: {},
  drivers: {},
  activeClass: "Hypercar",
  activeView: "main"
};

const smResultsConfig = {
  databasePath: "../../database/SM",
  totalRaces: 8,
  classes: ["Hypercar", "LMGT3"]
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

function getDriverCountry(name) {
  return smResultsState.drivers[name]?.country || "hu";
}

function getDriverMeta(name) {
  return smResultsState.drivers[name] || {};
}
