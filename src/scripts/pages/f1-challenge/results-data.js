function parseRaceRow(row) {
  const [position, name, total, best, pits] = row.split(",").map(value => value.trim());
  return { position, name, total, best, pits };
}

function parseQualiRow(row) {
  const [position, name, lap, tyre] = row.split(",").map(value => value.trim());
  const hasLap = lap && lap !== "-";
  return { position, name, lap: hasLap ? lap : "--.---", tyre: hasLap ? tyre || "-" : "-" };
}

function addGapToFirst(data) {
  const leaderPoints = data[0]?.total || 0;
  return data.map(driver => ({ ...driver, gapToFirst: leaderPoints - driver.total }));
}

function getDriverByName(name) {
  return getCurrentData().find(driver => driver.name === name);
}
