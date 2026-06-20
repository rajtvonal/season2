function calculateGains(data) {
  const lastEvent = getLastEventIndex(data);
  if (lastEvent === -1) return data.map(driver => ({ ...driver, gain: 0 }));

  const prevRank = buildPreviousRank(data, lastEvent);
  const currentRank = buildCurrentRank(data);

  return data.map(driver => ({
    ...driver,
    gain: (prevRank[driver.name] || currentRank[driver.name]) - currentRank[driver.name]
  }));
}

function getLastEventIndex(data) {
  const length = data[0]?.results.length || 0;
  for (let i = length - 1; i >= 0; i--) {
    if (data.some(driver => driver.results[i])) return i;
  }
  return -1;
}

function buildPreviousRank(data, lastEvent) {
  const previous = data
    .map(driver => ({
      name: driver.name,
      total: driver.points.slice(0, lastEvent).reduce((sum, point) => sum + Number(point || 0), 0)
    }))
    .sort((a, b) => b.total - a.total);

  return createRankMap(previous);
}

function buildCurrentRank(data) {
  return createRankMap([...data].sort((a, b) => b.total - a.total));
}

function createRankMap(data) {
  const rank = {};
  data.forEach((driver, index) => { rank[driver.name] = index + 1; });
  return rank;
}
