function createStatistics(data) {
  return [...data]
    .map(driver => ({
      name: driver.name,
      country: driver.country,
      wins: countWins(driver),
      poles: countPoles(driver),
      averagePoints: calculateAveragePoints(driver),
      averageQualifying: calculateAverageQualifying(driver),
      averagePositionGain: calculateAveragePositionGain(driver)
    }))
    .sort((a, b) => b.wins - a.wins || b.poles - a.poles || b.averagePoints - a.averagePoints);
}

function countWins(driver) {
  return driver.raceDetails.filter(result => result?.position === "1").length;
}

function countPoles(driver) {
  return driver.idomeroeredmenyek.filter(result => result === "1").length;
}

function calculateAveragePoints(driver) {
  const starts = driver.raceDetails.filter(Boolean).length;
  return starts ? driver.total / starts : null;
}

function calculateAverageQualifying(driver) {
  return average(getNumericPositions(driver.idomeroeredmenyek));
}

function calculateAveragePositionGain(driver) {
  const gains = driver.raceDetails
    .map((raceResult, index) => {
      const racePosition = parsePosition(raceResult?.position);
      const qualifyingPosition = parsePosition(driver.idomeroeredmenyek[index]);
      return racePosition && qualifyingPosition ? qualifyingPosition - racePosition : null;
    })
    .filter(value => value !== null);

  return average(gains);
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
