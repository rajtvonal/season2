function calculateGains(data) {
  const lastRace = getLastRaceIndex(data);
  if (lastRace === -1) return data.map(driver => ({ ...driver, gain: 0 }));

  const prevRank = buildPreviousRank(data, lastRace);
  const currentRank = buildCurrentRank(data);

  return data.map(driver => ({
    ...driver,
    gain: (prevRank[driver.name] || currentRank[driver.name]) - currentRank[driver.name]
  }));
}

function getLastRaceIndex(data) {
  const config = getResultsConfig();

  for (let i = config.totalRaces - 1; i >= 0; i--) {
    if (data.some(driver => driver.results[i])) return i;
  }
  return -1;
}

function buildPreviousRank(data, lastRace) {
  const previous = data
    .map(driver => ({
      name: driver.name,
      total: driver.points
        .slice(0, lastRace)
        .reduce((sum, point) => point === "" || point === undefined ? sum : sum + point, 0)
    }))
    .sort((a, b) => b.total - a.total);

  return createRankMap(previous);
}

function buildCurrentRank(data) {
  return createRankMap([...data].sort((a, b) => b.total - a.total));
}

function createRankMap(data) {
  const rank = {};
  data.forEach((driver, index) => {
    rank[driver.name] = index + 1;
  });
  return rank;
}
