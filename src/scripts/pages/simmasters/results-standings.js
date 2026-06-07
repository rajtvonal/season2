function buildDriverStandings(className) {
  const drivers = {};
  smResultsState.races.forEach(race => addRaceGroupResults(drivers, race, className));
  smResultsState.qualis.forEach(quali => addQualiGroupResults(drivers, quali, className));
  return Object.values(drivers).sort((a, b) => b.total - a.total);
}

function addRaceGroupResults(drivers, race, className) {
  if (!race) return;
  getClassGroup(race, className)?.result.forEach(result => {
    updateDriverRace(drivers, race.raceNumber, result);
  });
}

function addQualiGroupResults(drivers, quali, className) {
  if (!quali) return;
  getQualifyingOrder(getClassGroup(quali, className)?.result || []).forEach((result, index) => {
    updateDriverQuali(drivers, quali.raceNumber, result, index + 1);
  });
}

function getClassGroup(event, className) {
  return event.groups.find(group => group.className === className);
}

function updateDriverRace(drivers, raceNumber, result) {
  const driver = getOrCreateDriver(drivers, result.id, result);
  const raceIndex = raceNumber - 1;
  const position = result.dnf || result.dns ? "DNF" : String(result.position);
  const points = Number(result.pointTotal || result.pointsGiven || 0);
  driver.results[raceIndex] = position;
  driver.points[raceIndex] = points;
  driver.racePoints[raceIndex] = points;
  driver.total += points;
  driver.raceDetails[raceIndex] = result;
}

function updateDriverQuali(drivers, raceNumber, result, position) {
  const driver = getOrCreateDriver(drivers, result.id, result);
  const raceIndex = raceNumber - 1;
  driver.idomeroeredmenyek[raceIndex] = String(position);
  driver.qualiDetails[raceIndex] = result;
}

function getOrCreateDriver(drivers, name, source = {}) {
  if (!drivers[name]) drivers[name] = createSmDriver(name, source);
  return drivers[name];
}

function createSmDriver(name, source) {
  return {
    name,
    team: getDriverTeam(name),
    country: getDriverCountry(name),
    carNum: source.carNum || "",
    car: source.car || getDriverMeta(name).car || "",
    results: Array(smResultsConfig.totalRaces).fill(""),
    points: Array(smResultsConfig.totalRaces).fill(0),
    racePoints: Array(smResultsConfig.totalRaces).fill(0),
    idomeroeredmenyek: Array(smResultsConfig.totalRaces).fill(""),
    raceDetails: [],
    qualiDetails: [],
    total: 0
  };
}

function addGapToFirst(data) {
  const leader = data[0]?.total || 0;
  return data.map(driver => ({ ...driver, gapToFirst: leader - driver.total }));
}

function getQualifyingOrder(results) {
  return [...results].sort((a, b) => normalizeLap(a.bestLap) - normalizeLap(b.bestLap));
}

function normalizeLap(lap) {
  return lap && lap > 0 ? lap : Number.MAX_SAFE_INTEGER;
}
