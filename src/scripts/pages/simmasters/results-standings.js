function buildDriverStandings() {
  const drivers = {};

  smResultsState.races.forEach(race => {
    if (!race) return;
    race.data.forEach(result => updateDriverRace(drivers, race.raceNumber, result));
  });

  smResultsState.qualis.forEach(quali => {
    if (!quali) return;
    getQualifyingOrder(quali.data).forEach((result, index) => {
      updateDriverQuali(drivers, quali.raceNumber, result, index + 1);
    });
  });

  return Object.values(drivers).sort((a, b) => b.total - a.total);
}

function updateDriverRace(drivers, raceNumber, result) {
  const driver = getOrCreateDriver(drivers, result.id);
  const raceIndex = raceNumber - 1;
  const position = result.dns ? "DNS" : result.dnf ? "DNF" : String(result.position);
  const points = Number(result.pointTotal || result.pointsGiven || 0);

  driver.results[raceIndex] = position;
  driver.points[raceIndex] = points;
  driver.racePoints[raceIndex] = points;
  driver.total += points;
  driver.raceDetails[raceIndex] = result;
}

function updateDriverQuali(drivers, raceNumber, result, position) {
  const driver = getOrCreateDriver(drivers, result.id);
  const raceIndex = raceNumber - 1;
  driver.idomeroeredmenyek[raceIndex] = String(position);
  driver.qualiDetails[raceIndex] = result;
}

function getOrCreateDriver(drivers, name) {
  if (!drivers[name]) {
    drivers[name] = {
      name,
      team: getDriverTeam(name),
      country: getDriverCountry(name),
      results: Array(smResultsConfig.totalRaces).fill(""),
      points: Array(smResultsConfig.totalRaces).fill(""),
      racePoints: Array(smResultsConfig.totalRaces).fill(0),
      idomeroeredmenyek: Array(smResultsConfig.totalRaces).fill(""),
      raceDetails: [],
      qualiDetails: [],
      total: 0
    };
  }
  return drivers[name];
}

function getQualifyingOrder(results) {
  return [...results].sort((a, b) => normalizeLap(a.bestLap) - normalizeLap(b.bestLap));
}

function normalizeLap(lap) {
  return lap && lap > 0 ? lap : Number.MAX_SAFE_INTEGER;
}
