function createStatistics(data) {
  return [...data]
    .map(driver => ({
      name: driver.name,
      wins: countWins(driver),
      poles: countPoles(driver),
      averagePoints: calculateAveragePoints(driver),
      averageQualifying: calculateAverageQualifying(driver),
      averagePositionGain: calculateAveragePositionGain(driver)
    }))
    .sort((a, b) => b.wins - a.wins || b.poles - a.poles || b.averagePoints - a.averagePoints);
}

function countWins(driver) {
  return driver.results.filter(result => result === "1").length;
}

function countPoles(driver) {
  return getQualifyingResults(driver).filter(result => result === "1").length;
}

function calculateAveragePoints(driver) {
  const raceCount = driver.results.filter(Boolean).length;
  return raceCount ? driver.total / raceCount : null;
}

function calculateAverageQualifying(driver) {
  const positions = getNumericPositions(getQualifyingResults(driver));
  return average(positions);
}

function calculateAveragePositionGain(driver) {
  const qualifying = getQualifyingResults(driver);
  const gains = driver.results
    .map((raceResult, index) => {
      const racePosition = parsePosition(raceResult);
      const qualifyingPosition = parsePosition(qualifying[index]);
      return racePosition && qualifyingPosition ? qualifyingPosition - racePosition : null;
    })
    .filter(value => value !== null);

  return average(gains);
}

function getQualifyingResults(driver) {
  return driver.idomeroeredmenyek || [];
}

function getNumericPositions(values) {
  return values.map(parsePosition).filter(Boolean);
}

function parsePosition(value) {
  const position = parseInt(value, 10);
  return Number.isFinite(position) ? position : null;
}

function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatAverage(value) {
  return value === null ? "-" : value.toFixed(2);
}

function formatPositionGain(value) {
  if (value === null) return "-";
  return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
}

function getPositionGainColor(value) {
  if (value === null || value === 0) return "#888";
  return value > 0 ? "#4ade80" : "#ef4444";
}
