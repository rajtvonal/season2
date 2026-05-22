async function loadResults(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "main");

  await loadSimMastersData();
  const data = calculateGains(buildDriverStandings());
  setCurrentData(data);
  renderTable(data, "main");
  updateHeader(createResultsHeader(smResultsConfig.totalRaces));
}

function createResultsHeader(totalRaces) {
  const races = Array.from({ length: totalRaces }, (_, index) => `R${index + 1}`);
  return ["#", "Név", "Csapat", ...races, "Pont", "Gain"];
}

async function loadSimMastersData() {
  const [teams, drivers, races, qualis] = await Promise.all([
    loadTeams(),
    loadDrivers(),
    loadJsonSeries("races", "R"),
    loadJsonSeries("qualis", "Q")
  ]);

  smResultsState.teams = teams;
  smResultsState.drivers = drivers;
  smResultsState.races = races;
  smResultsState.qualis = qualis;
}

async function loadDrivers() {
  const text = await fetch(`${smResultsConfig.databasePath}/drivers.csv?v=${Date.now()}`)
    .then(response => response.ok ? response.text() : "")
    .catch(() => "");

  return text.trim() ? parseDrivers(text) : {};
}

async function loadTeams() {
  const text = await fetch(`${smResultsConfig.databasePath}/csapatok.csv?v=${Date.now()}`)
    .then(response => response.ok ? response.text() : "")
    .catch(() => "");

  return text.trim() ? parseTeams(text) : {};
}

async function loadJsonSeries(folder, prefix) {
  const files = [];
  for (let i = 1; i <= smResultsConfig.totalRaces; i++) {
    files.push(await loadJsonFile(`${smResultsConfig.databasePath}/${folder}/${prefix}${i}.json`, i));
  }
  return files;
}

async function loadJsonFile(file, raceNumber) {
  return fetch(`${file}?v=${Date.now()}`)
    .then(response => response.ok ? response.json() : null)
    .then(data => data ? { raceNumber, data: flattenResult(data) } : null)
    .catch(() => null);
}

function flattenResult(data) {
  return data.flatMap(group => group.result || []);
}

function parseTeams(text) {
  const teams = {};
  text.trim().split("\n").forEach(line => {
    const [team, ...drivers] = line.split(",").map(value => value.trim()).filter(Boolean);
    drivers.forEach(driver => { teams[driver] = team; });
  });
  return teams;
}

function parseDrivers(text) {
  const drivers = {};
  text.trim().split("\n").forEach(line => {
    const [country, name, driverClass, car] = line.split(",").map(value => value.trim());
    drivers[name] = { country, driverClass, car };
  });
  return drivers;
}
