function getBestQualifyingLap(data) {
  const laps = data
    .map(driver => parseQualifyingLap(driver.lap))
    .filter(value => value !== null);
  return laps.length ? Math.min(...laps) : null;
}

function parseQualifyingLap(lap) {
  if (!lap || lap === "--.---") return null;
  return parseTime(lap);
}

function formatQualifyingGap(driver, best) {
  const lap = parseQualifyingLap(driver.lap);
  if (lap === null || best === null) return "-";
  const gap = lap - best;
  return gap === 0 ? "-" : `+${gap.toFixed(3)}`;
}
