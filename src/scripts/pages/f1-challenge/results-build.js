async function loadResults(btn) {
  setActive(btn);
  hideRaceButtons();
  setClass("container results", "main");

  await loadF1Data();
  const data = calculateGains(buildDriverStandings());
  setCurrentData(addGapToFirst(data));
  renderTable(getCurrentData(), "main");
  updateHeader(createResultsHeader());
}

function buildDriverStandings() {
  const drivers = {};
  addRaceResults(drivers);
  addSprintResults(drivers);
  addQualifyingResults(drivers);
  return Object.values(drivers).sort((a, b) => b.total - a.total);
}

function addRaceResults(drivers) {
  f1ResultsState.races.forEach(race => {
    if (!race) return;
    race.rows.map(parseRaceRow).forEach(result => {
      updateDriverResult(drivers, result, race.raceNumber, false);
    });
  });
}

function addSprintResults(drivers) {
  f1ResultsState.sprints.forEach(sprint => {
    if (!sprint) return;
    sprint.rows.map(parseRaceRow).forEach(result => {
      updateDriverResult(drivers, result, sprint.raceNumber, true);
    });
  });
}

function addQualifyingResults(drivers) {
  f1ResultsState.qualis.forEach(quali => {
    if (!quali) return;
    quali.rows.map(parseQualiRow).forEach(result => {
      const driver = getOrCreateDriver(drivers, result.name);
      driver.idomeroeredmenyek[getRaceIndex(quali.raceNumber)] = result.position;
      driver.qualiDetails[getRaceIndex(quali.raceNumber)] = result;
    });
  });
}

function updateDriverResult(drivers, result, raceNumber, isSprint) {
  const driver = getOrCreateDriver(drivers, result.name);
  const eventIndex = getEventIndex(isSprint ? "sprint" : "race", raceNumber);
  const points = getPointsForPosition(result.position, isSprint);

  driver.results[eventIndex] = result.position;
  driver.points[eventIndex] = points;
  driver.total += points;
  if (!isSprint) driver.raceDetails[getRaceIndex(raceNumber)] = result;
}

function getOrCreateDriver(drivers, name) {
  if (!drivers[name]) drivers[name] = createDriver(name);
  return drivers[name];
}

function createDriver(name) {
  const meta = getDriverMeta(name);
  return {
    name,
    country: meta.country,
    team: getDriverTeam(name),
    results: Array(f1ResultsState.eventColumns.length).fill(""),
    points: Array(f1ResultsState.eventColumns.length).fill(0),
    idomeroeredmenyek: Array(getResultsConfig().totalRaces).fill(""),
    raceDetails: [],
    qualiDetails: [],
    total: 0
  };
}
