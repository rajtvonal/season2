async function loadDrivers() {
  const text = await fetchSmText("drivers.csv");
  return text.trim() ? parseDrivers(text) : {};
}

async function loadTeams() {
  const text = await fetchSmText("csapatok.csv");
  return text.trim() ? parseTeams(text) : {};
}

async function loadJsonSeries(folder, prefix) {
  const files = [];
  for (let i = 1; i <= smResultsConfig.totalRaces; i++) {
    files.push(await loadJsonFile(`${folder}/${prefix}${i}.json`, i));
  }
  return files;
}

async function loadJsonFile(file, raceNumber) {
  return fetch(`${smResultsConfig.databasePath}/${file}?v=${Date.now()}`)
    .then(response => response.ok ? response.json() : null)
    .then(data => data ? { raceNumber, groups: parseClassGroups(data) } : null)
    .catch(() => null);
}

function parseClassGroups(data) {
  return data.map(group => ({
    label: group.carClass,
    className: normalizeClassName(group.carClass),
    result: group.result || []
  }));
}

function normalizeClassName(carClass) {
  return carClass.toLowerCase().includes("hyper") ? "Hypercar" : "LMGT3";
}

async function fetchSmText(file) {
  return fetch(`${smResultsConfig.databasePath}/${file}?v=${Date.now()}`)
    .then(response => response.ok ? response.text() : "")
    .catch(() => "");
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
