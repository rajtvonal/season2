async function loadPoints() {
  const config = getResultsConfig();
  const [racePoints, sprintPoints] = await Promise.all([
    loadPointMap(`${config.databasePath}/pontrendszer.csv`),
    loadPointMap(`${config.databasePath}/pontrendszer_sprint.csv`)
  ]);

  f1ResultsState.pointsMap = racePoints;
  f1ResultsState.sprintPointsMap = sprintPoints;
}

async function loadPointMap(file) {
  const text = await fetchText(file);
  const map = {};

  text.trim().split("\n").filter(Boolean).forEach(line => {
    const [pos, pts] = line.split(",");
    map[pos.trim()] = parseInt(pts, 10);
  });

  return map;
}

async function loadF1Data() {
  const config = getResultsConfig();
  const [drivers, teamData, races, sprints, qualis] = await Promise.all([
    loadDrivers(),
    loadTeams(),
    loadSeries("races", "R", "csv"),
    loadSeries("sprints", "S", "csv"),
    loadSeries("qualis", "Q", "csv")
  ]);

  f1ResultsState.drivers = drivers;
  f1ResultsState.teams = teamData.driverTeams;
  f1ResultsState.teamRosters = teamData.teamRosters;
  f1ResultsState.races = races;
  f1ResultsState.sprints = sprints;
  f1ResultsState.qualis = qualis;
  f1ResultsState.eventColumns = createEventColumns(config.totalRaces, sprints);
}

async function loadDrivers() {
  const text = await fetchText(`${getResultsConfig().databasePath}/drivers.csv`);
  const drivers = {};
  text.trim().split("\n").filter(Boolean).forEach(line => {
    const [country, name, division] = line.split(",").map(value => value.trim());
    drivers[name] = { country: country || "hu", division };
  });
  return drivers;
}

async function loadTeams() {
  const text = await fetchText(`${getResultsConfig().databasePath}/csapatok.csv`);
  const driverTeams = {};
  const teamRosters = {};
  text.trim().split("\n").filter(Boolean).forEach(line => {
    const [team, ...drivers] = line.split(",").map(value => value.trim()).filter(Boolean);
    teamRosters[team] = drivers;
    drivers.forEach(driver => { driverTeams[driver] = team; });
  });
  return { driverTeams, teamRosters };
}

async function loadSeries(folder, prefix, extension) {
  const files = [];
  for (let i = 1; i <= getResultsConfig().totalRaces; i++) {
    files.push(await loadOptionalCsv(`${getResultsConfig().databasePath}/${folder}/${prefix}${i}.${extension}`, i));
  }
  return files;
}

async function loadOptionalCsv(file, raceNumber) {
  const text = await fetchText(file);
  return text.trim() ? { raceNumber, rows: text.trim().split("\n") } : null;
}

async function fetchText(file) {
  return fetch(`${file}?v=${Date.now()}`)
    .then(response => response.ok ? response.text() : "")
    .catch(() => "");
}
